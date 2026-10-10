"use client";

import type { Product } from "@/lib/types";
import { fmtNum, percent } from "@/lib/bn";
import { productLabel, unitShort, type Lang } from "@/lib/i18n";
import { trendClass, trendSymbol } from "./PriceBadge";
import { useLang, useT } from "./LangProvider";

function ItemRow({ p, lang }: { p: Product; lang: Lang }) {
  const price = lang === "en" ? `৳${fmtNum(p.price, lang)}` : `${fmtNum(p.price, lang)} টাকা`;
  return (
    <li className="flex shrink-0 items-center gap-2 border-r border-base-200 px-4 py-2 text-sm whitespace-nowrap">
      <span aria-hidden>{p.emoji}</span>
      <span className="font-medium">{productLabel(p, lang)}</span>
      <span>{`${price}/${unitShort(p.unit, lang)}`}</span>
      <span className={`font-semibold ${trendClass(p.trend)}`}>
        {trendSymbol(p.trend)} {percent(p.changePct, lang)}
      </span>
    </li>
  );
}

/** Infinite scrolling strip. The list is rendered twice and translated by -50% for a seamless loop. */
export default function Ticker({ products }: { products: Product[] }) {
  const lang = useLang();
  const t = useT();
  if (!products.length) return null;
  return (
    <div className="ticker-wrap overflow-hidden border-b border-base-300 bg-base-100" aria-label={t("আজকের দামের টিকার", "Today's price ticker")}>
      <div className="ticker-track">
        <ul className="flex">
          {products.map((p) => (
            <ItemRow key={`a-${p.id}`} p={p} lang={lang} />
          ))}
        </ul>
        <ul className="flex" aria-hidden>
          {products.map((p) => (
            <ItemRow key={`b-${p.id}`} p={p} lang={lang} />
          ))}
        </ul>
      </div>
    </div>
  );
}
