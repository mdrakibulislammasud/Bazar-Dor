import type { Metadata } from "next";
import CategoryProducts from "@/components/CategoryProducts";
import EmptyState from "@/components/EmptyState";
import { getCategory, getProducts } from "@/lib/api";
import { fmtNum } from "@/lib/bn";
import { catLabel } from "@/lib/i18n";
import { getT } from "@/lib/lang";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(decodeURIComponent(slug));
  return { title: category ? category.name : "পাতাটি পাওয়া যায়নি" };
}

export default async function CategoryPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);
  const [category, products] = await Promise.all([getCategory(slug), getProducts(slug)]);
  const { lang, t } = await getT();

  // invalid slug OR a category with no items → 404-style empty state
  if (!category || products.length === 0) {
    return (
      <EmptyState
        title={t("৪০৪ — কোনো পণ্য পাওয়া যায়নি", "404 — No products found")}
        message={t("এই বিভাগে কোনো পণ্য নেই অথবা বিভাগটি সঠিক নয়।", "This category has no products or the category is invalid.")}
      />
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        <span className="text-4xl" aria-hidden>
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold">{category.nameEn && lang === "en" ? category.nameEn : catLabel(category.name, lang)}</h1>
          <p className="text-sm opacity-80">
            {t(`${fmtNum(products.length, lang)}টি পণ্যের আজকের দাম ও পরিবর্তন`, `Today's prices and changes for ${products.length} products`)}
          </p>
        </div>
      </header>
      <CategoryProducts products={products} />
    </div>
  );
}
