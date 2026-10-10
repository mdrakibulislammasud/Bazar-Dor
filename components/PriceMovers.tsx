"use client";

import type { Product } from "@/lib/types";
import ProductGrid from "./ProductGrid";
import { useT } from "./LangProvider";

export default function PriceMovers({ kind, products }: { kind: "up" | "down"; products: Product[] }) {
  const t = useT();
  const up = kind === "up";
  return (
    <section aria-labelledby={`movers-${kind}`} className="space-y-4">
      <h2 id={`movers-${kind}`} className="flex items-center gap-2 text-xl font-bold">
        <span className={up ? "text-up" : "text-down"} aria-hidden>
          {up ? "▲" : "▼"}
        </span>
        {up ? t("আজ দাম বেড়েছে", "Prices went up today") : t("আজ দাম কমেছে", "Prices went down today")}
      </h2>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-base-300 bg-base-100 p-6 text-center text-sm opacity-70">
          {up ? t("আজ কোনো পণ্যের দাম বাড়েনি।", "No product prices went up today.") : t("আজ কোনো পণ্যের দাম কমেনি।", "No product prices went down today.")}
        </p>
      )}
    </section>
  );
}
