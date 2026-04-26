# Auth Feature

Configures the Better Auth instance used for authentication across the app, with email/password support backed by the Prisma PostgreSQL adapter.

## Structure

```
backend/features/auth/
  auth.ts     # Better Auth instance + Session type inference
  index.ts    # Barrel export: auth, Session
```

## Key concepts

- **Single instance** — `auth` is instantiated once and re-used everywhere. Import from `@/backend/features/auth`, never directly from `auth.ts`.
- **Prisma adapter** — `prismaAdapter(prisma, { provider: "postgresql" })` maps Better Auth's internal session/user tables to the PostgreSQL database.
- **Email/password** — the only auth strategy currently enabled (`emailAndPassword: { enabled: true }`). OAuth providers or other plugins would be added to the same config object.
- **Session type** — `Session` is inferred from `auth.$Infer.Session` rather than declared manually, so it stays in sync with whatever Better Auth version is installed.

## Types

| Type | Purpose |
|---|---|
| `Session` | `typeof auth.$Infer.Session` — the full session shape (user + session metadata) returned by Better Auth |

## Usage

```ts
import { auth, type Session } from '@/backend/features/auth';

// Mount the API route handler (Next.js)
export const { GET, POST } = toNextJsHandler(auth);

// Validate a session from a request
const session = await auth.api.getSession({ headers: request.headers });
```

## How to extend

**Adding a new auth provider or plugin (e.g. OAuth, two-factor):**

1. Install the relevant Better Auth plugin package.
2. Add the plugin to the `betterAuth({...})` config in `auth.ts`.
3. Run `npx prisma generate` if the plugin requires new database tables (add migrations first).
4. Re-export any new types the plugin adds from `index.ts`.
