import type { Category, Product } from "./types";

/**
 * Offline fallback built from the Figma design. It is ONLY used when both API
 * base URLs are unreachable, so the site never shows a blank page.
 */
export const SEED_CATEGORIES: Category[] = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "tel", name: "তেল", icon: "🛢️" },
  { slug: "sobji", name: "সবজি", icon: "🥬" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
  { slug: "dim-dudh", name: "ডিম-দুধ", icon: "🥛" },
  { slug: "moshla", name: "মসলা", icon: "🌶️" },
];

// [emoji, name, unit, category, price, signedChange%]
type Row = [string, string, string, string, number, number];
const ROWS: Row[] = [
  ["🍚", "স্বর্ণমাছি চাল", "প্রতি কেজি", "chal", 148, 2.1],
  ["🍚", "মিনিকেট চাল", "প্রতি কেজি", "chal", 99, -2.9],
  ["🍚", "নাজির চাল", "প্রতি কেজি", "chal", 74, 0],
  ["🍚", "বাটাম সাইজ চাল", "প্রতি কেজি", "chal", 66, 3.1],
  ["🫘", "মসুর ডাল", "প্রতি কেজি", "dal", 142, 2.9],
  ["🫘", "মুগ ডাল", "প্রতি কেজি", "dal", 135, 0],
  ["🫘", "ছোলা", "প্রতি কেজি", "dal", 120, -2.4],
  ["🫘", "আমন ডাল (খোসাসিলা)", "প্রতি কেজি", "dal", 156, 2.6],
  ["🫙", "সরিষার তেল", "প্রতি লিটার", "tel", 192, 2.1],
  ["🛢️", "পাম তেল", "প্রতি কেজি", "tel", 168, -2.3],
  ["🫙", "ঘানি ভাঙা সরিষার তেল", "প্রতি লিটার", "tel", 215, 2.4],
  ["🥔", "আলু", "প্রতি কেজি", "sobji", 30, -6.2],
  ["🧅", "পেঁয়াজ", "প্রতি কেজি", "sobji", 54, 12.5],
  ["🌶️", "কাঁচামরিচ", "প্রতি কেজি", "sobji", 92, -12.4],
  ["🍆", "বেগুন", "প্রতি কেজি", "sobji", 44, 4.8],
  ["🟢", "ঢেঁড়স", "প্রতি কেজি", "sobji", 38, 0],
  ["🐟", "রুই মাছ", "প্রতি কেজি", "mach", 46, 4.5],
  ["🐟", "তেলাপিয়া", "প্রতি কেজি", "mach", 36, 0],
  ["🐠", "ইলিশ মাছ", "প্রতি কেজি", "mach", 1850, 3.4],
  ["🐠", "কাতলা মাছ", "প্রতি কেজি", "mach", 43, -4.4],
  ["🦐", "চিংড়ি মাছ (খোলা)", "প্রতি কেজি", "mach", 330, 3.1],
  ["🍗", "মুরগির মাংস", "প্রতি কেজি", "mangsho", 225, -1.3],
  ["🥩", "গরুর মাংস", "প্রতি কেজি", "mangsho", 790, -1.2],
  ["🍖", "খাসির মাংস", "প্রতি কেজি", "mangsho", 1290, -3.0],
  ["🦆", "হাঁসের মাংস", "প্রতি কেজি", "mangsho", 285, -3.4],
  ["🥚", "ডিম", "প্রতি ডজন", "dim-dudh", 158, 3.9],
  ["🥛", "দুধ", "প্রতি লিটার", "dim-dudh", 102, 2.0],
  ["🥣", "দই", "প্রতি লিটার", "dim-dudh", 92, 0],
  ["🧈", "মাখন (১০০ গ্রাম)", "প্রতি পিস", "dim-dudh", 145, 3.6],
  ["🫚", "আদা", "প্রতি কেজি", "moshla", 85, 9.0],
  ["🧄", "রসুন", "প্রতি কেজি", "moshla", 125, -7.4],
  ["🌶️", "মরিচ গুঁড়া", "প্রতি কেজি", "moshla", 245, -2.0],
  ["🍃", "ধনেপাতা গুঁড়া", "প্রতি কেজি", "moshla", 265, 0],
];

// The 12 market rows shown in the Figma "বাজারভিত্তিক আজকের দাম" table.
const MARKETS: [string, string][] = [
  ["মাঠ বাজার", "ময়মনসিংহ"],
  ["সদর বাজার", "রাজশাহী"],
  ["বাজারহাট", "খুলনা"],
  ["বাসারহাট বাজার", "রাজশাহী"],
  ["চৌর বাজার", "ময়মনসিংহ"],
  ["আমতলী বাজার", "চট্টগ্রাম"],
  ["ডবলগেট বাজার", "খুলনা"],
  ["চৌরাস্তা বাজার", "সিলেট"],
  ["গ্রীন মার্কেট, মিরপুর", "ঢাকা"],
  ["চৌদগ্রাম বাজার", "চট্টগ্রাম"],
  ["আমবাজার", "সিলেট"],
  ["কারওয়ান বাজার", "ঢাকা"],
];

export const SEED_PRODUCTS: Product[] = ROWS.map(([emoji, name, unit, cat, price, change], i) => {
  const catName = SEED_CATEGORIES.find((c) => c.slug === cat)?.name ?? cat;
  const lo = Math.max(1, Math.round(price * 0.9));
  const hi = Math.round(price * 1.1);
  const markets = MARKETS.map(([market, region], k) => {
    const t = k / (MARKETS.length - 1);
    const min = Math.round(lo + (hi - lo) * 0.35 * t * 2) ;
    const max = Math.round(min + (hi - lo) * 0.3 + (hi - lo) * 0.2 * t);
    return { market, region, min, max: Math.min(max, hi), avg: (min + Math.min(max, hi)) / 2 };
  });
  const diff = Math.round(price - price / (1 + change / 100));
  return {
    id: String(i + 1),
    slug: String(i + 1),
    name,
    emoji,
    unit,
    categorySlug: cat,
    categoryName: catName,
    price,
    changePct: change,
    trend: change > 0 ? "up" : change < 0 ? "down" : "flat",
    description: "",
    min: Math.min(...markets.map((m) => m.min)),
    max: Math.max(...markets.map((m) => m.max)),
    avg: price,
    markets,
  };
});
