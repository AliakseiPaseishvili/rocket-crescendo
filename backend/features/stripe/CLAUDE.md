# stripe feature

Thin wrapper exposing a single shared Stripe SDK client. All Stripe usage (Checkout Sessions, webhook verification) goes through this client; business logic lives in the `order` feature.

## Structure

```
backend/features/stripe/
  stripeClient.ts   # Singleton `new Stripe(STRIPE_SECRET_KEY)` (globalForStripe pattern, mirrors prisma.ts) + isStripeConfigured()
  index.ts          # Barrel: export { stripe, isStripeConfigured }
```

## Key concepts

- **Singleton** — cached on `globalForStripe` in non-production to survive HMR, exactly like `backend/prisma/prisma.ts`.
- **No subscriptions plugin** — this project sells one-time products, so we use the raw `stripe` SDK rather than `@better-auth/stripe` (which is subscription-oriented). Revisit if recurring plans are added.
- **Import** — always `import { stripe } from "@/backend/features/stripe"`; never construct `new Stripe(...)` elsewhere.
- **`isStripeConfigured()`** — returns `Boolean(process.env.STRIPE_SECRET_KEY)` without touching the lazy `stripe` proxy (which throws when the key is absent). The `order` feature uses it to gate a mock-payment fallback: when Stripe is not configured, checkout fulfils the order inline and redirects straight to the success page instead of calling Stripe.

## Environment variables

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Server-side Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification (consumed in the webhook route) |
