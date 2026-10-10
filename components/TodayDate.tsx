"use client";

import { useEffect, useState } from "react";
import { banglaDate } from "@/lib/bn";
import { useLang } from "./LangProvider";

/** Today's date (Asia/Dhaka), computed on the client so static pages never show a stale date. */
export default function TodayDate() {
  const lang = useLang();
  const [date, setDate] = useState(() => banglaDate(new Date(), lang));
  useEffect(() => setDate(banglaDate(new Date(), lang)), [lang]);
  return <span suppressHydrationWarning>{date}</span>;
}
