# Emails Feature

Sends transactional emails via SendGrid — currently covers email verification on sign-up and password reset.

## Structure

```
backend/features/emails/
  sendgrid.ts              # SendGrid client setup + exported send functions
  templates/
    verify-email.ts        # HTML + text template for email verification link (expires 24 h)
    password-reset.ts      # HTML + text template for password reset link (expires 1 h)
  index.ts                 # Barrel export: sendVerificationEmail, sendPasswordResetEmail
```

## Key concepts

- **SendGrid client** — `sgMail` is initialised once at module load using `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` env vars. Both default to `""` if missing, so missing env vars will cause a SendGrid API error at send time, not at startup.
- **Templates return plain objects** — `verifyEmailTemplate(url)` and `passwordResetTemplate(url)` return `{ subject, text, html }`. They are spread directly into the `sgMail.send()` call alongside `to` and `from`, so they are kept stateless and easy to test without mocking the mailer.
- **One function per email type** — `sendVerificationEmail(to, url)` and `sendPasswordResetEmail(to, url)` are thin wrappers; the `url` is constructed outside this feature (by Better Auth) and passed in.

## Usage

```ts
import { sendVerificationEmail, sendPasswordResetEmail } from '@/backend/features/emails';

// Triggered by Better Auth's sendVerificationEmail hook
await sendVerificationEmail('user@example.com', 'https://…/verify?token=…');

// Triggered by Better Auth's sendResetPassword hook
await sendPasswordResetEmail('user@example.com', 'https://…/reset-password?token=…');
```

## How to add a new transactional email

1. Add a new template file under `templates/<name>.ts` exporting a function `<name>Template(…args): { subject: string; text: string; html: string }`.
2. Add a `send<Name>Email(to: string, …args)` function in `sendgrid.ts` that spreads the template into `sgMail.send()`.
3. Export the new function from `index.ts`.
