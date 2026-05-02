# Auth Feature

Configures the Better Auth instance used for authentication across the app, with email/password and Google OAuth support backed by the Prisma PostgreSQL adapter.

## Structure

```
backend/features/auth/
  auth.ts     # Better Auth instance + Session type inference
  index.ts    # Barrel export: auth, Session
```

## Key concepts

- **Single instance** — `auth` is instantiated once and re-used everywhere. Import from `@/backend/features/auth`, never directly from `auth.ts`.
- **Prisma adapter** — `prismaAdapter(prisma, { provider: "postgresql" })` maps Better Auth's internal session/user/account tables to the PostgreSQL database.
- **Email/password** — enabled with `requireEmailVerification: true`. Verification emails are sent on sign-up; users cannot sign in until verified. Password reset sends a time-limited token via email.
- **Google OAuth** — configured under `socialProviders.google` with `accessType: "offline"` (always issues a refresh token) and `prompt: "select_account consent"` (forces the Google account picker and consent screen on every flow). Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars, and `<BETTER_AUTH_URL>/api/auth/callback/google` registered as an authorized redirect URI in Google Cloud Console. The `Account` Prisma model stores the OAuth tokens; no extra migrations are needed.
- **Username plugin** — `username()` plugin allows sign-in with a username in addition to email. The client-side counterpart is `usernameClient()` in `auth-client.ts`.
- **Session type** — `Session` is inferred from `auth.$Infer.Session` rather than declared manually, so it stays in sync with whatever Better Auth version is installed.
- **Trusted origins** — `trustedOrigins` is set to `[BETTER_AUTH_URL]` to restrict CSRF-protected mutations to the configured base URL.
- **Additional user fields** — `lastName`, `gender`, `birthdate` are registered as `additionalFields` so they are accepted by `signUp.email()` on the client and stored in the `User` table.

## Types

| Type | Purpose |
|---|---|
| `Session` | `typeof auth.$Infer.Session` — the full session shape (user + session metadata) returned by Better Auth |

## Environment variables

| Variable | Purpose |
|---|---|
| `BETTER_AUTH_URL` | Base URL (e.g. `http://localhost:3000`); used to construct OAuth callback URLs |
| `BETTER_AUTH_SECRET` | Session signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app client secret |

## Usage

```ts
import { auth, type Session } from '@/backend/features/auth';

// Mount the API route handler (Next.js)
export const { GET, POST } = toNextJsHandler(auth);

// Validate a session from a request
const session = await auth.api.getSession({ headers: request.headers });
```

## How to extend

### Adding another social provider (e.g. GitHub)

1. Add the provider credentials to `socialProviders` in `auth.ts`:
   ```ts
   github: {
     clientId: process.env.GITHUB_CLIENT_ID as string,
     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
   },
   ```
2. Register the callback URL `<BETTER_AUTH_URL>/api/auth/callback/github` in the GitHub OAuth app settings.
3. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env`.
4. Add the corresponding button component on the frontend following the `GoogleSignInButton` pattern.

### Adding a new plugin (e.g. two-factor)

1. Install the relevant Better Auth plugin package.
2. Add the plugin to the `plugins` array in `auth.ts`.
3. Run `npx prisma generate` (and add a migration if the plugin requires new tables).
4. Re-export any new types the plugin adds from `index.ts`.
