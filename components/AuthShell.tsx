"use client";

import { useT } from "./LangProvider";
import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="mx-auto w-full max-w-md space-y-5 py-4 sm:py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm opacity-80">{subtitle}</p>
      </header>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">{children}</div>
      <Link href="/" className="inline-block text-sm hover:text-primary">
        ← {t("হোম পেজে ফিরে যান", "Back to Home")}
      </Link>
    </div>
  );
}

export function Divider() {
  const t = useT();
  return (
    <div className="my-1 flex items-center gap-3 text-xs opacity-70" role="separator">
      <span className="h-px flex-1 bg-base-300" />
      {t("অথবা", "or")}
      <span className="h-px flex-1 bg-base-300" />
    </div>
  );
}

export function Field({
  id,
  label,
  error,
  ...input
}: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`input input-bordered h-10 w-full bg-base-100 ${error ? "input-error" : ""}`}
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}
