"use client";

import { createContext, useContext } from "react";
import type { Lang } from "@/lib/i18n";

const Ctx = createContext<Lang>("bn");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
/** const t = useT(); t("বাংলা", "English") */
export function useT() {
  const lang = useLang();
  return (bn: string, en: string) => (lang === "en" ? en : bn);
}
