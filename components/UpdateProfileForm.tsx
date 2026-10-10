"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/auth-client";
import { Field } from "./AuthShell";
import { useT } from "./LangProvider";

export default function UpdateProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const t = useT();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      const msg = t("আপনার নাম লিখুন", "Enter your name");
      setError(msg);
      toast.error(msg);
      return;
    }
    setError("");
    setLoading(true);
    // https://better-auth.com/docs/concepts/users-accounts#update-user
    const { error: err } = await updateUser({ name: name.trim() });
    setLoading(false);
    if (err) {
      toast.error(err.message || t("তথ্য আপডেট করা যায়নি", "Could not update your information"));
      return;
    }
    toast.success(t("তথ্য সফলভাবে আপডেট হয়েছে", "Information updated successfully"));
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field id="name" label={t("নাম", "Name")} autoComplete="name" placeholder={t("আপনার নাম", "Your name")} value={name} onChange={(e) => setName(e.target.value)} error={error} />
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading && <span className="loading loading-spinner loading-sm" />}
        {t("তথ্য আপডেট করুন", "Update Information")}
      </button>
      <Link href="/profile" className="btn btn-ghost btn-sm w-full">
        {t("বাতিল", "Cancel")}
      </Link>
    </form>
  );
}
