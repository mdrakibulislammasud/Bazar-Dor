"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signOut, signUp } from "@/lib/auth-client";
import { Divider, Field } from "./AuthShell";
import SocialButtons from "./SocialButtons";
import { useT } from "./LangProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpForm() {
  const router = useRouter();
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = t("আপনার নাম লিখুন", "Enter your name");
    if (!EMAIL_RE.test(form.email.trim())) next.email = t("সঠিক ইমেইল ঠিকানা লিখুন", "Enter a valid email address");
    if (form.password.length < 8) next.password = t("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে", "Password must be at least 8 characters");
    if (form.confirm !== form.password) next.confirm = t("পাসওয়ার্ড দুটি মিলছে না", "Passwords do not match");
    setErrors(next);
    const firstError = Object.values(next)[0];
    if (firstError) {
      toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (error) {
        const exists = /exist|already/i.test(error.message ?? "") || error.status === 422;
        const msg = exists ? t("এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে", "An account with this email already exists") : error.message || t("অ্যাকাউন্ট তৈরি করা যায়নি", "Could not create the account");
        setErrors({ form: msg });
        toast.error(msg);
        return;
      }
      // Better Auth automatically creates a session. The assignment requires
      // signup -> login, so clear that session before navigating.
      const { error: signOutError } = await signOut();
      if (signOutError) {
        toast.error(signOutError.message || t("সাইন আউট করা যায়নি", "Could not sign out"));
        router.refresh();
        return;
      }
      toast.success(t("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন", "Account created! Please sign in"));
      router.push("/signin");
      router.refresh();
    } catch {
      const msg = t("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।", "Network error. Please try again.");
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {errors.form && (
        <div role="alert" className="alert alert-error alert-soft py-2 text-sm">
          {errors.form}
        </div>
      )}
      <Field id="name" label={t("নাম", "Name")} autoComplete="name" placeholder={t("যেমন: রহিম উদ্দিন", "e.g. Rahim Uddin")} value={form.name} onChange={set("name")} error={errors.name} />
      <Field id="email" label={t("ইমেইল", "Email")} type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} />
      <Field id="password" label={t("পাসওয়ার্ড", "Password")} type="password" autoComplete="new-password" placeholder={t("কমপক্ষে ৮ অক্ষর", "At least 8 characters")} value={form.password} onChange={set("password")} error={errors.password} />
      <Field id="confirm" label={t("পাসওয়ার্ড নিশ্চিত করুন", "Confirm password")} type="password" autoComplete="new-password" placeholder={t("আবার লিখুন", "Re-enter password")} value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading && <span className="loading loading-spinner loading-sm" />}
        {t("অ্যাকাউন্ট তৈরি করুন", "Create Account")}
      </button>
      <Divider />
      <SocialButtons />
      <p className="text-center text-sm">
        {t("অ্যাকাউন্ট আছে?", "Already have an account?")}{" "}
        <Link href="/signin" className="font-semibold text-primary hover:underline">
          {t("সাইন ইন করুন", "Sign In")}
        </Link>
      </p>
    </form>
  );
}
