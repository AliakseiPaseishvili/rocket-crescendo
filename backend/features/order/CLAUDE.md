# order feature

Handles Stripe Checkout for one-time product purchases: server-side re-pricing, Checkout Session creation, order + address persistence, webhook fulfilment, and digital-product access grants. Supports **guest checkout** (no auth required).

## Structure

```
backend/features/order/
  Order.repository.ts   # Prisma access: createPending, findByStripeSessionId, markPaid, createAccessGrants (idempotent upsert), findAccessByEmail, linkEmailToUser + admin reads: findAllForAdmin (paginated), findByIdForAdmin, updateStatus
  Order.service.ts      # Business logic: validate email/address, re-price cart, create Stripe session, fulfilCheckout (idempotent), access lookup, email→user linking + admin: getOrdersForAdmin, updateOrderStatus
  types.ts              # OrderWithItems, OrderWithItemsAndAddress, OrderFilter, AdminOrder, AdminOrderItem, PaginatedAdminOrders, CheckoutItemInput, CheckoutAddressInput, CreateCheckoutParams, CheckoutResult, PricedItem, OrderAddressModel
  constants.ts          # DEFAULT_PAGINATION_OFFSET/LIMIT, MAX_PAGINATION_LIMIT, ADMIN_ORDER_STATUSES
  index.ts              # Barrel: OrderService (value), OrderStatus enum, pagination constants + types
```

## Order status & number

- `OrderStatus` enum: `PENDING`, `PAID`, `FAILED`, **`PREPARED`**, **`SENT`**. Checkout only ever produces `PENDING` → `PAID`; `PREPARED` and `SENT` are set exclusively by the admin dashboard via `updateOrderStatus`.
- `Order.orderNumber` — sequential `Int @unique @default(autoincrement())`, the human-friendly identifier shown in the dashboard and shipping email (the UUID `id` is still the primary key used in API routes).

## Key concepts

- **Server-side re-pricing** — `createCheckoutSession` never trusts client prices. It fetches products via `ProductRepository.findByIds`, computes `unitAmount = Math.round(price * 100)` (cents), and builds Stripe `line_items` with `price_data`. The client only sends `{ productId, quantity }`.
- **Address collected up front** — the checkout page (`frontend/features/checkout`) collects an address before payment. `createCheckoutSession` now requires `email` + `address` (`CheckoutAddressInput`) and validates the required fields (`country`, `addressLine1`, `city`, `postcode`) are non-empty. `createPending` writes a nested `OrderAddress` (1-1 with `Order`, `onDelete: Cascade`) alongside the order + items. Optional address fields (`region`, `addressLine2`, `flatNumber`, `additionalInfo`) are stored as `null` when omitted.
- **Guest vs registered email** — the checkout route (`app/api/checkout/route.ts`) trusts the Better Auth session email when a session exists (ignoring any client-sent email) and otherwise requires `body.email` (400 if missing). `userId` is attached from the session when present. Orders always store `email`; `userId` when known.
- **Order lifecycle** — `createPending` writes a `PENDING` `Order` + `OrderItem`s keyed by `stripeSessionId` (unique). The webhook flips it to `PAID` via `markPaid`.
- **Mock payment fallback** — when Stripe is not configured (`isStripeConfigured()` is `false`, i.e. `STRIPE_SECRET_KEY` is absent), `createCheckoutSession` skips Stripe entirely: it creates the `PENDING` order with a synthetic `stripeSessionId` (`mock_${crypto.randomUUID()}`), fulfils it **inline** via the shared `completeOrder` helper (no webhook will ever fire), and returns the success URL directly (`${appUrl}/${lng}/checkout/success?session_id=${mockSessionId}`). All DB writes (PAID status, access grants, confirmation email) happen exactly as in the real flow. This keeps local dev/demos working without Stripe credentials.
- **Shared fulfilment** — the private `completeOrder(order, email, paymentId)` helper (mark PAID → `createAccessGrants` → send confirmation email, email wrapped in a swallowed `try/catch`) is reused by both `fulfillCheckout` (webhook path) and the mock-payment path.
- **Idempotent fulfilment** — `fulfillCheckout` is a no-op when the order is already `PAID`, so duplicate webhook deliveries are safe (the confirmation email is therefore sent exactly once). Access grants use `productAccess.upsert` on the `(email, productId)` unique constraint.
- **Order confirmation email** — after `createAccessGrants`, `fulfillCheckout` re-fetches products via `ProductRepository.findByIds`, resolves localized names with the private `pickName(product, order.language)` helper, and calls `sendOrderConfirmationEmail` (`backend/features/emails`). The send is wrapped in `try/catch` and the error is **swallowed** — the order is already `PAID`, so an email failure must not throw a 500 and trigger a Stripe retry.
- **Order language** — the checkout `lng` is persisted on `Order.language` (`String @default("en")`) at `createPending` time because the Stripe webhook has no request-language context. `fulfillCheckout` reads it back to localize the confirmation email (`en` | `fr` | `ru`).
- **Access grants** — `ProductAccess` rows are keyed by `email` (guest-friendly) with an optional `userId`. `linkEmailToUser` backfills `userId` on both access grants and orders and is called from the Better Auth `user.create.after` hook so guests who register later inherit their purchases.
- **Currency** — fixed to `usd` (`DEFAULT_CURRENCY`); the `Order.currency` column allows future flexibility.
- **Admin dashboard reads** — `getOrdersForAdmin(filter?)` returns `PaginatedAdminOrders` (`PaginatedItems<AdminOrder>`), mirroring the `file` feature's offset pagination (`findAllForAdmin` runs `findMany` + `count` in one `$transaction`, `orderBy orderNumber desc`, `skip/take`). Results are filtered to `ADMIN_ORDER_STATUSES` (`PAID`/`PREPARED`/`SENT`) or a single `status` when the filter provides one. The admin include (`{ items: true, address: true }`) is richer than the checkout `ORDER_INCLUDE` (`{ items: true }`). `withResolvedNames` batch-fetches products once and attaches localized item names via the same `pickName(product, order.language)` helper used by the confirmation email — so `AdminOrder.items` carry display names, not just `productId`.
- **Admin status updates** — `updateOrderStatus(id, target)` enforces a strict forward-only transition: `PAID → PREPARED` and `PREPARED → SENT` only; anything else throws `"Invalid status transition"` (surfaced as HTTP 400). A missing order throws `"Order not found"` (404).
- **Shipping notification** — when an order is marked `SENT`, `updateOrderStatus` sends `sendOrderShippedEmail` (`backend/features/emails`) with the resolved items **and the delivery address** (duplicated in the email body). The send is wrapped in a swallowed `try/catch` — the status change is already committed, so email failure must not fail the admin action (same convention as `completeOrder`).
- **Customer-facing reads** — `getOrdersForUser({ userId, email, offset, limit })` returns
  `PaginatedUserOrders` (`PaginatedItems<UserOrder>`) for the signed-in user's own **paid** orders.
  `findAllForUser` matches `OR: [{ userId }, { email }]` (so guest orders placed before the customer
  registered are included) filtered to `ADMIN_ORDER_STATUSES` (`PAID`/`PREPARED`/`SENT`), newest
  first, paginated via the same items+count `$transaction` as `findAllForAdmin` (include
  `{ items: true }`). The service resolves each item's localized `name` (same `pickName` helper) and
  a thumbnail `imageUrl` via `pickImageUrl` (main image, else additional image, else `null`). The
  returned `UserOrder` **omits status/email/address/Stripe ids** — it is safe to send to the customer.
