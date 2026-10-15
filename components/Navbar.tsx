"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { banglaDate } from "@/lib/bn";
import { catLabel, LANG_COOKIE, type Lang } from "@/lib/i18n";
import { useLang, useT } from "./LangProvider";
import { signOut, useSession } from "@/lib/auth-client";
import type { Category } from "@/lib/types";

function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = session?.user;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  const firstName = (user.name || user.email).split(" ")[0];

  async function handleSignOut() {
    setOpen(false);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error.message || t("সাইন আউট করা যায়নি", "Could not sign out"));
        return;
      }
      toast.success(t("সফলভাবে সাইন আউট হয়েছে", "Signed out successfully"));
      router.push("/");
      router.refresh();
    } catch {
      toast.error(t("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।", "Network error. Please try again."));
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn btn-ghost btn-sm sm:btn-md gap-2 px-2"
      >
        <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-content">
          {initial}
        </span>
        <span className="hidden max-w-24 truncate text-sm font-semibold sm:inline">{firstName}</span>
        <span aria-hidden className="text-xs">▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-lg"
        >
          <div className="border-b border-base-300 px-3 pb-2 pt-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs opacity-70">{user.email}</p>
          </div>
          <Link
            role="menuitem"
            href="/profile"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
          >
            👤 {t("আমার প্রোফাইল", "My Profile")}
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-base-200"
          >
            ↩ {t("সাইন আউট", "Sign Out")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const lang = useLang();
  const t = useT();
  const router = useRouter();
  const [date, setDate] = useState(() => banglaDate(new Date(), lang));

  useEffect(() => {
    const refresh = () => setDate(banglaDate(new Date(), lang));
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [lang]);

  function switchLang(next: Lang) {
    if (next === lang) return;
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:flex-nowrap sm:gap-3 sm:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-lg text-primary-content sm:size-10" aria-hidden>
            🛒
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-lg font-bold sm:text-xl">{t("বাজার দর", "BazarDor")}</span>
            <span className="block truncate text-[11px] opacity-80 sm:text-xs" suppressHydrationWarning>
              {date}
            </span>
          </span>
        </Link>

        <div className="flex w-full shrink-0 items-center justify-between gap-1.5 border-t border-base-200 pt-2 sm:w-auto sm:justify-end sm:border-0 sm:pt-0">
          <div role="group" aria-label="Language" className="join">
            {(["bn", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchLang(l)}
                aria-pressed={lang === l}
                className={`btn join-item btn-xs sm:btn-sm ${lang === l ? "btn-primary" : "btn-ghost border-base-300"}`}
              >
                {l === "bn" ? "বাং" : "EN"}
              </button>
            ))}
          </div>
          {isPending ? (
            <div className="skeleton h-9 w-28 rounded-lg sm:h-10" aria-label="Loading" />
          ) : session?.user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost btn-xs sm:btn-md">
                {t("সাইন ইন", "Sign In")}
              </Link>
              <Link href="/signup" className="btn btn-primary btn-xs sm:btn-md">
                {t("সাইন আপ", "Sign Up")}
              </Link>
            </>
          )}
        </div>
      </div>

      <nav aria-label={t("পণ্যের বিভাগ", "Product categories")} className="border-t border-base-200 bg-base-100">
        <ul className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:gap-2 lg:justify-start">
          {categories.map((c) => {
            const href = `/category/${c.slug}`;
            const active = pathname === href;
            return (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                    active
                      ? "bg-primary text-primary-content shadow-sm"
                      : "hover:bg-base-200"
                  }`}
                >
                  <span aria-hidden>{c.icon}</span>
                  {catLabel(c.name, lang)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
