import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PriceBadge from "@/components/PriceBadge";
import { getProduct } from "@/lib/api";
import { fmtNum, priceText } from "@/lib/bn";
import { catLabel, placeLabel, productLabel, unitLabel, unitShort } from "@/lib/i18n";
import { getT } from "@/lib/lang";
import { getServerSession } from "@/lib/session";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "পণ্যের বিস্তারিত" };

export default async function ProductDetailPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);
  const { lang, t } = await getT();

  // 🔒 Protected route — requires login
  const session = await getServerSession();
  if (!session) {
    redirect(`/signin?reason=login-required&from=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const product = await getProduct(slug);
  if (!product) notFound();

  const pName = productLabel(product, lang);
  const cName = catLabel(product.categoryName, lang);
  const unitFull = unitLabel(product.unit, lang);
  const unitS = unitShort(product.unit, lang);
  const prev = product.price / (1 + product.changePct / 100);
  const diff = Math.round(Math.abs(product.price - prev));
  const diffText = lang === "en" ? `৳${fmtNum(diff, lang)}` : `${fmtNum(diff, lang)} টাকা`;
  const changeLine =
    product.trend === "flat"
      ? t("গতকালের তুলনায় আজ দামে কোনো পরিবর্তন নেই", "No change in price compared to yesterday")
      : product.trend === "up"
        ? t(`গতকালের তুলনায় আজ দাম বেড়েছে · ${diffText}`, `Price is up ${diffText} compared to yesterday`)
        : t(`গতকালের তুলনায় আজ দাম কমেছে · ${diffText}`, `Price is down ${diffText} compared to yesterday`);

  const stats = [
    { label: t("সর্বনিম্ন দাম", "Minimum price"), value: product.min, hint: t("সবচেয়ে কম দামের বাজার", "Lowest-priced market"), color: "text-down" },
    { label: t("সর্বাধিক দাম", "Maximum price"), value: product.max, hint: t("সবচেয়ে বেশি দামের বাজার", "Highest-priced market"), color: "text-up" },
    { label: t("গড় দাম", "Average price"), value: product.avg, hint: t(`${product.unit}-এর হিসাবে`, `Calculated ${unitFull}`), color: "text-primary" },
  ];

  return (
    <div className="space-y-5">
      <nav aria-label="breadcrumb" className="text-sm opacity-80">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">{t("হোম", "Home")}</Link>
          </li>
          {product.categorySlug && (
            <li className="flex items-center gap-1">
              <span aria-hidden>›</span>
              <Link href={`/category/${product.categorySlug}`} className="hover:text-primary">
                {cName}
              </Link>
            </li>
          )}
          <li className="flex items-center gap-1" aria-current="page">
            <span aria-hidden>›</span>
            {pName}
          </li>
        </ol>
      </nav>

      {/* Summary */}
      <section className="flex flex-col gap-5 rounded-2xl border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-base-200 text-4xl sm:size-20" aria-hidden>
            {product.emoji}
          </div>
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{pName}</h1>
            <p className="text-sm opacity-80">
              {unitFull}
              {cName && ` · ${cName}`}
            </p>
            <p className="text-sm opacity-80">{changeLine}</p>
            {product.description && <p className="text-xs opacity-60">{product.description}</p>}
            <div className="flex flex-wrap gap-2 pt-1">
              {product.categoryName && (
                <Link href={`/category/${product.categorySlug}`} className="badge badge-outline badge-primary">
                  {cName}
                </Link>
              )}
              <span className="badge badge-outline">{unitFull}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-2xl bg-base-200 px-6 py-4 text-center">
          <span className="text-sm opacity-80">{t("আজকের দাম", "Today's price")}</span>
          <span className="text-3xl font-bold leading-9">{lang === "en" ? "৳" : ""}{fmtNum(product.price, lang)}</span>
          <span className="text-sm opacity-80">{lang === "en" ? `per ${unitS}` : `টাকা / ${unitS}`}</span>
          <div className="pt-1">
            <PriceBadge trend={product.trend} changePct={product.changePct} size="md" />
          </div>
        </div>
      </section>

      {/* Price summary + market table */}
      <section className="space-y-8 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("দামের সারসংক্ষেপ", "Price summary")}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-base-300 bg-base-100 p-4">
                <p className="text-xs opacity-70">{s.label}</p>
                <p className={`text-2xl font-bold leading-8 ${s.color}`}>{priceText(s.value, lang)}</p>
                <p className="text-xs opacity-70">{s.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("বাজারভিত্তিক আজকের দাম", "Today's price by market")}</h2>
          {product.markets.length ? (
            <div className="overflow-x-auto rounded-2xl border border-base-300">
              <table className="table min-w-[560px]">
                <thead>
                  <tr className="text-sm text-base-content">
                    <th>{t("বাজার", "Market")}</th>
                    <th>{t("বিভাগ", "Division")}</th>
                    <th className="text-right">{t("সর্বনিম্ন", "Min")}</th>
                    <th className="text-right">{t("সর্বাধিক", "Max")}</th>
                    <th className="text-right">{t("গড়", "Avg")}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.markets.map((m, i) => (
                    <tr key={`${m.market}-${i}`} className={i % 2 === 1 ? "bg-base-200" : ""}>
                      <td className="font-medium">{placeLabel(m.market, lang)}</td>
                      <td>{placeLabel(m.region, lang)}</td>
                      <td className="text-right">{priceText(m.min, lang)}</td>
                      <td className="text-right">{priceText(m.max, lang)}</td>
                      <td className="text-right font-semibold">{priceText(m.avg, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-2xl border border-base-300 p-6 text-center text-sm opacity-70">
              {t("এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।", "Market-wise data for this product is not available yet.")}
            </p>
          )}
        </div>
      </section>

      <Link href={product.categorySlug ? `/category/${product.categorySlug}` : "/"} className="btn btn-outline btn-sm sm:btn-md border-base-300">
        ← {t("ফিরে যান", "Go back")}
      </Link>
    </div>
  );
}
