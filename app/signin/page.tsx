import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthShell from "@/components/AuthShell";
import RedirectToast from "@/components/RedirectToast";
import SignInForm from "@/components/SignInForm";
import { getServerSession, safeRedirect } from "@/lib/session";
import { getT } from "@/lib/lang";

export const metadata: Metadata = { title: "সাইন ইন" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  const { t } = await getT();
  const redirectTo = safeRedirect(from);
  if (await getServerSession()) redirect(redirectTo);

  return (
    <AuthShell title={t("সাইন ইন", "Sign In")} subtitle={t("বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।", "Sign in to see detailed prices, market comparison and your profile.")}>
      <Suspense fallback={null}>
        <RedirectToast />
      </Suspense>
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
