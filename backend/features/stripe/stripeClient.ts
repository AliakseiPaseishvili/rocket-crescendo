import Stripe from "stripe";

const globalForStripe = global as unknown as {
  stripe?: Stripe;
};

/**
 * Whether Stripe is configured. When false the checkout flow falls back to a mock
 * payment that fulfils the order server-side (see `OrderService.createCheckoutSession`).
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Lazily constructs the Stripe client on first use. Deferring construction keeps
 * `new Stripe()` (which throws when STRIPE_SECRET_KEY is absent) out of module
 * evaluation, so `next build` page-data collection does not fail without the key.
 */
function getStripe(): Stripe {
  if (globalForStripe.stripe) return globalForStripe.stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  const client = new Stripe(secretKey, { typescript: true });
  if (process.env.NODE_ENV !== "production") globalForStripe.stripe = client;
  return client;
}

// Proxy so callers can use `stripe.checkout.sessions.create(...)` while the real
// client is only instantiated on first property access (at runtime, not import).
const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripe();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export default stripe;
