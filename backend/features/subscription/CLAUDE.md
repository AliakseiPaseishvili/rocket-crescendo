# Subscription Feature

Manages newsletter subscriptions with a double opt-in flow keyed on whether the email already belongs to a registered app user.

## Structure

```
backend/features/subscription/
  Subscription.repository.ts  # DB access via Prisma against the NewsletterSubscription table
  Subscription.service.ts     # Business logic: email validation, user lookup, opt-in branching, email sending
  types.ts                    # Types: NewsletterSubscriptionModel, SubscribeInput, SubscribeResult
  index.ts                    # Barrel export: SubscriptionService + types
```

## Key concepts

- **Two opt-in paths** (`SubscriptionService.subscribe`):
  - **Registered email** — if a `User` row exists for the email (`prisma.user.findUnique`), the address is trusted: the subscription is upserted straight to `CONFIRMED` and a "You are subscribed to the news" email is sent. No confirmation step.
  - **Unknown email** — double opt-in: a `PENDING` subscription is upserted with a random `token` (`crypto.randomUUID`) and a 24 h `tokenExpiresAt`, and a confirmation email is sent containing `${BETTER_AUTH_URL}/subscribe/confirm?token=<token>`.
- **Confirmation** (`SubscriptionService.confirm`) — looks the subscription up by token, rejects a missing/expired token with `Error('Invalid or expired token')`, flips it to `CONFIRMED` (clearing `token`/`tokenExpiresAt`), then sends the welcome email. Idempotent: an already-`CONFIRMED` record is returned without resending.
- **Idempotent subscribe** — an already-`CONFIRMED` email short-circuits and returns `{ status: 'confirmed' }` without re-sending anything.
- **Email normalization** — addresses are trimmed and lower-cased before lookup/storage so they match Better Auth's stored (lower-cased) `User.email`.
- **Upsert on unique `email`** — `upsertPending` / `upsertConfirmed` use `prisma.newsletterSubscription.upsert` so re-subscribing refreshes the same row instead of failing the unique constraint.
- **Emails are sent from the service** via `sendSubscriptionConfirmEmail` / `sendSubscriptionWelcomeEmail` from `@/backend/features/emails` (see that feature's CLAUDE.md).
- **Validation** (in service, not repository):
  - `email` is required and must match a basic `local@domain.tld` regex.
  - `token` is required (non-empty) on confirm; must exist and not be past `tokenExpiresAt`.

## Data model

`NewsletterSubscription` (Prisma, mapped to `newsletter_subscription`): `id`, unique `email`, `status` (`SubscriptionStatus` enum: `PENDING | CONFIRMED`), nullable unique `token`, nullable `tokenExpiresAt`, `createdAt`, `updatedAt`.

## Types

| Type | Purpose |
|---|---|
| `NewsletterSubscriptionModel` | Prisma row shape (re-exported from the generated client) — return type of `confirm` |
| `SubscribeInput` | `{ email: string }` — input to `subscribe` |
| `SubscribeResult` | `{ status: 'pending' \| 'confirmed' }` — result of `subscribe` |

## Usage

```ts
import { SubscriptionService } from '@/backend/features/subscription';

const service = new SubscriptionService();

// Subscribe (POST /api/subscription)
const result = await service.subscribe({ email: 'reader@example.com' });
// result.status === 'pending'  -> confirmation email sent (unknown email)
// result.status === 'confirmed' -> welcome email sent (registered email or already subscribed)

// Confirm the double opt-in link (POST /api/subscription/confirm)
await service.confirm(token); // throws 'Invalid or expired token' if bad; sends welcome email on success
```

## How to extend

### Adding unsubscribe

1. Add `findByEmail` is already present; add a `setStatus`/`delete` method to `Subscription.repository.ts`.
2. Add `unsubscribe(email | token)` to `SubscriptionService` (decide token-based vs. authenticated).
3. Add a `DELETE`/`POST /api/subscription/unsubscribe` route mirroring the existing route error handling.
4. Optionally add an `unsubscribe` template + send wrapper in `backend/features/emails`.
