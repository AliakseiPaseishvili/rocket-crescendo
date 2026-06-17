# subscription feature

Customer-facing UI for the newsletter double opt-in flow. Provides the sign-up entry point (email form for anonymous visitors, one-click button for logged-in users) and the confirmation landing page that the emailed link points to.

## Structure

```
subscription/
  components/
    SubscribeNewsletter.tsx    # Entry component: reads useSession, renders SubscribeButton (logged in) or SubscribeForm (anon) + shared intro copy
    SubscribeForm.tsx          # Anonymous UI: email Input + Subscribe Button, validated via useSubscribeForm
    SubscribeButton.tsx        # Logged-in UI: button only (uses the session email passed as a prop), no input
    SubscribeResultMessage.tsx # Shared success/error message driven by subscribe status + isError
    SubscribeConfirmView.tsx   # Reads ?token= and auto-POSTs it to /api/subscription/confirm; shows loading/success/error card
    index.ts                   # Barrel export for components
  hooks/
    use-subscribe.ts           # useMutation: POST email to /api/subscription; exposes subscribe(email), isPending, error, status
    use-subscribe-form.ts      # react-hook-form + Yup (email) wired to useSubscribe
    index.ts                   # Barrel export for hooks
  index.ts                     # Barrel export: SubscribeConfirmView, SubscribeNewsletter
```

## Key patterns

- **`SubscribeNewsletter`** — the entry point dropped into the landing page (`SubscribeSection`). Calls `useSession()` from `@/frontend/features/auth`; while the session is loading (`isPending`) it renders only the intro copy, then branches: a logged-in user gets `<SubscribeButton email={session.user.email} />`, an anonymous visitor gets `<SubscribeForm />`.
- **`SubscribeForm`** (anonymous) — single email `Input` + submit `Button`. Uses `useSubscribeForm`; shows the inline Yup validation error and the shared `SubscribeResultMessage`.
- **`SubscribeButton`** (logged in) — strictly a Subscribe button (no email shown, by design); on click fires `subscribe(email)` with the session email passed as a prop. Registered emails auto-confirm server-side, so the result is normally `confirmed`.
- **`SubscribeResultMessage`** — shared result UI used by both paths. Given `status` (`'pending' | 'confirmed'`) it shows `form.successPending` (check your inbox) or `form.successConfirmed` (you're subscribed); given `isError` it shows `form.errorMessage`. Each path owns its own `useSubscribe` instance, so the message reflects that path's mutation.
- **`useSubscribe`** — wraps `useMutation` calling `api.subscribe({ body: { email } })` (typed `api`, not raw `fetch`). Returns `subscribe` (the `mutate` fn taking an email string), `isPending`, `error`, and `status` (from the `{ status }` response, `undefined` until resolved).
- **`useSubscribeForm`** — react-hook-form + `yupResolver`; one required, email-formatted `email` field with messages from `useTranslations('subscription')` (`form.emailRequired` / `form.emailInvalid`). Mirrors the categories form-hook pattern; delegates the request to `useSubscribe`.
- **`SubscribeConfirmView`** — client component rendered by `app/[lng]/(main)/subscribe/confirm/page.tsx` (wrapped in `<Suspense>` because it uses `useSearchParams`). Reads `?token=` and fires `api.confirmSubscription({ body: { token } })` automatically on mount; a `useRef` guard (`startedRef`) ensures it runs exactly once under React StrictMode. Title/description switch between loading/success/error; a missing token is the error state immediately.
- **i18n** — all copy comes from `useTranslations("subscription")`: the sign-up UI under `subscription.form.*`, the confirm page under `subscription.confirm.*`, in `frontend/features/translation/messages/{en,fr,ru}.json`.

## How to extend

### Adding a field to the subscribe form

1. Add the field to the `SubscribeFormValues` type in `hooks/use-subscribe-form.ts` and to the Yup schema there.
2. Add the form control to `SubscribeForm.tsx` (register it / wire validation).
3. Add the new copy under `subscription.form.*` in all three message files.
4. Extend `SubscribeInput` in `backend/features/subscription` and the `subscribe` payload type in `frontend/features/api/subscription.ts` if the backend needs the new field.
