# Emails Feature

Sends transactional emails via SendGrid — covers email verification on sign-up, password reset, and newsletter subscription (confirmation + welcome).

## Structure

```
backend/features/emails/
  sendgrid.ts              # SendGrid client setup + exported send functions
  templates/
    verify-email.ts          # HTML + text template for email verification link (expires 24 h)
    password-reset.ts        # HTML + text template for password reset link (expires 1 h)
    subscription-confirm.ts  # "Do you want to subscribe?" double opt-in link (expires 24 h)
    subscription-welcome.ts  # "You are subscribed to the news" confirmation (no link)
  index.ts                 # Barrel export: sendVerificationEmail, sendPasswordResetEmail, sendSubscriptionConfirmEmail, sendSubscriptionWelcomeEmail
```

## Key concepts

- **SendGrid client** — `sgMail` is initialised once at module load using `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` env vars. Both default to `""` if missing, so missing env vars will cause a SendGrid API error at send time, not at startup.
- **Templates return plain objects** — each `*Template(…)` returns `{ subject, text, html }`, spread directly into the `sgMail.send()` call alongside `to` and `from`, so they stay stateless and easy to test without mocking the mailer.
- **One function per email type** — `sendVerificationEmail(to, url)`, `sendPasswordResetEmail(to, url)`, and `sendSubscriptionConfirmEmail(to, url)` are thin wrappers around a URL-taking template; `sendSubscriptionWelcomeEmail(to)` takes no URL (its template takes no args).
- **URL ownership** — verification/reset URLs come from Better Auth; the subscription confirm URL is built by `SubscriptionService` as `${BETTER_AUTH_URL}/subscribe/confirm?token=…` (see `backend/features/subscription`). The subscription-confirm template includes the "You can ignore this email if you haven't requested this." disclaimer.

## Usage

```ts
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendSubscriptionConfirmEmail,
  sendSubscriptionWelcomeEmail,
} from '@/backend/features/emails';

// Triggered by Better Auth's sendVerificationEmail hook
await sendVerificationEmail('user@example.com', 'https://…/verify?token=…');

// Triggered by Better Auth's sendResetPassword hook
await sendPasswordResetEmail('user@example.com', 'https://…/reset-password?token=…');

// Triggered by SubscriptionService for unknown emails (double opt-in)
await sendSubscriptionConfirmEmail('reader@example.com', 'https://…/subscribe/confirm?token=…');

// Triggered by SubscriptionService once a subscription is confirmed
await sendSubscriptionWelcomeEmail('reader@example.com');
```

## How to add a new transactional email

1. Add a new template file under `templates/<name>.ts` exporting a function `<name>Template(…args): { subject: string; text: string; html: string }`.
2. Add a `send<Name>Email(to: string, …args)` function in `sendgrid.ts` that spreads the template into `sgMail.send()`.
3. Export the new function from `index.ts`.
