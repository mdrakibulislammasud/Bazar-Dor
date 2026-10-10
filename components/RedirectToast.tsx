"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useT } from "./LangProvider";

/**
 * Shows a toast when a protected route redirected here (?reason=login-required)
 * and then cleans the query string.
 */
export default function RedirectToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const shown = useRef(false);
  const t = useT();

  useEffect(() => {
    const reason = params.get("reason");
    if (reason === "login-required" && !shown.current) {
      shown.current = true;
      toast.error(t("এই পাতাটি দেখতে আগে সাইন ইন করুন", "Please sign in to view this page"));
      const next = new URLSearchParams(params.toString());
      next.delete("reason");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, router, pathname]);

  return null;
}
