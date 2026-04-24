# auth feature

Provides email-and-password authentication UI for the Rocket Crescendo storefront. Used by all visitors (sign-up) and existing users (sign-in). Both forms are centered cards rendered inside `app/[lng]/(auth)/layout.tsx`, which has no nav or footer. On success each form redirects to `/` and calls `router.refresh()` to flush server-component cache.

## Structure

```
auth/
  components/
    SignInButton.tsx # Outline button rendered in the site header; navigates to ROUTES.SIGN_IN via locale-aware Link
    SignInForm.tsx   # Centered card: email + password fields, calls signIn.email(), shows server errors
    SignUpForm.tsx   # Centered card: name + email + password fields, calls signUp.email(), shows server errors
  auth-client.ts    # Better Auth React client — exports authClient, signIn, signUp, signOut, useSession
  index.ts          # Barrel export: SignInButton, SignInForm, SignUpForm, authClient, signIn, signUp, signOut, useSession
```

## Key patterns

- **`SignInForm` / `SignUpForm`** — each is a self-contained `'use client'` component that owns its own react-hook-form instance with Yup validation. They import `signIn` / `signUp` directly from `@/frontend/lib/auth-client` (the Better Auth React client) and set a local `serverError` state when the auth call returns an error object.
- **Validation** — Yup schemas are defined inline in each component file. Email must be a valid email; password must be ≥ 8 characters; name must be ≥ 2 characters.
- **Auth client** — `auth-client.ts` exports `signIn`, `signUp`, `signOut`, and `useSession` from `better-auth/react`. Import from `@/frontend/features/auth` (barrel) or directly from `@/frontend/features/auth/auth-client`. Never import from `better-auth` directly in components.
- **Server-side session** — to read the session in a server component or route handler, use `auth.api.getSession({ headers: await headers() })` from `@/lib/auth` (the server config).
- **Route layout** — auth pages live under `app/[lng]/(auth)/` which has a bare centred layout. They do **not** inherit the main layout's `<Header>` / `<Footer>`.

## How to extend

### Adding a new field to sign-up (e.g. username)

1. Add the field to the Yup schema in `SignUpForm.tsx`.
2. Add the matching `<Label>` + `<Input>` block inside the form JSX.
3. Pass the new field to `signUp.email({ ..., username: values.username })` — Better Auth forwards extra fields to the `user` table if the column exists.
4. Add the column to the `User` model in `backend/prisma/schema.prisma` and run `npx prisma db push && npx prisma generate`.

### Adding password reset

1. Add `sendResetPassword` handler to the auth server config in `lib/auth.ts`.
2. Create `frontend/features/auth/components/ForgotPasswordForm.tsx` using `authClient.requestPasswordReset(...)`.
3. Create `frontend/features/auth/components/ResetPasswordForm.tsx` using `authClient.resetPassword(...)`.
4. Add pages at `app/[lng]/(auth)/forgot-password/page.tsx` and `app/[lng]/(auth)/reset-password/page.tsx`.
5. Export the new components from `index.ts`.
