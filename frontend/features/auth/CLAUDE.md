# auth feature

Provides authentication UI for the Rocket Crescendo storefront. Covers sign-up, sign-in (email/password and Google OAuth), email verification (with resend), forgot password, and password reset. All forms are centered cards rendered inside `app/[lng]/(auth)/layout.tsx`, which has no nav or footer. On successful email/password sign-in the form redirects to `ROUTES.BASE` (`/`) and calls `router.refresh()` to flush server-component cache. Google OAuth redirects back to `ROUTES.BASE` via the Better Auth callback. `AuthStatus` is used in the header to conditionally show the sign-in button or the current user's avatar dropdown.

## Structure

```
auth/
  components/
    AuthStatus.tsx                # Client component: shows SignInButton when unauthenticated; Avatar + DropdownMenu when signed in — avatar shows initials (name+lastName, name only, or username), dropdown shows @username row + full-name row
    EmailPasswordFields.tsx       # Generic email + password field pair (generic over FieldValues); shared by SignUpForm via PasswordWithConfirmFields; accepts optional showRequired to render asterisks
    ForgotPasswordForm.tsx        # Card form: email field, calls authClient.requestPasswordReset(), replaces itself with a success card after submit (never navigates away)
    GoogleSignInButton.tsx        # Outline button with Google logo; calls signIn.social({ provider: "google", callbackURL: ROUTES.BASE }) via useMutation; shows error inline on failure
    PasswordInput.tsx             # Input wrapper with show/hide Eye toggle; accepts optional isMatch prop to overlay a green Check icon when passwords match
    PasswordPolicyChecklist.tsx   # Reads "password" from FormContext via useWatch; renders 5 PolicyItem rows (length ≥8, uppercase, lowercase, number, special char)
    PasswordWithConfirmFields.tsx # Combines EmailPasswordFields + confirm-password PasswordInput; watches both fields via useWatch to drive the isMatch green check
    PolicyItem.tsx                # Single policy row: green Check or muted X icon + label; driven by a boolean met prop
    ResetPasswordForm.tsx         # Reads ?token= from URL; password + confirm fields with isMatch indicator and full policy validation; calls authClient.resetPassword(); redirects to SIGN_IN on success; renders error card if token is absent
    SignInButton.tsx              # Outline button rendered in the site header; navigates to ROUTES.SIGN_IN via locale-aware Link
    SignInForm.tsx                # Card form: identifier (email or username) + password + "Forgot password?" link + divider + GoogleSignInButton; auto-detects email vs username by @; calls signIn.email() or signIn.username()
    SignOutButton.tsx             # Outline button that calls signOut() then router.refresh() (next/navigation, not locale-aware) on click; rendered in AuthStatus dropdown
    SignUpForm.tsx                # Card form: firstName, lastName, username (required), gender (Select), birthdate + PasswordWithConfirmFields + PasswordPolicyChecklist + divider + GoogleSignInButton; calls signUp.email(); redirects to VERIFY_EMAIL?email=…
    VerifyEmailView.tsx           # Info card shown after sign-up; if ?email= param present shows a resend button with a 5-minute (300 s) countdown driven by setInterval + useState
    index.ts                      # Barrel export for all components
  hooks/
    use-forgot-password-schema.ts # useMemo: Yup object with email (required, valid format)
    use-reset-password-schema.ts  # useMemo: Yup object with password (5 policy rules) + confirmPassword (must match)
    use-sign-in-schema.ts         # useMemo: Yup object with email (required, valid format) + password (min 8)
    use-sign-up-schema.ts         # useMemo: extends useSignInSchema via .shape() — adds firstName, lastName, username (required), gender, birthdate, full 5-rule password, confirmPassword
    index.ts                      # Barrel export for hooks
  auth-client.ts                  # Better Auth React client — exports authClient, signIn, signUp, signOut, useSession
  types.ts                        # SignUpFormValues, SignInFormValues
  utils.ts                        # getAvatarFallback — derives avatar initials from name, lastName, username
  index.ts                        # Barrel export: all components + authClient, signIn, signUp, signOut, useSession
```

## Types

| Type | Shape |
|---|---|
| `SignUpFormValues` | `{ firstName: string; lastName: string; username: string; email: string; password: string; confirmPassword: string; gender: "" \| "male" \| "female"; birthdate: string }` |
| `SignInFormValues` | `{ identifier: string; password: string }` |
| `AvatarFallbackInput` | `{ name?: string \| null; lastName?: string \| null; username?: string \| null }` — input to `getAvatarFallback` in `utils.ts` |

`ForgotPasswordForm` and `ResetPasswordForm` each define their own local form-value types inline (not exported).

## Key patterns

