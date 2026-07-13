# my-orders feature

Customer-facing "My Orders" page. Shows the signed-in user their own paid orders — each order's
purchase date, per-item thumbnails (with quantity badge), total item quantity, and amount paid.
**Order status is intentionally never shown.** Separate from the admin-only `orders` feature (which
is the fulfilment dashboard). Rendered at `/[lng]/orders` and linked only from the mobile burger
menu (`NavMobileMenu`), gated to signed-in users.

## Structure

```
my-orders/
  components/
    MyOrders.tsx           # Top-level: useMyOrders() → loading / error / empty / list states + "Load more" button
    MyOrderCard.tsx        # One order: "Order #{number}", localized date, item thumbnails, itemCount + formatted total
    MyOrderItemThumb.tsx   # Single item: Next <Image> thumbnail (ImageIcon fallback) + "×qty" badge + truncated name
    index.ts               # Barrel export for components
  hooks/
    use-my-orders.ts       # useOffsetPagination: paginated GET /api/orders/mine
    index.ts               # Barrel export for hooks
  utils.ts                 # formatMoney(amountCents, currency, locale) — Intl.NumberFormat currency string
  constants.ts             # MY_ORDERS_QUERY_KEY, MY_ORDERS_PAGE_LIMIT
  index.ts                 # Barrel export: MyOrders, MyOrderCard, MyOrderItemThumb, useMyOrders
```

## Types

All order types come from the backend — this feature has no local `types.ts`.

| Type | Source | Shape |
|---|---|---|
| `UserOrder` | `@/backend/features/order` | `{ id; orderNumber; amountTotal; currency; createdAt; itemCount; items: UserOrderItem[] }` — customer-safe (no status/email/address/Stripe ids) |
| `UserOrderItem` | `@/backend/features/order` | `{ productId; name; quantity; unitAmount; imageUrl: string \| null }` — `name`/`imageUrl` resolved server-side |
| `PaginatedUserOrders` | `@/backend/features/order` | `PaginatedItems<UserOrder>` — the `GET /api/orders/mine` response |

`UserOrder` types are `import type` only — no runtime value is pulled from the order barrel, so no
server code lands in the client bundle.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `MY_ORDERS_QUERY_KEY` | `'my-orders'` | `useMyOrders` (query key `[MY_ORDERS_QUERY_KEY]`) |
| `MY_ORDERS_PAGE_LIMIT` | `10` | `useMyOrders` — page size + offset step |

## Key patterns

- **`useMyOrders`** — wraps `useOffsetPagination` (`@/frontend/features/react-query`) over
  `api.getMyOrders`. Returns `{ items, fetchNextPage, queryProps }`; `MyOrders` reads
  `queryProps.{isLoading,isError,hasNextPage,isFetchingNextPage}`. No status filter (unlike the admin
  `useOrdersQuery`) — the endpoint already restricts to the user's own paid orders.
- **`MyOrders`** — owns all view states inline: `isLoading` → `t('loading')`, `isError` →
  `t('error')`, empty (`!items?.length`) → `t('empty')`, else the card list. Paging is a manual
  **"Load more"** button (`fetchNextPage`), not infinite scroll — simpler than the admin dashboard's
  `useInfiniteScroll`.
- **`MyOrderCard`** — presentational; formats the date with `Intl.DateTimeFormat(locale, …)` and the
  total with `formatMoney`. `locale` comes from `useLocale()` (next-intl); labels from
  `useTranslations('myOrders')`. Interpolates `orderNumber`/`itemCount` counts through the message
  keys.
- **`MyOrderItemThumb`** — mirrors the product card's image idiom (`fill` + `object-cover` in a
  `relative` box, `ImageIcon` placeholder when `imageUrl` is null). The `imageUrl` is already
  resolved by the backend service (`OrderService.pickImageUrl` → main image, else additional image),
  so the client does no `productFiles` lookup.
- **`formatMoney`** — `amountTotal`/`unitAmount` are integer **cents**; divides by 100 and formats
  via `Intl.NumberFormat(locale, { style: 'currency', currency })`. Do not reuse the cart/checkout
  `$${x.toFixed(2)}` pattern — those operate on dollar floats, not cents.
- **No status anywhere** — the `UserOrder` shape deliberately omits `status`; the UI must never
  surface it. If you add fields, keep them customer-safe.

## How to extend

### Adding a field to each order card (e.g. delivery ETA)

1. Add the field to `UserOrder` in `backend/features/order/types.ts` and populate it in
   `OrderService.getOrdersForUser` (`backend/features/order/Order.service.ts`). If it needs address
   data, widen `findAllForUser`'s include in `Order.repository.ts` (currently `{ items: true }`).
2. Render it in `MyOrderCard.tsx`.
3. Add any label under the `myOrders` namespace in `frontend/features/translation/messages/en.json`,
   `fr.json`, and `ru.json` (types update automatically from `en.json`).