- **Admin API routes** — `app/api/orders/route.ts` (`GET`, admin-gated via `withAdminAuth`) parses `status`/`offset`/`limit` query params (offset/limit clamped exactly like `app/api/file/route.ts`, `status` validated against `ADMIN_ORDER_STATUSES`). `app/api/orders/[id]/status/route.ts` (`PATCH`, admin-gated) validates the body `status` against the `OrderStatus` enum and calls `updateOrderStatus`. The admin dashboard UI lives in `frontend/features/orders`.

## Environment variables

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe API key (used by the shared `stripe` client). **Absent → mock payment mode** (fulfilment happens inline, no Stripe/webhook). |
| `STRIPE_WEBHOOK_SECRET` | Verifies webhook signatures (used in the webhook route) |
| `NEXT_PUBLIC_APP_URL` | Base URL for building Checkout `success_url` / `cancel_url` (defaults to `http://localhost:3000`) |

## Consumers

- `app/api/checkout/route.ts` — public POST; reads `{ items, lng, email, address }`, enforces the session-email rule, attaches session user if any, returns `{ url }`.
- `frontend/features/checkout` — the address form + cart summary page that posts the checkout payload.
- `app/api/webhooks/stripe/route.ts` — verifies signature, calls `fulfillCheckout` on `checkout.session.completed`.
- `backend/features/auth/auth.ts` — `databaseHooks.user.create.after` → `linkEmailToUser`.
- `app/api/orders/mine/route.ts` — customer GET (plain session, **not** `withAdminAuth`); 401 when
  signed out, otherwise the current user's paid orders (`getOrdersForUser`). Consumed by
  `frontend/features/my-orders`.
- `app/api/orders/route.ts` — admin GET; paginated, status-filtered order list.
- `app/api/orders/[id]/status/route.ts` — admin PATCH; advances order status (and emails the customer on `SENT`).
- `frontend/features/orders` — the admin dashboard table that consumes both admin routes.
