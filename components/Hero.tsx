"use client";

import Image from "next/image";
import TodayDate from "./TodayDate";
import { useT } from "./LangProvider";

export default function Hero() {
  const t = useT();
  return (
    <section className="grid items-center gap-6 rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <TodayDate />
        </span>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{t("আজকের বাজারের দাম এক নজরে", "Today's market prices at a glance")}</h1>
        <p className="max-w-xl text-base leading-relaxed opacity-80">
          {t(
            "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।",
            "Prices of rice, pulses, oil, vegetables, fish, meat, eggs and spices — market-wise details, averages, minimum/maximum and price changes in one place.",
          )}
        </p>
        <div className="pt-2">
          {/* Anchor link (same page, no route change) */}
          <a href="#সব-পণ্য" className="btn btn-primary btn-sm sm:btn-md">
            {t("সব পণ্য দেখুন", "View all products")} <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
      <div className="mx-auto w-full max-w-xs md:max-w-none">
        <Image src="/bazar-hero.png" alt={t("ফলের ঝুড়ি", "Basket of fruits")} width={315} height={263} priority className="h-auto w-full rounded-2xl bg-white object-contain" />
      </div>
    </section>
  );
}
