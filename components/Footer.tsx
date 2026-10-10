"use client";

import { useT } from "./LangProvider";

export default function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>{t("বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।", "BazarDor — essential product prices at a glance.")}</p>
        <p className="sm:text-right">
          {t("সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।", "All prices are approximate and may change with market conditions.")}
        </p>
      </div>
    </footer>
  );
}
