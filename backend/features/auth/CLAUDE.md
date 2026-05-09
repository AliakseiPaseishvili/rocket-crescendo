# Auth Feature

Configures the Better Auth server instance used across the entire app — email/password with verification, Google OAuth, username login, and the admin plugin — and exports a `withAdminAuth` middleware wrapper for protecting API routes.

## Structure

```
backend/features/auth/
  auth.ts           # Better Auth instance, Session type, email/Google/username/admin config
  withAdminAuth.ts  # Higher-order route handler: validates session + admin role
  index.ts          # Barrel: auth, Session, withAdminAuth
```

## Key concepts

- **Single instance** — `auth` is instantiated once in `auth.ts`. Always import from `@/backend/features/auth`, never from `auth.ts` directly.
- **Prisma adapter** — `prismaAdapter(prisma, { provider: "postgresql" })` maps Better Auth's session/user/account tables to PostgreSQL. Migrations for core auth tables are managed by Better Auth itself via `npx better-auth migrate`.
- **Email/password** — enabled with `requireEmailVerification: true`. `sendVerificationEmail` fires on sign-up; users cannot sign in until verified. Password reset sends a time-limited email via `sendPasswordResetEmail`.
- **Google OAuth** — `accessType: "offline"` always issues a refresh token. `prompt: "select_account consent"` forces the account picker and consent screen on every flow. Callback URL: `<BETTER_AUTH_URL>/api/auth/callback/google`.
- **Account linking** — `google` and `email-password` are both trusted providers, so signing in with Google auto-merges with an existing email account.
- **Plugins** — `username()` allows sign-in with username in addition to email. `admin()` adds role management and user ban/unban to the API; the client-side counterpart is `adminClient()` in `auth-client.ts`.
- **Additional user fields** — `lastName`, `gender`, `birthdate` are registered as `additionalFields` so they are accepted by `signUp.email()` on the client and stored in the `User` table without a manual migration.
- **Session type** — `Session` is `typeof auth.$Infer.Session`, not a hand-written interface, so it stays in sync automatically.
- **`withAdminAuth`** — wraps a Next.js route handler; calls `auth.api.getSession` and returns `401` if there is no session or `403` if the user is not an admin. Wrap any admin-only API route handler with it.

## Types

| Type | Purpose |
|---|---|
| `Session` | `typeof auth.$Infer.Session` — full session shape (user + session metadata) |

## Environment variables

| Variable | Purpose |
|---|---|
| `BETTER_AUTH_URL` | Base URL (e.g. `http://localhost:3000`); used for OAuth callbacks and trusted origins |
| `BETTER_AUTH_SECRET` | Session signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app client secret |

## Usage

```ts
import { auth, withAdminAuth, type Session } from '@/backend/features/auth';

// Mount the API catch-all route handler (app/api/auth/[...all]/route.ts)
export const { GET, POST } = toNextJsHandler(auth);

// Validate a session in a server component or API route
const session = await auth.api.getSession({ headers: req.headers });

// Protect an admin-only API route
export const GET = withAdminAuth(async (req) => {
  return Response.json({ ok: true });
});
```

## How to extend

### Adding another social provider (e.g. GitHub)

1. Add the provider under `socialProviders` in `auth.ts` with its env vars.
2. Add the provider name to `account.accountLinking.trustedProviders`.
3. Register the callback URL `<BETTER_AUTH_URL>/api/auth/callback/github` in the GitHub OAuth app.
4. Add `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` to `.env`.
5. Create a button component on the frontend following the `GoogleSignInButton` pattern.

### Adding a new Better Auth plugin (e.g. two-factor)

1. Add the plugin to the `plugins` array in `auth.ts`.
2. Run `npx better-auth migrate` if the plugin requires new tables, then `npx prisma generate`.
3. Add the client plugin counterpart to `auth-client.ts` in `frontend/features/auth`.
4. Re-export any new types from `index.ts`.

### Adding a new admin-protected API route

Wrap the handler with `withAdminAuth`:

```ts
import { withAdminAuth } from '@/backend/features/auth';

export const GET = withAdminAuth(async (req) => {
  // only reached if session exists and role === 'admin'
  return Response.json({ data: [] });
});
```
