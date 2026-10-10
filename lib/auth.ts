import { betterAuth, type BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

/**
 * Database
 *  - Production / Vercel: set DATABASE_URL to a Postgres connection string (Neon, Supabase, …)
 *  - Local development:   leave it empty and a SQLite file (local.db) is used.
 */
function createDatabase(): BetterAuthOptions["database"] {
  const url = process.env.DATABASE_URL;
  if (url) {
    return new Pool({
      connectionString: url,
      ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
    });
  }
  // Node's built-in SQLite (Node 22.5+) — no native module to compile.
  const sqlite = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");
  return new sqlite.DatabaseSync(process.env.SQLITE_PATH || "local.db") as unknown as BetterAuthOptions["database"];
}

const socialProviders: BetterAuthOptions["socialProviders"] = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const authOptions = {
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || "dev-only-secret-change-me-in-production-0123456789",
  database: createDatabase(),
  trustedOrigins: [
    baseURL,
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // no email verification / forgot-password (per the brief)
  },
  socialProviders,
  plugins: [nextCookies()],
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);
