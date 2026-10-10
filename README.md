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

3. Open `.env.local` and set a strong `BETTER_AUTH_SECRET`. For production, configure a PostgreSQL `DATABASE_URL` and the correct application URL. Google/GitHub OAuth credentials are optional and only needed if you enable those sign-in providers.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run dev    # Start the development server
npm run lint   # Type-check the project
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

## Design files

Design references and the assignment brief are stored in the `design/` directory.
