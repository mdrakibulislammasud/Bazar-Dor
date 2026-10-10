import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import { getServerSession } from "@/lib/session";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/signin?reason=login-required&from=%2Fprofile");
  return <ProfileCard name={session.user.name} email={session.user.email} />;
}
