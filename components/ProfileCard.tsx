"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth-client";
import { useT } from "./LangProvider";

export default function ProfileCard({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const t = useT();

  async function handleSignOut() {
    try {
      const { error } = await signOut();
      if (error) return toast.error(error.message || t("সাইন আউট করা যায়নি", "Could not sign out"));
      toast.success(t("সফলভাবে সাইন আউট হয়েছে", "Signed out successfully"));
      router.push("/");
      router.refresh();
    } catch {
      toast.error(t("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।", "Network error. Please try again."));
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold">{t("আমার প্রোফাইল", "My Profile")}</h1>
        <p className="text-sm opacity-80">{t("আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।", "View your account information here.")}</p>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center">
        <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary text-3xl font-bold text-primary-content">
          {(name || email).trim().charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl">{name}</p>
          <p className="truncate opacity-80">{email}</p>
        </div>
        <button type="button" onClick={handleSignOut} className="btn btn-outline btn-error btn-sm sm:btn-md">
          ↩ {t("সাইন আউট", "Sign Out")}
        </button>
      </section>

      <section className="space-y-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        <h2 className="text-lg font-semibold">{t("তথ্য", "Information")}</h2>
        <div className="space-y-1">
          <label htmlFor="profile-name" className="block text-sm font-medium">
            {t("নাম", "Name")}
          </label>
          <input id="profile-name" readOnly value={name} className="input input-bordered h-10 w-full bg-base-100" />
        </div>
        <div className="space-y-1">
          <label htmlFor="profile-email" className="block text-sm font-medium">
            {t("ইমেইল", "Email")}
          </label>
          <input id="profile-email" readOnly value={email} className="input input-bordered h-10 w-full bg-base-100" />
        </div>
        <Link href="/profile/update" className="btn btn-primary w-full">
          {t("আপডেট", "Update")}
        </Link>
      </section>
    </div>
  );
}
