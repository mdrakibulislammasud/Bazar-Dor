import { headers } from "next/headers";
import { auth } from "./auth";

export async function getServerSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

/** Only allow same-site relative redirects (prevents open-redirect). */
export function safeRedirect(path: string | null | undefined, fallback = "/") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
