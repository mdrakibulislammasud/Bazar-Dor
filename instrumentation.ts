/**
 * Runs once when the Next.js server boots. Creates BetterAuth's tables
 * (user, session, account, verification) automatically, so the examiner
 * never has to run a manual migration command.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { getMigrations } = await import("better-auth/db/migration");
    const { authOptions } = await import("./lib/auth");
    const { runMigrations } = await getMigrations(authOptions);
    await runMigrations();
  } catch (err) {
    console.error("[bazar-dor] auth migration failed:", err);
  }
}
