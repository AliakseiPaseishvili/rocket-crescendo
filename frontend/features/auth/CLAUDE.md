# auth feature

Provides email-and-password authentication UI for the Rocket Crescendo storefront. Used by all visitors (sign-up) and existing users (sign-in). Both forms are centered cards rendered inside `app/[lng]/(auth)/layout.tsx`, which has no nav or footer. On success each form redirects to `ROUTES.BASE` (`/`) and calls `router.refresh()` to flush server-component cache. `AuthStatus` is used in the header to conditionally show the sign-in button or the current user's avatar dropdown.

## Structure

```
auth/
  components/
    AuthStatus.tsx           # Client component: shows SignInButton when unauthenticated; Avatar + DropdownMenu (full name + SignOutButton) when signed in
    EmailPasswordFields.tsx  # Generic email + password field pair; shared by SignInForm and SignUpForm
    SignInButton.tsx          # Outline button rendered in the site header; navigates to ROUTES.SIGN_IN via locale-aware Link
    SignInForm.tsx            # Centered card: uses EmailPasswordFields, calls signIn.email(), shows server errors
    SignOutButton.tsx         # Outline button that calls signOut() and router.refresh(); rendered in BurgerMenu and inside AuthStatus dropdown
    SignUpForm.tsx            # Centered card: name field + EmailPasswordFields, calls signUp.email(), shows server errors
    index.ts                  # Barrel export for all components
  hooks/
    use-sign-in-schema.ts     # Returns a memoised Yup schema for email + password (i18n-aware)
    use-sign-up-schema.ts     # Extends useSignInSchema via .shape() to add the name field
    index.ts                  # Barrel export for hooks
  auth-client.ts              # Better Auth React client — exports authClient, signIn, signUp, signOut, useSession
  index.ts                    # Barrel export: AuthStatus, EmailPasswordFields, SignInButton, SignInForm, SignOutButton, SignUpForm, authClient, signIn, signUp, signOut, useSession
```

## Key patterns

- **`AuthStatus`** — calls `useSession()` on the client; renders `<SignInButton>` while the session is absent (`null` or loading). When authenticated, renders an `<Avatar>` (first letter of `session.user.name`) wrapped in a `<DropdownMenu>`. The dropdown shows `session.user.name` as a label and `<SignOutButton>` as the only action via `<DropdownMenuItem asChild>` — Radix's `asChild` merges the menu-item close handler with `SignOutButton`'s own `onClick`, so both fire on click with no nested `<button>` in the DOM.
- **`SignOutButton`** — calls `signOut()` then `router.refresh()` on click. Uses `t('signOut.submit')` from the `auth` namespace for its label. Rendered in two places: `BurgerMenu` (mobile overlay) and inside the `AuthStatus` dropdown (desktop header).
- **`EmailPasswordFields`** — a generic `'use client'`-compatible component typed as `<T extends FieldValues>` so it accepts the `register` function from either `SignInForm` (2-field) or `SignUpForm` (3-field) without type errors. Renders the email and password `<Label>` / `<Input>` / error blocks and reads translations itself. Pass `register` and `errors` from `useForm`.
- **`useSignInSchema` / `useSignUpSchema`** — Yup schemas are defined in hooks (not inline in components) so they can be composed. `useSignUpSchema` calls `useSignInSchema()` and extends it with `.shape({ name })`, keeping the two schemas in sync automatically. Both are wrapped in `useMemo` keyed on `t` to avoid rebuilding on every render.
- **`SignInForm` / `SignUpForm`** — each is a self-contained `'use client'` component that owns its own `react-hook-form` instance wired to the matching schema hook via `yupResolver`. Server errors from Better Auth are stored in local `serverError` state and rendered below the shared fields.
- **Navigation** — cross-form links (sign-in ↔ sign-up) use the locale-aware `Link` from `@/frontend/features/translation/i18n/navigation` and route constants from `ROUTES` in `@/frontend/constants`. Never use bare `<a>` tags or hard-coded path strings.
- **Auth client** — `auth-client.ts` wraps `createAuthClient` from `better-auth/react` and re-exports `signIn`, `signUp`, `signOut`, `useSession`. Import from `@/frontend/features/auth` (barrel) or directly from `@/frontend/features/auth/auth-client`. Never import from `better-auth` directly in components.
- **Server-side session** — to read the session in a server component or route handler, use `auth.api.getSession({ headers: await headers() })` from the server auth config. Never import `useSession` in server components.
- **Route layout** — auth pages live under `app/[lng]/(auth)/` which has a bare centred layout. They do **not** inherit the main layout's `<Header>` / `<Footer>`.

## How to extend

### Adding a new field to sign-up (e.g. username)

1. Add the field to the Yup schema in `hooks/use-sign-up-schema.ts` via `.shape({ username: yup.string()... })`.
2. Add the matching `<Label>` + `<Input>` block inside `SignUpForm.tsx` (inline, like the existing `name` field — only email/password belong in `EmailPasswordFields`).
3. Pass the new field to `signUp.email({ ..., username: values.username })` — Better Auth forwards extra fields to the `user` table if the column exists.
4. Add the column to the `User` model in `backend/prisma/schema.prisma` and run `npx prisma db push && npx prisma generate`.

### Adding a field shared by both sign-in and sign-up (e.g. captcha token)

1. Add the field to `hooks/use-sign-in-schema.ts` — `useSignUpSchema` inherits it automatically via `.shape()`.
2. Add the matching `<Label>` + `<Input>` block to `EmailPasswordFields.tsx` and update its local `FieldErrors` type.

### Adding a new action to the AuthStatus dropdown

1. Create the action component (or reuse an existing one).
2. Add a `<DropdownMenuSeparator />` and `<DropdownMenuItem asChild>` wrapping your component inside the `<DropdownMenuContent>` in `AuthStatus.tsx`.

### Adding password reset

1. Add `sendResetPassword` handler to the auth server config.
2. Create `frontend/features/auth/components/ForgotPasswordForm.tsx` using `authClient.requestPasswordReset(...)`.
3. Create `frontend/features/auth/components/ResetPasswordForm.tsx` using `authClient.resetPassword(...)`.
4. Add pages at `app/[lng]/(auth)/forgot-password/page.tsx` and `app/[lng]/(auth)/reset-password/page.tsx`.
5. Add `FORGOT_PASSWORD` and `RESET_PASSWORD` to `ROUTES` in `frontend/constants.ts`.
6. Export the new components from `components/index.ts` and the feature `index.ts`.
