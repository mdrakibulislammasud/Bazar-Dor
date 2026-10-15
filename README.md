# বাজার দর (BazarDor)

A responsive Bangla/English market-price tracker built with Next.js. BazarDor displays product prices, daily price movements, category-wise listings, and market-by-market price details.

## Features

- Responsive home page with a price ticker and hero section
- Top price risers and fallers
- Product cards and category pages with price sorting
- Protected product detail pages with minimum, maximum, and average prices
- Email/password authentication with optional Google and GitHub sign-in
- Profile page and profile-name update
- Bangla and English interface
- Loading states, empty states, and a friendly not-found page

## Tech stack

- Next.js App Router
- TypeScript and React
- Tailwind CSS and DaisyUI
- Better Auth
- PostgreSQL for production; local SQLite support where configured
- `react-hot-toast` for notifications
- Node built-in test runner for API and number-format regression tests

## Run locally

**Requirements:** Node.js 22.5+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file (Windows PowerShell):

   ```powershell
   Copy-Item .env.example .env.local
   ```

   On macOS/Linux, use `cp .env.example .env.local`.

3. Open `.env.local` and set a strong `BETTER_AUTH_SECRET` (at least 32 random characters). For production, configure a PostgreSQL `DATABASE_URL` and the correct application URL. For hosted databases, use the provider's TLS-enabled connection string (normally `?sslmode=require`) and keep certificate validation enabled. Google/GitHub OAuth credentials are optional and only needed if you enable those sign-in providers. Production intentionally refuses to start without a persistent database and secure secret.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run dev    # Start the development server
npm run lint   # Type-check the project
npm test       # Run API/normalization regression tests
npm run build  # Create a production build
npm run start  # Run the production build
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth; replace the example value |
| `BETTER_AUTH_URL` | Base URL of the application |
| `NEXT_PUBLIC_APP_URL` | Public application URL |
| `DATABASE_URL` | PostgreSQL connection string for production; local setup depends on the configured SQLite fallback |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional GitHub OAuth credentials |
| `NEXT_PUBLIC_MAIN_API_URL` | Main market-price API endpoint |
| `NEXT_PUBLIC_API_BASE_1` / `NEXT_PUBLIC_API_BASE_2` | Alternate market-price API endpoints |

For OAuth, configure the callback URLs shown by the authentication provider and match them to your application URL.

## Deployment

Deploy to a platform that supports Next.js. Set the required environment variables in the deployment settings before publishing. Use PostgreSQL for a persistent production database and verify that dynamic routes work after a page refresh.

### Vercel submission checklist

1. Push the **whole repository including its Git history** to GitHub. This ZIP contains more than 8 meaningful commits. Verify with `git log --oneline` after extracting it.
2. Import the repository into Vercel and use the **Next.js** framework preset. Do **not** enable static-only export.
3. Provision a persistent PostgreSQL database (e.g. Neon or Supabase) and set `DATABASE_URL` in the Vercel environment.
4. Set `BETTER_AUTH_SECRET` to a securely generated 32+ character value. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the exact live `https://` domain. Rebuild when these values change.
5. Create Better Auth tables before testing sign-up. The included `instrumentation.ts` attempts migrations when a Node.js server starts. For reliable production rollouts, also run `npx auth@latest migrate` against the configured database before deployment. Ensure the database user has permissions to create tables.
6. To enable social sign-in, set provider credentials in Vercel and register the callback URLs below. Without credentials the buttons cannot complete OAuth authentication.

   ```text
   https://YOUR-DOMAIN/api/auth/callback/google
   https://YOUR-DOMAIN/api/auth/callback/github
   ```

7. Check these paths on mobile and desktop, including a **hard refresh** on dynamic routes: `/`, `/category/chal`, `/product/1` (should require sign-in), `/signin`, `/signup`, `/profile` (protected), `/profile/update` (protected), and `/category/invalid` / `/product/unknown` after signing in.
8. Check email registration, login, logout, Google/GitHub OAuth, sorting, profile name updates, empty states, toast messages, and return navigation before submission.
9. Submit the **GitHub repository URL** and the **live deployment URL**. They are not included in the source archive.

### API availability and offline fallback

The app rejects malformed HTTP 200 API replies, retries the other configured endpoints, and distinguishes a legitimately empty response from an unreachable provider. If the live sources are unavailable, a prominent warning below the price ticker identifies the illustrative data on every page, including sign-in and protected pages.

The app tries the Programming Hero API and two mirror APIs in sequence and caches valid server responses for five minutes. If **all** endpoints are inaccessible, the site displays a sample dataset from the supplied design (`lib/seed.ts`) so the UI remains inspectable. **Sample prices and market rows are illustrative and must not be presented as verified live prices.** Check the real API data and market table in the deployed application before submitting.

### Verification limits

`npm test` checks Bengali-number conversion, numeric sorting, category normalization, market rows, unavailable/malformed upstream data, sample-price labelling and mirror failover. These tests are not a substitute for a production `npm run build`, real Google/GitHub callbacks, database setup, or manual responsive/Figma comparison.

## Design files

Design references and the assignment brief are stored in the `design/` directory.
