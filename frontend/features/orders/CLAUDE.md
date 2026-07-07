# orders feature

Admin-only dashboard for fulfilling paid orders. Displays a status-filterable, infinite-scroll table of `PAID` / `PREPARED` / `SENT` orders — each showing order number, current status, purchased items, delivery address, and recipient email — and lets an admin advance an order's status one step at a time (`PAID → PREPARED → SENT`). Marking an order `SENT` triggers a shipping-notification email to the customer (handled backend-side).

## Structure

```
orders/
  components/
    OrderList.tsx           # Admin data-table of orders: status filter tabs + infinite-scroll sentinel
    OrderStatusCell.tsx     # Status badge + single "advance status" button (PAID→PREPARED→SENT)
    OrderItemsCell.tsx      # Renders one order's items as "name × qty" list
    OrderAddressCell.tsx    # Renders one order's delivery address (skips empty fields)
    index.ts                # Barrel export for components
  hooks/
    use-orders-query.ts     # useOffsetPagination: paginated order list, filtered by status
    use-update-order-status.ts # useMutation: PATCH order status, invalidates ORDERS_QUERY_KEY
    index.ts                # Barrel export for hooks
  constants.ts              # ORDERS_QUERY_KEY, ORDERS_PAGE_LIMIT
  index.ts                  # Barrel export: OrderList, OrderStatusCell, OrderItemsCell, OrderAddressCell, useOrdersQuery, useUpdateOrderStatus
```

## Types

All order types come from the backend — this feature has no local `types.ts`.

| Type | Source | Shape |
|---|---|---|
| `AdminOrder` | `@/backend/features/order` | order row + `address: OrderAddressModel \| null` + `items: AdminOrderItem[]` (names resolved server-side) |
| `AdminOrderItem` | `@/backend/features/order` | `{ productId: string; name: string; quantity: number; unitAmount: number }` |
| `OrderAddressModel` | `@/backend/features/order` | delivery address row (`country`, `addressLine1`, `city`, `postcode`, optional `region`/`addressLine2`/`flatNumber`/`additionalInfo`) |
| `OrderStatus` (value) | `@/backend/app/generated/prisma/enums` | enum imported as a **value** for comparisons/keys — imported from the generated enums module (not the feature barrel) so no server code is bundled into the client |

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `ORDERS_QUERY_KEY` | `'orders'` | `useOrdersQuery` (keyed by `[ORDERS_QUERY_KEY, status]`), `useUpdateOrderStatus` (invalidates `[ORDERS_QUERY_KEY]`) |
| `ORDERS_PAGE_LIMIT` | `20` | `useOrdersQuery` — page size + offset step |

## Key patterns

- **`OrderList`** — owns the `status` filter state (a `useState<OrderStatus | undefined>`, `undefined` = all fulfilment statuses). Builds `ColumnDef<AdminOrder>[]` inline and delegates rendering to the shared `DataTable`. Filter is a shadcn `Tabs` control whose `'all'` sentinel value maps to `undefined`; the `PAID`/`PREPARED`/`SENT` tab values are the enum members directly. Changing the tab changes the query key, so React Query refetches.
- **Infinite scroll** — the table body is wrapped in a `max-h-[70vh] overflow-y-auto` container with a sentinel `<div>` at the bottom. `useInfiniteScroll(fetchNextPage)` (from `@/frontend/features/react-query`) attaches an `IntersectionObserver` to that sentinel and calls the guarded `fetchNextPage` when it scrolls into view. There is no "Load more" button — paging is automatic.
- **`OrderStatusCell`** — receives only `{ id, status }` so the list stays free of mutation logic. A local `NEXT_STATUS` map defines the single legal forward transition per status; the advance button renders only when a next status exists (so `SENT` rows show just the badge). Clicking calls `useUpdateOrderStatus().mutate({ params: { id }, body: { status: next } })`. Badge variant is chosen per status via `BADGE_VARIANT`.
- **`OrderItemsCell` / `OrderAddressCell`** — pure presentational cells taking already-resolved data (`AdminOrder.items` names are resolved by the backend service; the address is the stored `OrderAddressModel`). `OrderAddressCell` filters out empty/whitespace lines and renders an em dash when address is `null`.
- **Value-vs-type imports** — types use `import type ... from '@/backend/features/order'` (erased at build). The `OrderStatus` **enum value** is imported from `@/backend/app/generated/prisma/enums` instead, because importing a runtime value from the feature barrel would pull `OrderService` (and its Prisma/Stripe/SendGrid deps) into the client bundle.

## How to extend

### Adding a new order status transition (e.g. SENT → DELIVERED)

1. Add the value to the `OrderStatus` enum in `backend/prisma/schema.prisma` and run `npx prisma db push` + `npx prisma generate` (this repo uses `db push`, not `migrate`, because auth tables are managed by Better Auth).
2. Allow the new transition in `OrderService.updateOrderStatus` (`backend/features/order/Order.service.ts`) and, if it should appear in the dashboard, add it to `ADMIN_ORDER_STATUSES` in `backend/features/order/constants.ts`.
3. Add the transition to `NEXT_STATUS` (and a variant to `BADGE_VARIANT`) in `OrderStatusCell.tsx`.
4. Add a filter `TabsTrigger` in `OrderList.tsx` if the status should be filterable.
5. Add translation keys (`statusX`, `markX`, `filterX`) under the `order` namespace in all three `frontend/features/translation/messages/<lng>.json` files.

### Adding a new column to the orders table

1. Add a `ColumnDef<AdminOrder>` entry to the `columns` array in `OrderList.tsx` (extract a dedicated `*Cell.tsx` component if it needs its own logic).
2. If the data isn't on `AdminOrder` yet, extend the backend read shape (`AdminOrder` in `backend/features/order/types.ts` + resolution in `OrderService.withResolvedNames`).
3. Add the column header translation key under the `order` namespace in all three locale files.
