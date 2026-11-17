
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

// Production: MongoDB Atlas
const mongoUri = process.env.MONGODB_URI;

const mongoClient = mongoUri
  ? new MongoClient(mongoUri)
  : null;

// Local development: SQLite
function createSqliteDatabase(): BetterAuthOptions["database"] {
  const sqlite = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");

  return new sqlite.DatabaseSync(
    process.env.SQLITE_PATH || "local.db"
  ) as unknown as BetterAuthOptions["database"];
}

const database = mongoClient
  ? mongodbAdapter(mongoClient.db(), { client: mongoClient })
  : createSqliteDatabase();

// Social providers
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

// Base URL
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const authOptions = {
  baseURL,

  secret:
    process.env.BETTER_AUTH_SECRET ||
    "dev-only-secret-change-me-in-production-0123456789",

  database,

  trustedOrigins: [
    baseURL,
    ...(process.env.VERCEL_URL
      ? [`https://${process.env.VERCEL_URL}`]
      : []),
    ...(process.env.VERCEL_BRANCH_URL
      ? [`https://${process.env.VERCEL_BRANCH_URL}`]
      : []),
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },

  // Account linking
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  socialProviders,

  plugins: [nextCookies()],
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);
