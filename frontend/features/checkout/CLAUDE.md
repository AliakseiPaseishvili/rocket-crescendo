# checkout feature

Customer-facing checkout page at `/[lng]/checkout`. Collects a billing/shipping address (guest or registered flow) alongside a read-only cart summary, then creates the order + Stripe Checkout session and redirects to Stripe. Reached from the cart drawer's "Checkout" button (`cart` feature), not directly from Stripe. Also owns the post-Stripe result screens (`CheckoutSuccess` / `CheckoutCancel`) that Stripe redirects back to.

## Structure

```
checkout/
  components/
    CheckoutView.tsx        # 'use client' page body: owns the single <form>; reads useSession(); auth-driven flow; empty-cart guard
    FlowChoice.tsx          # Anonymous-only two-button pre-step: "Continue as guest" | "Sign in"
    CheckoutForm.tsx        # left column: all address fields (Input/Textarea + CountrySelect); email disabled in registered flow
    CountrySelect.tsx       # shadcn Select of COUNTRIES; wired via a Controller in CheckoutForm
    CheckoutSummary.tsx     # right column: cart line items + total (via useCartProducts) + type="submit" "Complete purchase" button
    CheckoutSummaryRow.tsx  # single summary line: localized product name × qty + line total (usePickTranslation)
    CheckoutSuccess.tsx     # Stripe success_url screen at /[lng]/checkout/success; clears the cart on mount
    CheckoutCancel.tsx      # Stripe cancel_url screen at /[lng]/checkout/cancel; "payment cancelled" message
    index.ts                # Barrel export for components
  hooks/
    use-checkout-form-schema.ts  # useMemo Yup schema; i18n error messages
    use-checkout-form.ts         # react-hook-form (mode:'onChange') + useCheckout(); onSubmit maps values → { email, address }
    index.ts                     # Barrel: useCheckoutForm, useCheckoutFormSchema
  constants.ts              # COUNTRIES: { code; name }[] and the Country type
  types.ts                  # CheckoutFormValues
  index.ts                  # Barrel export: CheckoutView, CheckoutOptions, CheckoutSuccess, CheckoutCancel
```

## Types

| Type | Shape |
|---|---|
| `CheckoutFormValues` | `{ email; country; region; addressLine1; addressLine2; flatNumber; city; postcode; additionalInfo }` — all `string` (optional fields default to `''`) |
| `Country` | `{ code: string; name: string }` |

`CheckoutAddressInput` and `CheckoutResult` come from `@/backend/features/order`. The mutation lives in the `cart` feature: `useCheckout` and `useCartProducts` are imported from `@/frontend/features/cart`.

## Key patterns

- **Single form, split columns** — `CheckoutView` calls `useCheckoutForm()` once and wraps the whole `md:grid-cols-[1fr_360px]` grid in one `<form onSubmit>`. `CheckoutForm` (left) gets `register`/`control`/`errors`; `CheckoutSummary` (right) renders the `type="submit"` button. This lets the right-column button submit the left-column fields with no shared context/prop-drilling beyond `formState`.
- **Validity gate** — the form uses `mode: 'onChange'` + `yupResolver`, so `formState.isValid` drives the "Complete purchase" button's `disabled` (also disabled while `isPending` or the cart is empty). Required fields: `email`, `country`, `addressLine1`, `city`, `postcode`.
- **Optional-string schema** — optional address fields use `yup.string().defined()` (not `.required()`) so they accept `''` yet infer as `string`, keeping `CheckoutFormValues` all-`string` and the `yupResolver` generic aligned with `useForm<CheckoutFormValues>`.
- **Auth-driven flow (no tab selector)** — the flow is derived purely from `useSession()`. `isRegistered = !!session?.user.email`. Logged-in users skip any selection and see the form directly (registered flow). Anonymous users first see `FlowChoice`, gated by an anon-only `guestChosen` boolean state.
- **`FlowChoice` two-button pre-step** — shown only when `!isRegistered && !guestChosen`. "Continue as guest" calls `onGuest` → `setGuestChosen(true)` (reveals the form); "Sign in" calls `onRegistered` → `router.push(ROUTES.SIGN_IN)` (locale-aware `useRouter` from `@/frontend/features/translation/i18n/navigation`) — the registered flow requires an account, so guests are redirected immediately.
- **Guest back control** — once an anonymous guest is on the form (`!isRegistered && guestChosen`), a `ghost` "Back" `Button` above the form calls `setGuestChosen(false)` to return to `FlowChoice`. Logged-in users never see it.
- **Email prefill + lock** — when `isRegistered` (registered flow *and* a session exists), a `useEffect` does `form.setValue('email', session.user.email, { shouldValidate: true })` and `CheckoutForm` receives `emailDisabled` to lock the field. The server still overrides the email from the session, so the disabled field is UX only.
- **onSubmit shape mapping** — `useCheckoutForm` destructures the form values into `{ email, address }`, converting empty optional strings to `undefined` (`region || undefined`, etc.) so the backend stores `null` rather than `''`, then calls `checkout.mutate({ email, address })`.
- **Read-only summary** — `CheckoutSummary` reuses `useCartProducts()` and computes the total the same way as the cart drawer, but renders `CheckoutSummaryRow` (no quantity steppers/remove) — the checkout page does not mutate the cart. `usePickTranslation` is called per row inside `CheckoutSummaryRow` (a hook cannot run in a `.map`).
- **Empty-cart guard** — if the store has no items, `CheckoutView` renders an empty state with a `Continue shopping` link instead of the form.
- **Post-Stripe result screens** — `CheckoutSuccess` (rendered by `app/[lng]/(main)/checkout/success/page.tsx`) calls `useCartStore((s) => s.clear)` in a `useEffect` to empty the cart on landing; `CheckoutCancel` (`.../checkout/cancel/page.tsx`) is a static "payment cancelled" screen. Both import `useCartStore` (only success uses it) and the locale-aware `Link` "Back home" from the `cart` feature barrel, and read their strings from the **`cart`** namespace (`successTitle/Message`, `cancelTitle/Message`, `backHome`), not `checkout`.
- **i18n** — form strings live under the `checkout` namespace in `messages/{en,fr,ru}.json`; the success/cancel screens use the `cart` namespace (see above).

## How to extend

### Adding a new address field (e.g. `phone`)

1. Add the field to `CheckoutFormValues` in [types.ts](types.ts) and to `defaultValues` in [hooks/use-checkout-form.ts](hooks/use-checkout-form.ts).
2. Add the Yup rule in [hooks/use-checkout-form-schema.ts](hooks/use-checkout-form-schema.ts) (`.required(t('...'))` or `.defined()`).
3. Add the `<Label>` + control in [components/CheckoutForm.tsx](components/CheckoutForm.tsx).
4. If optional, add it to the `|| undefined` mapping in `useCheckoutForm`'s `onSubmit`.
5. Add `CheckoutAddressInput` field in `backend/features/order/types.ts`, persist it in `Order.repository.ts` (`address.create`), and add the column to `OrderAddress` in `backend/prisma/schema.prisma` → `npx prisma db push && npx prisma generate`.
6. Add the i18n keys under the `checkout` namespace in `en.json`, `fr.json`, `ru.json`.
