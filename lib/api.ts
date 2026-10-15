import { parseNumber } from "./bn";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "./seed";
import type { Category, MarketPrice, Product, Trend } from "./types";

const BASES = [
  process.env.NEXT_PUBLIC_MAIN_API_URL || "https://openapi.programming-hero.com/api/bazardor",
  process.env.NEXT_PUBLIC_API_BASE_1 || "https://api.api-store.workers.dev/api/bazardor",
  process.env.NEXT_PUBLIC_API_BASE_2 || "https://api.abcz.workers.dev/api/bazardor",
];

const REVALIDATE_SECONDS = 300;

/* ----------------------------- fetch helpers ----------------------------- */

async function fetchJson(path: string, validResponse: (body: unknown) => boolean): Promise<unknown | null | undefined> {
  // `null` means the endpoint returned 404 on every reachable mirror.
  // `undefined` means all configured providers failed, so we can show an
  // explicitly documented offline sample rather than a misleading empty list.
  let notFound = false;
  let failed = false;
  for (const base of BASES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}${path}`, {
        signal: controller.signal,
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { accept: "application/json" },
      });
      if (res.status === 404) {
        notFound = true;
        continue; // another provider may have the requested product
      }
      if (!res.ok) { failed = true; continue; }
      const body: unknown = await res.json();
      // A provider can return HTTP 200 with an error page or unrelated JSON.
      // In that case check the next mirror rather than treating it as an empty API.
      if (!validResponse(body)) { failed = true; continue; }
      return body;
    } catch {
      // Network/DNS/timeout/invalid JSON: try the next provider.
      failed = true;
    } finally {
      clearTimeout(timer);
    }
  }
  // Only declare the endpoint genuinely missing if every provider reached
  // replied 404. A partial outage should not masquerade as an empty list.
  return notFound && !failed ? null : undefined;
}

/** Unwraps `[..]`, `{data:[..]}`, `{products:[..]}`, `{items:[..]}` etc. */
function toArray(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    for (const k of ["data", "products", "categories", "items", "results", "result", "payload", "records"]) {
      if (Array.isArray(o[k])) return o[k] as unknown[];
      if (o[k] && typeof o[k] === "object") {
        const inner = toArray(o[k]);
        if (inner) return inner;
      }
    }
  }
  return null;
}

function toObject(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const o = payload as Record<string, unknown>;
  for (const k of ["data", "product", "category", "item", "result", "payload"]) {
    if (o[k] && typeof o[k] === "object" && !Array.isArray(o[k])) return o[k] as Record<string, unknown>;
  }
  return o;
}

/* ------------------------------ normalizers ------------------------------ */

type Raw = Record<string, unknown>;

function pick(o: Raw, keys: string[]): unknown {
  for (const k of keys) if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
  return undefined;
}
function str(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return fallback;
}
function num(v: unknown, fallback = 0): number {
  const n = parseNumber(v);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeCategory(raw: unknown): Category | null {
  // Some /categories endpoints return plain slugs (e.g. ["chal", "dal"]).
  if (typeof raw === "string") {
    const slug = raw.trim();
    if (!slug) return null;
    const known = SEED_CATEGORIES.find((c) => c.slug === slug);
    return known ?? { slug, name: slug, icon: "🛒" };
  }
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Raw;
  const slug = str(pick(o, ["slug", "category_slug", "categorySlug", "id", "key"]));
  if (!slug) return null;
  return {
    slug,
    name: str(pick(o, ["name_bn", "nameBn", "bn_name", "name", "category_name", "categoryName", "title", "label"]), slug),
    nameEn: str(pick(o, ["name_en", "nameEn", "en_name", "english_name"])) || undefined,
    icon: str(pick(o, ["icon", "emoji"]), "🛒"),
  };
}

function normalizeMarket(raw: unknown): MarketPrice | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Raw;
  const single = pick(o, ["price", "today_price", "todayPrice", "currentPrice", "current_price", "retailPrice"]);
  const min = num(pick(o, ["min", "minPrice", "min_price", "minimum", "lowest", "low"]), num(single, NaN));
  const max = num(pick(o, ["max", "maxPrice", "max_price", "maximum", "highest", "high"]), num(single, NaN));
  const avgRaw = pick(o, ["avg", "average", "avgPrice", "avg_price", "mean"]);
  const avg = Number.isFinite(num(avgRaw, NaN)) ? num(avgRaw) : Number.isFinite(num(single, NaN)) ? num(single) : (min + max) / 2;
  const rawName = pick(o, ["market", "market_name", "marketName", "bazar", "bazar_name", "bazaar", "bazaar_name", "name", "title"]);
  const name = rawName && typeof rawName === "object"
    ? str(pick(rawName as Raw, ["name", "name_bn", "title"]))
    : str(rawName);
  if (!name || !Number.isFinite(min) || !Number.isFinite(max)) return null;
  return {
    market: name,
    region: str(pick(o, ["region", "division", "district", "city", "location", "area"]), "—"),
    min,
    max,
    avg,
  };
}

/** Flatten nested objects into [normalizedKey, value] pairs (arrays are skipped). */
function flatten(o: Raw, prefix = "", out: [string, unknown][] = []): [string, unknown][] {
  for (const [k, v] of Object.entries(o)) {
    const key = prefix + k.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (Array.isArray(v)) continue;
    if (v && typeof v === "object") flatten(v as Raw, key, out);
    else out.push([key, v]);
  }
  return out;
}

const NOT_TODAY = /yesterday|prev|last|old|before|min|max|avg|average|mean|change|diff|delta|percent|pct|rise|fall|increase|decrease|trend|direction|unit|id$|rating|stock|qty|quantity/;

function findNumber(flat: [string, unknown][], include: RegExp, exclude?: RegExp): number {
  for (const [k, v] of flat) {
    if (include.test(k) && !(exclude && exclude.test(k))) {
      const n = parseNumber(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return NaN;
}

export function normalizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Raw;

  const id = str(pick(o, ["id", "_id", "product_id", "productId"]));
  const name = str(pick(o, ["name_bn", "nameBn", "bn_name", "name", "product_name", "productName", "title"]));
  // IDs alone are not valid products: showing blank cards is worse than
  // allowing the next API mirror to supply the proper object.
  if (!name) return null;
  const nameEn = str(pick(o, ["name_en", "nameEn", "en_name", "english_name", "englishName", "title_en"]));

  // category may be a string or an object
  const catRaw = pick(o, ["category", "category_slug", "categorySlug", "category_id", "categoryId"]);
  let categorySlug = "";
  let categoryName = "";
  if (catRaw && typeof catRaw === "object") {
    const c = normalizeCategory(catRaw);
    categorySlug = c?.slug ?? "";
    categoryName = c?.name ?? "";
  } else {
    categorySlug = str(catRaw);
  }
  categoryName =
    categoryName ||
    str(pick(o, ["category_name", "categoryName", "category_bn"])) ||
    SEED_CATEGORIES.find((c) => c.slug === categorySlug)?.name ||
    categorySlug;

  /* ---- markets (needed as a price fallback) ---- */
  const marketsRaw = pick(o, ["markets", "market_prices", "marketPrices", "bazars", "bazaars", "bazarPrices", "bazaarPrices", "prices", "market_wise", "marketWise", "market_data", "marketData"]);
  const marketRows = Array.isArray(marketsRaw)
    ? marketsRaw
    : marketsRaw && typeof marketsRaw === "object"
      ? Object.entries(marketsRaw as Raw).map(([name, data]) =>
          data && typeof data === "object" ? { name, ...(data as Raw) } : { name, price: data })
      : [];
  const markets = marketRows
    .map(normalizeMarket)
    .filter((m): m is MarketPrice => m !== null);
  const mins = markets.map((m) => m.min);
  const maxs = markets.map((m) => m.max);
  const marketAvg = markets.length ? markets.reduce((s, m) => s + m.avg, 0) / markets.length : NaN;

  /* ---- today's price ---- */
  const flat = flatten(o);
  const priority = ["price", "today_price", "todayPrice", "current_price", "currentPrice", "todays_price", "latest_price", "latestPrice", "rate", "today", "current", "amount", "unit_price", "retail_price", "retailPrice"];
  let price = NaN;
  for (const k of priority) {
    const n = parseNumber(o[k]);
    if (Number.isFinite(n)) { price = n; break; }
  }
  if (!Number.isFinite(price)) price = findNumber(flat, /price|today|current|latest|rate|dam|amount/, NOT_TODAY);
  if (!Number.isFinite(price)) price = marketAvg;
  const avgDirect = findNumber(flat, /^(avg|average|mean)(price)?$|avgprice|averageprice/);
  if (!Number.isFinite(price)) price = avgDirect;
  if (!Number.isFinite(price) && markets.length) price = (Math.min(...mins) + Math.max(...maxs)) / 2;
  if (!Number.isFinite(price)) price = 0;

  /* ---- change: percent / amount / previous price / direction ---- */
  const prev = findNumber(flat, /yesterday|prev|last|old|before/, /percent|pct|change|diff/);
  const pctKeyVal = findNumber(flat, /percent|pct/);
  // a bare `change` key is treated as a PERCENT (see changeRaw); only explicit amount-style keys count as taka
  const amountVal = findNumber(flat, /changeamount|amountchange|pricechange|changeprice|difference|diff|delta/, /percent|pct/);
  const changeRaw = pick(o, ["change_percent", "changePercent", "change_percentage", "changePercentage", "change_pct", "changePct", "percent_change", "percentChange", "percentage", "change"]);
  const trendStr = [
    ...flat.filter(([k]) => /trend|direction|changetype|status|movement/.test(k)).map(([, v]) => String(v)),
    typeof changeRaw === "string" ? changeRaw : "",
  ].join(" ").toLowerCase();

  let signed = NaN; // signed change in percent
  if (Number.isFinite(pctKeyVal)) signed = pctKeyVal;
  else if (typeof changeRaw === "string" && /%/.test(changeRaw)) signed = parseNumber(changeRaw);
  else if (Number.isFinite(prev) && prev > 0) signed = ((price - prev) / prev) * 100;
  else if (Number.isFinite(amountVal) && price - amountVal > 0) signed = (amountVal / (price - amountVal)) * 100;
  else if (Number.isFinite(parseNumber(changeRaw))) signed = parseNumber(changeRaw);
  if (!Number.isFinite(signed)) signed = 0;

  let trend: Trend;
  if (/\b(up|rise|rising|increase|increased|higher|bullish)\b|▲|বেড়|বৃদ্ধি/i.test(trendStr)) trend = "up";
  else if (/\b(down|fall|falling|decrease|decreased|lower|bearish)\b|▼|কম|হ্রাস|পতন/i.test(trendStr)) trend = "down";
  else if (/\b(flat|same|stable|none|unchanged)\b|—|অপরিবর্তিত/i.test(trendStr)) trend = "flat";
  else trend = signed > 0.0001 ? "up" : signed < -0.0001 ? "down" : "flat";
  const changePct = trend === "flat" ? 0 : trend === "up" ? Math.abs(signed) : -Math.abs(signed);

  const min = num(pick(o, ["min_price", "minPrice", "min", "minimum_price"]), mins.length ? Math.min(...mins) : price);
  const max = num(pick(o, ["max_price", "maxPrice", "max", "maximum_price"]), maxs.length ? Math.max(...maxs) : price);
  const avg = num(
    pick(o, ["avg_price", "avgPrice", "average_price", "averagePrice", "avg", "average"]),
    Number.isFinite(marketAvg) ? marketAvg : price,
  );

  return {
    id: id || name,
    slug: str(pick(o, ["slug", "product_slug", "productSlug"])) || id || name,
    name,
    nameEn: nameEn || undefined,
    emoji: (() => {
      const icon = str(pick(o, ["emoji", "icon"]));
      if (icon && !/^https?:|\//i.test(icon) && icon.length <= 8) return icon;
      return SEED_CATEGORIES.find((category) => category.slug === categorySlug)?.icon ?? "🛒";
    })(),
    unit: normalizeUnit(str(pick(o, ["unit", "unit_bn", "unitBn", "per"]), "প্রতি কেজি")),
    categorySlug,
    categoryName,
    price,
    changePct,
    trend,
    description: str(pick(o, ["description", "summary", "subtitle", "market_summary", "marketSummary"])),
    min,
    max,
    avg,
    markets,
  };
}

/** "কেজি" -> "প্রতি কেজি"; leaves "প্রতি কেজি" untouched. */
function normalizeUnit(u: string): string {
  const t = u.trim();
  if (!t) return "প্রতি কেজি";
  return t.startsWith("প্রতি") ? t : `প্রতি ${t}`;
}

/* ------------------------------ public API ------------------------------- */

/** A valid empty list is real data, not an outage. Reject malformed 200 replies. */
const hasProductList = (body: unknown) => {
  const list = toArray(body);
  return list !== null && (list.length === 0 || list.some((item) => normalizeProduct(item) !== null));
};
const hasCategoryList = (body: unknown) => {
  const list = toArray(body);
  return list !== null && (list.length === 0 || list.some((item) => normalizeCategory(item) !== null));
};
const hasProduct = (body: unknown) => {
  const o = toObject(body);
  return Boolean(o && normalizeProduct(o));
};
const hasCategory = (body: unknown) => {
  const o = toObject(body);
  return Boolean(o && normalizeCategory(o));
};

export async function getCategories(): Promise<Category[]> {
  const payload = await fetchJson("/categories", hasCategoryList);
  const list = toArray(payload);
  const cats = (list ?? []).map(normalizeCategory).filter((c): c is Category => c !== null);
  // Distinct slugs avoid duplicate navbar keys if a provider repeats a category.
  const unique = [...new Map(cats.map((c) => [c.slug, c])).values()];
  return unique.length ? unique : payload === undefined ? SEED_CATEGORIES : [];
}

export type ProductFeed = { products: Product[]; isSample: boolean };

/** Call this on pages that must disclose when illustrative demo data are shown. */
export async function getProductFeed(category?: string): Promise<ProductFeed> {
  const payload = await fetchJson(category ? `/products?category=${encodeURIComponent(category)}` : "/products", hasProductList);
  const list = toArray(payload);
  const items = (list ?? []).map(normalizeProduct).filter((p): p is Product => p !== null);
  // Do not trust every backend to enforce ?category: prevent unrelated cards.
  const filtered = category ? items.filter((p) => !p.categorySlug || p.categorySlug === category) : items;
  if (payload === undefined) {
    return {
      products: category ? SEED_PRODUCTS.filter((p) => p.categorySlug === category) : SEED_PRODUCTS,
      isSample: true,
    };
  }
  return { products: filtered, isSample: false };
}

export async function getProducts(category?: string): Promise<Product[]> {
  return (await getProductFeed(category)).products;
}

export async function getProductResult(idOrSlug: string): Promise<{ product: Product | null; isSample: boolean }> {
  const payload = await fetchJson(`/products/${encodeURIComponent(idOrSlug)}`, hasProduct);
  const obj = toObject(payload);
  const fromApi = obj ? normalizeProduct(obj) : null;
  if (fromApi) return { product: fromApi, isSample: false };

  // Some services accept product IDs but not human-readable slugs.
  const feed = await getProductFeed();
  return {
    product: feed.products.find((p) => p.slug === idOrSlug || p.id === idOrSlug) ?? null,
    isSample: feed.isSample,
  };
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  return (await getProductResult(idOrSlug)).product;
}

export async function getCategory(slug: string): Promise<Category | null> {
  const payload = await fetchJson(`/categories/${encodeURIComponent(slug)}`, hasCategory);
  const obj = toObject(payload);
  const fromApi = obj ? normalizeCategory(obj) : null;
  if (fromApi && fromApi.slug === slug) return fromApi;
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}