- **`AuthStatus` avatar fallback** — computed via `getAvatarFallback` from `utils.ts`, wrapped in `useMemo` keyed on `session?.user`. Priority order: (1) first letter of `name` + first letter of `lastName` uppercased (e.g. `"JD"`), (2) first letter of `name`, (3) first letter of `username`, (4) `"?"`. Dropdown label shows `@username` in the first row and `"First Last"` in muted smaller text in the second row; each row only renders if the relevant fields are present. The `useMemo` is placed before the early-return guard so the hook call order is stable regardless of session state.
- **`AuthStatus` dropdown wiring** — uses `<DropdownMenuItem asChild>` so Radix's close handler and `SignOutButton`'s own `onClick` both fire on click with no nested `<button>` in the DOM.
- **`GoogleSignInButton`** — uses `useMutation` (not `isSubmitting` from a parent form) because the social flow is a redirect, not a form submission. On error (unusual for redirect-based OAuth) the i18n message is shown inline below the button.
- **`SignInForm` identifier detection** — the form has a single `identifier` field. On submit it checks whether the value contains `@`; if so it calls `signIn.email()`, otherwise `signIn.username()`.
- **`SignInForm` "Forgot password?" link** — rendered inline inside the password label row (`flex items-center justify-between`) so it sits at the same level as the label.
- **`EmailPasswordFields`** — generic over `T extends FieldValues` so it accepts `register` from either `SignInForm` (2-field schema) or `SignUpForm` (8-field schema) without type errors. `showRequired` prop toggles asterisk rendering; only `email` and `password` error shapes are typed via a local `FieldErrors` type.
- **`PasswordWithConfirmFields`** — consumes `FormContext` (must be inside a `<FormProvider>`). Renders `EmailPasswordFields` (with `showRequired`) then a confirm-password `PasswordInput`. Watches both `password` and `confirmPassword` via `useWatch` to derive `passwordsMatch`; passes it as `isMatch` to show the green check icon.
- **`PasswordPolicyChecklist`** — also consumes `FormContext` and watches `password`. Uses `useFormContext<SignUpFormValues>()` — coupled to the sign-up form; do not drop into other forms unless the context has a `password` field.
- **`useSignInSchema` / `useSignUpSchema`** — Yup schemas live in hooks so they can be composed. `useSignUpSchema` calls `useSignInSchema()` and extends it with `.shape(...)`, overriding `password` to add the five policy rules. Both are `useMemo`-wrapped keyed on `t` (and `signInSchema` for `useSignUpSchema`).
- **`VerifyEmailView` resend** — `SignUpForm` appends `?email=<encoded>` when redirecting to `ROUTES.VERIFY_EMAIL`. `VerifyEmailView` reads this param via `useSearchParams` (requires `<Suspense>` in the page). A 300-second countdown is tracked in `useState` + `setInterval` via `useEffect`, started in the mutation's `onSuccess` callback.
- **`ForgotPasswordForm` success state** — after a successful `authClient.requestPasswordReset()` call, `isSuccess` from `useMutation` causes the component to render a success card in place of the form. It never navigates away, intentionally avoiding disclosure of whether the email exists.
- **`ResetPasswordForm`** — reads `?token=` via `useSearchParams` (requires `<Suspense>` in the page). If the token is absent it immediately renders an error card with a link to `ROUTES.FORGOT_PASSWORD`. On success, `router.push(ROUTES.SIGN_IN)` is called in the `onSuccess` callback of `useMutation`.
- **`SignOutButton`** — imports `useRouter` from `next/navigation` (not the locale-aware wrapper) because sign-out needs a hard server cache bust rather than a locale-preserving push.
- **Auth client** — `auth-client.ts` wraps `createAuthClient` from `better-auth/react` with `inferAdditionalFields<typeof auth>()` (syncs `lastName`, `gender`, `birthdate`, `username` to the client type) and `usernameClient()`. Never import from `better-auth` directly in components.
- **Server-side session** — use `auth.api.getSession({ headers: await headers() })` from the server auth config. Never import `useSession` in server components.
- **Route layout** — auth pages live under `app/[lng]/(auth)/` with a bare centred layout; they do **not** inherit `<Header>` / `<Footer>`. Pages using `useSearchParams` (`VerifyEmailView`, `ResetPasswordForm`) must be wrapped in `<Suspense>` in their page file.

## How to extend

### Adding a new field to sign-up (e.g. phone number)

1. Add the field to `SignUpFormValues` in `types.ts`.
2. Add the Yup rule to `hooks/use-sign-up-schema.ts` via `.shape({ phone: yup.string()... })`.
3. Add the matching `<Label>` + `<Input>` block inside `SignUpForm.tsx` (inline, like the existing `username` field — only email/password belong in `EmailPasswordFields`).
4. Pass the new field to `signUp.email({ ..., phone: values.phone })` — Better Auth forwards extra fields to the `user` table if the column exists.
5. Add the column to the `User` model in `backend/prisma/schema.prisma` and run `npx prisma db push && npx prisma generate`.
6. Register the field as an `additionalField` in `backend/features/auth/auth.ts`.

### Adding another social provider (e.g. GitHub)

1. Add the provider to `socialProviders` in `backend/features/auth/auth.ts` with its `clientId` and `clientSecret` env vars.
2. Add the provider to `account.accountLinking.trustedProviders` in `auth.ts` so existing email accounts are merged automatically.
3. Register the callback URL `<BETTER_AUTH_URL>/api/auth/callback/github` in the GitHub OAuth app settings.
4. Create a button component following the same `useMutation` + `signIn.social({ provider: "github" })` pattern as `GoogleSignInButton`.
5. Add the button to `SignInForm` and `SignUpForm` below the existing `<GoogleSignInButton />`.
6. Export the new component from `components/index.ts`.

### Adding a new action to the AuthStatus dropdown

1. Create the action component (or reuse an existing one).
2. Add a `<DropdownMenuSeparator />` and `<DropdownMenuItem asChild>` wrapping your component inside the `<DropdownMenuContent>` in `AuthStatus.tsx`.

### Adding a field shared by both sign-in and sign-up (e.g. captcha token)

1. Add the field to `hooks/use-sign-in-schema.ts` — `useSignUpSchema` inherits it automatically via `.shape()`.
2. Add the matching `<Label>` + `<Input>` block to `EmailPasswordFields.tsx` and update its local `FieldErrors` type.
