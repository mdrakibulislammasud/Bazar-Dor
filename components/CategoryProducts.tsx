"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { fmtNum } from "@/lib/bn";
import ProductGrid from "./ProductGrid";
import { useLang, useT } from "./LangProvider";

type SortKey = "default" | "asc" | "desc";

export default function CategoryProducts({ products }: { products: Product[] }) {
  const lang = useLang();
  const t = useT();
  const [sort, setSort] = useState<SortKey>("default");

  const sorted = useMemo(() => {
    if (sort === "default") return products;
    const copy = [...products];
    // `price` is already a NUMBER (Bengali digits parsed in lib/api), so this is a numeric — not lexical — sort.
    copy.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
    return copy;
  }, [products, sort]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2 rounded-2xl border border-base-300 bg-base-100 px-4 py-3">
        <label htmlFor="sort" className="text-sm">{t("সাজান", "Sort")}</label>
        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-base-300 bg-base-100 pl-3 pr-8 text-xs font-medium outline-none focus:border-primary sm:text-sm"
          >
            <option value="default">{t("ডিফল্ট", "Default")}</option>
            <option value="asc">{t("দাম: কম থেকে বেশি", "Price: Low to High")}</option>
            <option value="desc">{t("দাম: বেশি থেকে কম", "Price: High to Low")}</option>
          </select>
          <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 fill-current opacity-70">
            <path d="M5.5 7.5 10 12l4.5-4.5-1.1-1.1L10 9.8 6.6 6.4z" />
          </svg>
        </div>
      </div>
      <p className="text-sm opacity-80">
        {t(`মোট ${fmtNum(sorted.length, lang)}টি পণ্য দেখানো হচ্ছে`, `Showing ${sorted.length} products`)}
      </p>
      <ProductGrid products={sorted} />
    </div>
  );
}
