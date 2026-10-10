"use client";

import type { Trend } from "@/lib/types";
import { percent } from "@/lib/bn";
import { useLang } from "./LangProvider";

const STYLE: Record<Trend, { symbol: string; cls: string }> = {
  up: { symbol: "▲", cls: "text-up" },
  down: { symbol: "▼", cls: "text-down" },
  flat: { symbol: "—", cls: "text-flat" },
};

export function trendClass(t: Trend) {
  return STYLE[t].cls;
}
export function trendSymbol(t: Trend) {
  return STYLE[t].symbol;
}

/** ▲ ২.১%  /  ▼ ২.৯%  /  — ০.০%  (pill, as in the design) */
export default function PriceBadge({ trend, changePct, size = "sm" }: { trend: Trend; changePct: number; size?: "sm" | "md" }) {
  const lang = useLang();
  const s = STYLE[trend];
  const label =
    trend === "up"
      ? lang === "en" ? "Price increased" : "দাম বেড়েছে"
      : trend === "down"
        ? lang === "en" ? "Price decreased" : "দাম কমেছে"
        : lang === "en" ? "Price unchanged" : "দাম অপরিবর্তিত";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-base-200 font-semibold ${s.cls} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      aria-label={label}
    >
      <span aria-hidden>{s.symbol}</span>
      {percent(changePct, lang)}
    </span>
  );
}
