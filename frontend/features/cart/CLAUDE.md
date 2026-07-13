# cart feature

Shopping cart: a Zustand store (persisted to localStorage) that is **hybrid** — localStorage
for guests, server-backed for logged-in users — a slide-in drawer with line items and totals,
and the Stripe Checkout redirect flow plus success/cancel screens.

## Structure

```
cart/
  store/
    useCartStore.ts       # Zustand + persist store; items: { productId, quantity }[]; addItem/removeItem/setQuantity/replaceAll/clear; selectCartCount selector
  hooks/
    use-cart-products.ts  # useQuery hydrating full products from the store's ids via api.getProductsByIds
    use-cart-sync.ts      # session↔cart sync: merge on login, clear on logout, debounced write-through while authed
    use-checkout.ts       # useMutation → api.createCheckout({ items, lng, email, address }) → redirects to Stripe (window.location); called by the checkout feature's form
    index.ts
  components/
    CartButton.tsx        # Header trigger + right Drawer; badges the item count; renders CartContent
    CartContent.tsx       # Empty state OR line items + total + Checkout button (wrapped in DrawerClose → closes drawer, navigates to /checkout)
    CartItemRow.tsx       # Single line: image, name, qty stepper, line total, remove
    CartSyncProvider.tsx  # Headless: calls useCartSync(); mounted once in (main)/layout.tsx
    index.ts
  index.ts                # Barrel: CartButton, CartSyncProvider, useCheckout, useCartProducts, useCartStore, selectCartCount, CartItem
```

> The post-Stripe result screens (`CheckoutSuccess` / `CheckoutCancel`) now live in the `checkout` feature (`frontend/features/checkout`). `CheckoutSuccess` still imports `useCartStore` from this feature's barrel to clear the cart, and both still use the `cart` i18n namespace.

## Hybrid sync (logged-in users)

`useCartSync` (driven by the headless `CartSyncProvider` in the main layout) watches
`useSession` and:

- **On login** (incl. first resolve while authed): `api.mergeCart({ items })` merges the local
  cart into the server cart (greater-quantity wins) and adopts the result via `store.replaceAll`.
  This subsumes plain hydration (empty local ⇒ merge == fetch).
- **On logout**: `store.clear()` — the confirmed "clear local cart on logout" behaviour.
- **While authed**: a `useCartStore.subscribe` listener debounces (~500 ms) a `PUT /api/cart`
  write-through of the whole cart. A `suppressWrite` ref prevents the merge/hydrate result from
  immediately echoing back to the server.

Guests are untouched: no session ⇒ no network calls, cart stays in localStorage (`rc-cart`).
Backend lives in `backend/features/cart`; API client methods (`getCart`, `replaceCart`,
`mergeCart`, `clearCart`) are in `frontend/features/api/cart.ts`.

## Key patterns

- **Store holds only `{ productId, quantity }`** — never prices. Prices/names/images are re-fetched via `useCartProducts` and re-validated server-side at checkout. Persisted under localStorage key `rc-cart`.
- **`selectCartCount`** — exported selector summing quantities; used by `CartButton` for the badge and safe for `useCartStore(selectCartCount)`.
- **Hydration** — `useCartProducts` calls `api.getProductsByIds` (POST `/api/products/by-ids`), `enabled` only when the cart is non-empty. `CartContent` maps products by id and computes the display total.
- **Checkout is a two-step flow** — the `CartContent` "Checkout" button now navigates to `/[lng]/checkout` (`ROUTES.CHECKOUT`, locale-aware `Link`) rather than calling the mutation directly. It is wrapped in `DrawerClose` (`asChild`) so clicking it closes the cart drawer as it navigates; nested `asChild` (DrawerClose → Button → Link) composes through Radix `Slot`. The address form there (`checkout` feature) collects `{ email, address }` and calls `useCheckout().mutate({ email, address })`. `useCheckout` reads the active locale via `useLocale()`, posts `{ items, lng, email, address }`, and on success sets `window.location.href` to the Stripe-hosted Checkout URL. `useCheckout` and `useCartProducts` are exported from the barrel for the checkout feature to consume. Guest checkout is supported (no auth gate).
- **Success clears the cart** — `CheckoutSuccess` (now in the `checkout` feature) calls this store's `clear()` in a `useEffect`; it is the `success_url` page at `/[lng]/checkout/success`.
- **i18n** — all strings under the `cart` namespace in `messages/{en,fr,ru}.json` (`add`, `total`, `checkout`, `redirecting`, `successTitle/Message`, `cancelTitle/Message`, `backHome`).

## Add-to-cart entry point

`AddToCartButton` lives in the **products** feature (`frontend/features/products/components/AddToCartButton.tsx`) and is rendered inside `Product.tsx` only on public cards (`isHiddenActions`), calling `useCartStore().addItem(product.id)`.

## Related

- Frontend: `frontend/features/checkout` (address form + summary page rendered at `/[lng]/checkout`).
- Backend: `backend/features/order` (checkout session + fulfilment), `backend/features/stripe` (SDK client).
- Routes: `app/[lng]/(main)/checkout/page.tsx` (address form) and `checkout/{success,cancel}/page.tsx`.
