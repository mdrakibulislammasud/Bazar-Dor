import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  return (await cookies()).get(LANG_COOKIE)?.value === "en" ? "en" : "bn";
}

/** Server-side translator: t("বাংলা", "English") */
export async function getT() {
  const lang = await getLang();
  return { lang, t: (bn: string, en: string) => (lang === "en" ? en : bn) };
}
