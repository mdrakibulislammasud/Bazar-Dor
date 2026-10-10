"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { taka } from "@/lib/bn";
import { productLabel, unitLabel } from "@/lib/i18n";
import PriceBadge from "./PriceBadge";
import { useLang, useT } from "./LangProvider";

export default function ProductCard({ product }: { product: Product }) {
  const lang = useLang();
  const t = useT();
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="card border border-base-300 bg-base-100 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="card-body gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-base-200 text-2xl" aria-hidden>
            {product.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold leading-6">{productLabel(product, lang)}</h3>
            <p className="text-xs opacity-70">{unitLabel(product.unit, lang)}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs opacity-70">{t("আজকের দাম", "Today's price")}</p>
            <p className="text-xl font-bold leading-7">{taka(product.price, lang)}</p>
          </div>
          <PriceBadge trend={product.trend} changePct={product.changePct} />
        </div>
      </div>
    </Link>
  );
}
