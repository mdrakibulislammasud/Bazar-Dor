"use client";

import { useT } from "@/components/LangProvider";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();
  return (
    <div role="alert" className="mx-auto max-w-lg space-y-4 rounded-3xl border border-base-300 bg-base-100 p-8 text-center">
      <div aria-hidden className="text-5xl">⚠️</div>
      <h1 className="text-2xl font-bold">{t("কিছু একটা সমস্যা হয়েছে", "Something went wrong")}</h1>
      <p className="text-sm opacity-75">
        {t("বাজারের তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।", "We couldn't load market information. Check your connection and try again.")}
      </p>
      <button type="button" onClick={reset} className="btn btn-primary btn-sm sm:btn-md">
        ↻ {t("আবার চেষ্টা করুন", "Try again")}
      </button>
    </div>
  );
}
