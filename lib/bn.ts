const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert any Bengali digits inside a string to ASCII digits. */
export function bnToEn(input: string): string {
  return input.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

/**
 * Parse a number from anything: 148, "148", "১৪৮ টাকা", "১,৮৫০", "▼ ২.৯%".
 * Returns NaN when no number can be found. Used so sorting is NUMERIC, never lexical.
 */
export function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return NaN;
  const cleaned = bnToEn(value).replace(/,/g, "").replace(/[^\d.\-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return NaN;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/** 1850 -> "১,৮৫০" ; 63.5 -> "৬৩.৫০" when fixed=2 */
export function toBn(n: number, opts?: { fixed?: number }): string {
  if (!Number.isFinite(n)) return "—";
  const fixed = opts?.fixed;
  const s = fixed !== undefined ? n.toFixed(fixed) : String(Math.round(n * 100) / 100);
  const [int, dec] = s.split(".");
  const withCommas = Number(int).toLocaleString("en-US");
  const out = dec ? `${withCommas}.${dec}` : withCommas;
  return out.replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

import type { Lang } from "./i18n";

function enNum(n: number, fixed?: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", fixed !== undefined ? { minimumFractionDigits: fixed, maximumFractionDigits: fixed } : { maximumFractionDigits: 2 });
}

/** Number in the active language. */
export function fmtNum(n: number, lang: Lang = "bn", opts?: { fixed?: number }) {
  return lang === "en" ? enNum(n, opts?.fixed) : toBn(n, opts);
}

/** 148 -> "১৪৮ টাকা" / "৳148" */
export function taka(n: number, lang: Lang = "bn", opts?: { fixed?: number }): string {
  return lang === "en" ? `৳${enNum(n, opts?.fixed)}` : `${toBn(n, opts)} টাকা`;
}

/** 2.1 -> "২.১%" / "2.1%" (one decimal like the design) */
export function percent(n: number, lang: Lang = "bn"): string {
  return `${fmtNum(Math.abs(n), lang, { fixed: 1 })}%`;
}

/** Integers stay plain (৬২ টাকা), fractions get two decimals (৬৩.৫০ টাকা). */
export function priceText(n: number, lang: Lang = "bn"): string {
  return taka(n, lang, Number.isInteger(n) ? undefined : { fixed: 2 });
}

/** "মঙ্গলবার, ৬ অক্টোবর, ২০২৬" / "Tuesday, 6 October, 2026" — Asia/Dhaka so server & client agree. */
export function banglaDate(date: Date = new Date(), lang: Lang = "bn"): string {
  const parts = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("weekday")}, ${get("day")} ${get("month")}, ${get("year")}`;
}
