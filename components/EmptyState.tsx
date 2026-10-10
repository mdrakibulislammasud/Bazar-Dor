"use client";

import Link from "next/link";
import { useT } from "./LangProvider";

export default function EmptyState({ title, message }: { title?: string; message?: string }) {
  const t = useT();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-base-300 bg-base-100 px-6 py-14 text-center">
      <div className="text-6xl" aria-hidden>🛒</div>
      <h1 className="text-2xl font-bold">{title ?? t("৪০৪ — পাতাটি পাওয়া যায়নি", "404 — Page not found")}</h1>
      <p className="opacity-70">
        {message ?? t("আপনি যে পাতাটি খুঁজছেন তা নেই বা সরিয়ে নেওয়া হয়েছে।", "The page you are looking for does not exist or has been moved.")}
      </p>
      <Link href="/" className="btn btn-primary btn-sm sm:btn-md">
        {t("হোম পেজে ফিরে যান", "Back to Home")}
      </Link>
    </div>
  );
}
