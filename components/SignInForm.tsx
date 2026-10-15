"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { Divider, Field } from "./AuthShell";
import SocialButtons from "./SocialButtons";
import { useT } from "./LangProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = t("সঠিক ইমেইল ঠিকানা লিখুন", "Enter a valid email address");
    if (password.length < 8) next.password = t("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে", "Password must be at least 8 characters");
    setErrors(next);
    if (next.email || next.password) {
      toast.error(next.email || next.password!);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn.email({ email: email.trim(), password });
      if (error) {
        const msg =
          error.status === 401 || /invalid/i.test(error.message ?? "")
            ? t("ইমেইল বা পাসওয়ার্ড সঠিক নয়", "Incorrect email or password")
            : error.message || t("সাইন ইন করা যায়নি, আবার চেষ্টা করুন", "Could not sign in, please try again");
        setErrors({ form: msg });
        toast.error(msg);
        return;
      }
      toast.success(t("সফলভাবে সাইন ইন হয়েছে", "Signed in successfully"));
      router.push(redirectTo);
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
      <Field id="email" label={t("ইমেইল", "Email")} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <Field id="password" label={t("পাসওয়ার্ড", "Password")} type="password" autoComplete="current-password" placeholder={t("কমপক্ষে ৮ অক্ষর", "At least 8 characters")} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading && <span className="loading loading-spinner loading-sm" />}
        {t("সাইন ইন", "Sign In")}
      </button>
      <Divider />
      <SocialButtons />
      <p className="text-center text-sm">
        {t("অ্যাকাউন্ট নেই?", "Don't have an account?")}{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          {t("সাইন আপ করুন", "Sign Up")}
        </Link>
      </p>
    </form>
  );
}
