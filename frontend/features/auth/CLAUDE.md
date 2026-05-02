# auth feature

Provides email-and-password authentication UI for the Rocket Crescendo storefront. Covers sign-up, sign-in, email verification (with resend), forgot password, and password reset. All forms are centered cards rendered inside `app/[lng]/(auth)/layout.tsx`, which has no nav or footer. On successful sign-in the form redirects to `ROUTES.BASE` (`/`) and calls `router.refresh()` to flush server-component cache. `AuthStatus` is used in the header to conditionally show the sign-in button or the current user's avatar dropdown.

## Structure

```
auth/
  components/
    AuthStatus.tsx                # Client component: shows SignInButton when unauthenticated; Avatar + DropdownMenu (full name + SignOutButton) when signed in
    EmailPasswordFields.tsx       # Generic email + password field pair (generic over FieldValues); shared by SignUpForm via PasswordWithConfirmFields
    ForgotPasswordForm.tsx        # Card form: email field, calls authClient.requestPasswordReset(), switches to a success card after submit
    PasswordInput.tsx             # Input wrapper with show/hide toggle and optional green check icon when isMatch=true
    PasswordPolicyChecklist.tsx   # Reads "password" from FormContext via useWatch; renders 5 PolicyItem rows (length, upper, lower, number, special)
    PasswordWithConfirmFields.tsx # Combines EmailPasswordFields + confirm-password PasswordInput; watches both fields to drive the isMatch green check
    PolicyItem.tsx                # Single policy line: Check (green) or X (muted) icon + label; driven by a boolean met prop
    ResetPasswordForm.tsx         # Reads ?token= from URL; password + confirm fields with full policy validation; calls authClient.resetPassword(), redirects to SIGN_IN on success; shows error card if token is absent
    SignInButton.tsx              # Outline button rendered in the site header; navigates to ROUTES.SIGN_IN via locale-aware Link
    SignInForm.tsx                # Card form: identifier (email or username) + password fields + "Forgot password?" link; auto-detects email vs username by @; calls signIn.email() or signIn.username()
    SignOutButton.tsx             # Outline button that calls signOut() and router.refresh(); rendered in BurgerMenu and inside AuthStatus dropdown
    SignUpForm.tsx                # Card form: firstName, lastName, username (required), gender, birthdate + PasswordWithConfirmFields + PasswordPolicyChecklist; calls signUp.email(); redirects to VERIFY_EMAIL?email=…
    VerifyEmailView.tsx           # Info card shown after sign-up; if ?email= param is present shows a resend button with a 5-minute countdown (useMutation + setInterval)
    index.ts                      # Barrel export for all components
  hooks/
    use-forgot-password-schema.ts # Returns a memoised Yup schema for email (i18n-aware)
    use-reset-password-schema.ts  # Returns a memoised Yup schema for password + confirmPassword with all 5 policy rules
    use-sign-in-schema.ts         # Returns a memoised Yup schema for email + password (i18n-aware)
    use-sign-up-schema.ts         # Extends useSignInSchema via .shape() to add name, username, gender, birthdate, full password policy, confirmPassword
    index.ts                      # Barrel export for hooks
  auth-client.ts                  # Better Auth React client — exports authClient, signIn, signUp, signOut, useSession
  types.ts                        # SignUpFormValues, SignInFormValues
  index.ts                        # Barrel export: all components + authClient, signIn, signUp, signOut, useSession
```

## Types

| Type | Shape |
|---|---|
| `SignUpFormValues` | `{ firstName: string; lastName: string; username: string; email: string; password: string; confirmPassword: string; gender: "" \| "male" \| "female"; birthdate: string }` |
| `SignInFormValues` | `{ identifier: string; password: string }` |

`ForgotPasswordForm` and `ResetPasswordForm` each define their own local form-value types inline (not exported) since they are not shared.

## Key patterns

