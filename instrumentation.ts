
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // MongoDB adapter manages its own indexes.
  // SQL migrations are not required for MongoDB.
  if (process.env.MONGODB_URI) return;

  // Run migrations only for local SQLite.
  try {
    const { getMigrations } = await import("better-auth/db/migration");
    const { authOptions } = await import("./lib/auth");
    const { runMigrations } = await getMigrations(authOptions);

    await runMigrations();
  } catch (err) {
    console.error("[bazar-dor] auth migration failed:", err);
  }
}
