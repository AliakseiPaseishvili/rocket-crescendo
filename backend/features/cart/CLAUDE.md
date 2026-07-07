# cart feature (backend)

Server-backed shopping cart for **logged-in users**. Persists `{ productId, quantity }`
rows keyed by `userId`, and handles the login-time merge of a guest cart into the saved
server cart. Guests (no session) never touch this feature — their cart is localStorage-only
on the frontend.

## Structure

```
backend/features/cart/
  Cart.repository.ts   # Prisma: findByUser, replaceForUser (full-replace via $transaction), clearForUser
  Cart.service.ts      # getCart, replaceCart (validate+dedupe), mergeCart (greater-quantity), clearCart
  types.ts             # CartItemModel, CartItemInput
  index.ts             # Barrel: CartService + types
```

## Key concepts

- **Keyed by `(userId, productId)`** — one `CartItem` row per product per user (`@@unique`).
  No `Cart` parent model. FK to `User` and `Product` both cascade on delete.
- **Full-replace writes** — `replaceForUser` runs `deleteMany({ userId })` + `createMany` in a
  `$transaction`, mirroring the product/translation replace idiom. The frontend write-through
  always sends the entire cart, so partial updates are unnecessary.
- **`mergeCart` (login merge)** — reads existing server items, then for each incoming (guest)
  item keeps `max(existing, incoming)` quantity. This is the confirmed **greater-quantity**
  rule; re-syncing the same cart on repeat logins does not inflate counts.
- **Validation** — `normalize` rejects non-positive / non-integer quantities and dedupes a
  productId appearing twice in one payload (keeping the greater quantity).
- **Prices** — the cart stores only ids + quantities. Prices are (re)validated server-side at
  checkout by `OrderService.createCheckoutSession`, never trusted from the cart.

## Consumers

- `app/api/cart/route.ts` — `GET` (hydrate), `PUT` (write-through), `DELETE` (clear); all
  session-gated via `auth.api.getSession`, `401` when absent.
- `app/api/cart/merge/route.ts` — `POST` merge on login, returns the merged list.
- Frontend: `frontend/features/cart/hooks/use-cart-sync.ts` drives all of the above.