- **`AuthStatus`** — calls `useSession()` on the client; renders `<SignInButton>` while the session is absent (`null` or loading). When authenticated, renders an `<Avatar>` (first letter of `session.user.name`) wrapped in a `<DropdownMenu>`. The dropdown uses `<DropdownMenuItem asChild>` so Radix's close handler and `SignOutButton`'s own `onClick` both fire on click with no nested `<button>` in the DOM.
- **`SignInForm` identifier detection** — the form has a single `identifier` field. On submit it checks whether the value contains `@`; if so it calls `signIn.email()`, otherwise `signIn.username()`. This avoids a separate toggle or two separate fields.
- **`SignInForm` "Forgot password?" link** — rendered inline inside the password label row (`flex items-center justify-between`) so it sits at the same level as the label without adding layout complexity.
- **`EmailPasswordFields`** — generic over `T extends FieldValues` so it accepts `register` from either `SignInForm` (2-field schema) or `SignUpForm` (8-field schema) without type errors. Only `email` and `password` error shapes are needed; these are typed as a local `FieldErrors` type rather than the full form schema.
- **`PasswordWithConfirmFields`** — consumes `FormContext` (must be inside a `<FormProvider>`). Renders `EmailPasswordFields` then a confirm-password `PasswordInput`. Watches both `password` and `confirmPassword` via `useWatch` to derive `passwordsMatch`; passes it as `isMatch` to `PasswordInput` to show the green check icon.
- **`PasswordPolicyChecklist`** — also consumes `FormContext` and watches `password`. Uses `useFormContext<SignUpFormValues>()` — it is coupled to the sign-up form and should not be dropped into other forms unless the context has a `password` field.
- **`useSignInSchema` / `useSignUpSchema`** — Yup schemas live in hooks (not inline in components) so they can be composed. `useSignUpSchema` calls `useSignInSchema()` and extends it with `.shape(...)`, overriding the `password` field to add the five policy rules. Both are wrapped in `useMemo` keyed on `t` (and `signInSchema` for `useSignUpSchema`) to avoid rebuilding on every render.
- **`VerifyEmailView` resend** — `SignUpForm` appends `?email=<encoded>` when redirecting to `ROUTES.VERIFY_EMAIL`. `VerifyEmailView` reads this param via `useSearchParams` (requires `<Suspense>` in the page). The resend mutation uses `useMutation` from TanStack Query; loading/success/error state comes from `isPending` / `isSuccess` / `isError`. A 300-second countdown is tracked separately in `useState` + `setInterval` via `useEffect`, started in the mutation's `onSuccess` callback.
- **`ForgotPasswordForm` success state** — after a successful `authClient.requestPasswordReset()` call, the component replaces the form card with a success card (checked via `isSuccess` from `useMutation`). It never navigates away, intentionally avoiding disclosure of whether the email exists.
- **`ResetPasswordForm`** — reads `?token=` from `useSearchParams` (requires `<Suspense>` in the page). If the token is absent it immediately renders an error card with a link to `ROUTES.FORGOT_PASSWORD` instead of the form. Password policy is validated client-side with the same five Yup rules used in sign-up. On success, `router.push(ROUTES.SIGN_IN)` is called in `onSuccess` inside `useMutation`.
- **`SignOutButton`** — calls `signOut()` then `router.refresh()` on click. `router.refresh()` is from Next.js `next/navigation` (not the locale-aware wrapper) because sign-out needs a hard server cache bust rather than a locale-preserving push.
- **Auth client** — `auth-client.ts` wraps `createAuthClient` from `better-auth/react` with `inferAdditionalFields<typeof auth>()` (syncs `lastName`, `gender`, `birthdate` to the client type) and `usernameClient()`. Re-exports `signIn`, `signUp`, `signOut`, `useSession`. Import from `@/frontend/features/auth` (barrel) or directly from `@/frontend/features/auth/auth-client`. Never import from `better-auth` directly in components.
- **Server-side session** — to read the session in a server component or route handler, use `auth.api.getSession({ headers: await headers() })` from the server auth config. Never import `useSession` in server components.
- **Route layout** — auth pages live under `app/[lng]/(auth)/` which has a bare centred layout. They do **not** inherit the main layout's `<Header>` / `<Footer>`. Pages that use `useSearchParams` (`VerifyEmailView`, `ResetPasswordForm`) must be wrapped in `<Suspense>` in their page file.

## How to extend

### Adding a new field to sign-up (e.g. phone number)

1. Add the field to `SignUpFormValues` in `types.ts`.
2. Add the Yup rule to `hooks/use-sign-up-schema.ts` via `.shape({ phone: yup.string()... })`.
3. Add the matching `<Label>` + `<Input>` block inside `SignUpForm.tsx` (inline, like the existing `username` field — only email/password belong in `EmailPasswordFields`).
4. Pass the new field to `signUp.email({ ..., phone: values.phone })` — Better Auth forwards extra fields to the `user` table if the column exists.
5. Add the column to the `User` model in `backend/prisma/schema.prisma` and run `npx prisma db push && npx prisma generate`.
6. Register the field as an `additionalField` in `backend/features/auth/auth.ts`.

### Adding a new action to the AuthStatus dropdown

1. Create the action component (or reuse an existing one).
2. Add a `<DropdownMenuSeparator />` and `<DropdownMenuItem asChild>` wrapping your component inside the `<DropdownMenuContent>` in `AuthStatus.tsx`.

### Adding a field shared by both sign-in and sign-up (e.g. captcha token)

1. Add the field to `hooks/use-sign-in-schema.ts` — `useSignUpSchema` inherits it automatically via `.shape()`.
2. Add the matching `<Label>` + `<Input>` block to `EmailPasswordFields.tsx` and update its local `FieldErrors` type.
