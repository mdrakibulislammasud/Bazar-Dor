"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { useT } from "./LangProvider";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9a6.1 6.1 0 1 1 0-12.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4a9.6 9.6 0 1 0 0 19.2c5.5 0 9.2-3.9 9.2-9.3 0-.6-.1-1.1-.2-1.6z" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export default function SocialButtons() {
  const t = useT();
  const [busy, setBusy] = useState<"google" | "github" | null>(null);

  async function go(provider: "google" | "github") {
    setBusy(provider);
    const label = provider === "google" ? "Google" : "GitHub";
    try {
      const { error } = await signIn.social({ provider, callbackURL: "/" });
      if (error) {
        toast.error(
          error.status === 404
            ? t(`${label} লগইন এখনো কনফিগার করা হয়নি`, `${label} login is not configured yet`)
            : error.message || t(`${label} দিয়ে সাইন ইন করা যায়নি। পরে আবার চেষ্টা করুন।`, `Could not sign in with ${label}. Please try again.`),
        );
        setBusy(null);
      }
      // on success the browser is redirected to the provider, then back to the Home page
    } catch {
      toast.error(t(`${label} দিয়ে সাইন ইন করা যায়নি।`, `Could not sign in with ${label}.`));
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button type="button" onClick={() => go("google")} disabled={busy !== null} className="btn btn-outline btn-sm sm:btn-md border-base-300 font-semibold">
        {busy === "google" ? <span className="loading loading-spinner loading-xs" /> : <GoogleIcon />}
        {t("Google দিয়ে চালিয়ে যান", "Continue with Google")}
      </button>
      <button type="button" onClick={() => go("github")} disabled={busy !== null} className="btn btn-outline btn-sm sm:btn-md border-base-300 font-semibold">
        {busy === "github" ? <span className="loading loading-spinner loading-xs" /> : <GitHubIcon />}
        {t("GitHub দিয়ে চালিয়ে যান", "Continue with GitHub")}
      </button>
    </div>
  );
}
