import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import SignUpForm from "@/components/SignUpForm";
import { getServerSession } from "@/lib/session";
import { getT } from "@/lib/lang";

export const metadata: Metadata = { title: "সাইন আপ" };

export default async function SignUpPage() {
  if (await getServerSession()) redirect("/");
  const { t } = await getT();
  return (
    <AuthShell title={t("অ্যাকাউন্ট তৈরি করুন", "Create an account")} subtitle={t("বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।", "Sign up for free to see all detailed prices.")}>
      <SignUpForm />
    </AuthShell>
  );
}
