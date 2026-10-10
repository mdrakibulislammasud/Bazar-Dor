import Hero from "@/components/Hero";
import PriceMovers from "@/components/PriceMovers";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/api";
import { fmtNum } from "@/lib/bn";
import { getT } from "@/lib/lang";

export default async function HomePage() {
  const products = await getProducts();
  const { lang, t } = await getT();

  const risers = products
    .filter((p) => p.changePct > 0)
    .sort((a, b) => b.changePct - a.changePct)
    .slice(0, 6);
  const fallers = products
    .filter((p) => p.changePct < 0)
    .sort((a, b) => a.changePct - b.changePct)
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <Hero />
      <PriceMovers kind="up" products={risers} />
      <PriceMovers kind="down" products={fallers} />

      <section id="সব-পণ্য" aria-labelledby="all-products" className="scroll-mt-32 space-y-2">
        <h2 id="all-products" className="text-xl font-bold">
          {t("সব পণ্য", "All Products")}
        </h2>
        <p className="pb-2 text-sm opacity-80">
          {t(`মোট ${fmtNum(products.length, lang)}টি পণ্য দেখানো হচ্ছে`, `Showing ${products.length} products`)}
        </p>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <p className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center opacity-70">
            {t("এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।", "No product data is available right now. Please try again shortly.")}
          </p>
        )}
      </section>
    </div>
  );
}
