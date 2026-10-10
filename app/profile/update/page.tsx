import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { getServerSession } from "@/lib/session";
import { getT } from "@/lib/lang";

export const metadata: Metadata = { title: "তথ্য আপডেট" };

export default async function UpdateProfilePage() {
  const session = await getServerSession();
  const { t } = await getT();
  if (!session) redirect("/signin?reason=login-required&from=%2Fprofile%2Fupdate");
  return (
    <AuthShell title={t("তথ্য আপডেট করুন", "Update Information")} subtitle={t("আপনার প্রোফাইলের নাম পরিবর্তন করুন।", "Change the name on your profile.")}>
      <UpdateProfileForm initialName={session.user.name} />
    </AuthShell>
  );
}
