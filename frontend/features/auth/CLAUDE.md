# auth feature

Authentication UI for the storefront: sign-up, sign-in (email/password and Google OAuth), email verification, forgot password, and password reset. Exposes the Better Auth React client (`authClient`) used by the rest of the app for session access and admin operations.

## Structure

```
auth/
  components/
    AuthStatus.tsx                # Header widget: SignInButton when logged out; Avatar + DropdownMenu when logged in
    ForgotPasswordForm.tsx        # Card form: email → authClient.requestPasswordReset(); replaces itself with success card on submit
    GoogleSignInButton.tsx        # Outline button; calls signIn.social({ provider: "google" }) via useMutation; shows inline error
    PasswordConfirmFields.tsx     # Shared password + confirm pair via useFormContext; useWatch drives isMatch; props: showRequired, autoComplete
    PasswordInput.tsx             # Input with show/hide Eye toggle; optional isMatch prop overlays green Check icon
    PasswordPolicyChecklist.tsx   # Reads "password" from FormContext; renders 5 PolicyItem rows
    PasswordWithConfirmFields.tsx # Inline email field + PasswordConfirmFields (showRequired); sign-up's email/password/confirm block
    PolicyItem.tsx                # Single policy row: green Check or muted X + label; driven by a boolean met prop
    ResetPasswordForm.tsx         # Reads ?token= from URL; FormProvider + PasswordConfirmFields; calls authClient.resetPassword()
    SignInButton.tsx              # Outline button in the site header; navigates to ROUTES.SIGN_IN via locale-aware Link
    SignInForm.tsx                # Card form: identifier + password + "Forgot password?" + GoogleSignInButton
    SignOutButton.tsx             # Outline button; calls signOut() then router.refresh() (next/navigation, not locale-aware)
    SignUpForm.tsx                # Card form: firstName, lastName, username, gender (Select), birthdate (DateInput, masked DD/MM/YYYY + calendar popover) + PasswordWithConfirmFields + PasswordPolicyChecklist + GoogleSignInButton; wrapped in FormProvider
    VerifyEmailView.tsx           # Info card shown after sign-up; resend button with 300 s countdown driven by setInterval
    index.ts                      # Barrel export for all components (including internal ones)
  hooks/
    use-forgot-password-schema.ts # Yup: email (required, valid format)
    use-reset-password-schema.ts  # Yup: password (5 policy rules) + confirmPassword (must match)
    use-sign-in-schema.ts         # Yup: email + password (min 8) — used as base by useSignUpSchema
    use-sign-up-schema.ts         # Yup: extends useSignInSchema via .shape(); adds firstName, lastName, username (required), gender, birthdate (optional, must be a valid DD/MM/YYYY date), full 5-rule password, confirmPassword
    index.ts                      # Barrel export for hooks (hooks are not re-exported from the feature barrel)
  auth-client.ts                  # Better Auth React client: authClient, signIn, signUp, signOut, useSession
  types.ts                        # SignUpFormValues, SignInFormValues
  utils.ts                        # getAvatarFallback — derives avatar initials
  index.ts                        # Barrel: components (public subset) + authClient, signIn, signUp, signOut, useSession
```

## Types

| Type | Shape |
|---|---|
| `SignUpFormValues` | `{ firstName: string; lastName: string; username: string; email: string; password: string; confirmPassword: string; gender: "" \| "male" \| "female"; birthdate: string }` — `birthdate` holds the masked display string `DD/MM/YYYY` (converted to ISO on submit) |
| `SignInFormValues` | `{ identifier: string; password: string }` |

`ForgotPasswordForm` and `ResetPasswordForm` define their own form-value types inline (not exported).

## Feature barrel (`index.ts`) exports

Public exports from `index.ts`:

- **Components**: `AuthStatus`, `ForgotPasswordForm`, `ResetPasswordForm`, `SignInButton`, `SignInForm`, `SignOutButton`, `SignUpForm`, `VerifyEmailView`
- **Auth client**: `authClient`, `signIn`, `signUp`, `signOut`, `useSession`
- **Not exported**: `GoogleSignInButton`, `PasswordConfirmFields`, `PasswordInput`, `PasswordWithConfirmFields`, `PolicyItem` (internal to other auth components), and all schema hooks (import via `hooks/` subpath if needed)

## Key patterns

- **`authClient`** — created via `createAuthClient` with `inferAdditionalFields<typeof auth>()` (syncs `lastName`, `gender`, `birthdate`, `username` to the client type), `usernameClient()`, and `adminClient()`. Import `authClient` from this feature instead of calling `createAuthClient` again anywhere else.
- **`SignInForm` identifier detection** — the form has a single `identifier` field (not `email`). On submit it checks `values.identifier.includes('@')`; if true calls `signIn.email()`, otherwise `signIn.username()`. The inline Yup schema uses `identifier` (required string), not `email`, so `use-sign-in-schema.ts` is not used here.
- **`useSignUpSchema`** — extends `useSignInSchema()` via `.shape()` to override `password` with 5 policy rules and add the extra sign-up fields. `SignUpForm` calls this hook and passes the result to `yupResolver`.
- **`SignUpForm` uses `<FormProvider>`** — wraps the form in `<FormProvider {...methods}>` so `PasswordWithConfirmFields` and `PasswordPolicyChecklist` can call `useFormContext` / `useWatch` without prop drilling.
- **`SignUpForm` birthdate via `DateInput`** — wired with a `Controller` to the shared `DateInput` (`@/frontend/components/DateInput`): a digits-only input masked as `DD/MM/YYYY` whose focus/click opens a shadcn `Calendar` popover. Form state holds the masked display string; `onSubmit` converts it with `displayDateToIso()` so Better Auth / Prisma keep receiving ISO `YYYY-MM-DD` (`undefined` when empty). `useSignUpSchema` validates the format with `isValidDisplayDate` (`validation.birthdateInvalid`), accepting empty as valid.
- **`PasswordConfirmFields`** — the shared password + confirm pair, used by both `PasswordWithConfirmFields` (sign-up) and `ResetPasswordForm`. Calls `useFormContext` typed to `{ password; confirmPassword }`, so it works inside any `<FormProvider>` whose form values include those two fields. `useWatch` on both fields drives the `isMatch` green-check on the confirm `PasswordInput`. Props: `showRequired` adds `*` to both labels (sign-up), `autoComplete` is forwarded to both inputs (`"new-password"` in reset).
- **`PasswordWithConfirmFields`** — sign-up's email/password/confirm block: an inline email field (typed to `SignUpFormValues`) followed by `<PasswordConfirmFields showRequired />`. Must be inside a `<FormProvider>`.
- **`PasswordPolicyChecklist`** — uses `useFormContext<SignUpFormValues>()` and `useWatch` on `password` to drive 5 `PolicyItem` rows. Coupled to a form that has a `password` field; do not reuse in forms without it.
- **`AuthStatus` avatar fallback** — `getAvatarFallback` priority: (1) `name[0] + lastName[0]` uppercased, (2) `name[0]`, (3) `username[0]`, (4) `"?"`. The `useMemo` is placed before the early-return guard so the hook call order is stable.
- **`AuthStatus` dropdown** — `<DropdownMenuItem asChild>` wraps `<SignOutButton>` so Radix's close handler and the button's own `onClick` both fire without nesting `<button>` inside `<button>`.
- **`SignOutButton`** — imports `useRouter` from `next/navigation` (not the locale-aware wrapper) because sign-out needs a hard server cache bust via `router.refresh()`.
- **`GoogleSignInButton`** — uses `useMutation` (not a parent form's `isSubmitting`) because the social flow is a redirect, not a form submission.
- **`VerifyEmailView` countdown** — `SignUpForm` appends `?email=<encoded>` when redirecting. `VerifyEmailView` reads this via `useSearchParams` (requires `<Suspense>` in the page). A 300 s countdown runs via `useState` + `setInterval` in a `useEffect`, started in the mutation's `onSuccess`.
- **`ForgotPasswordForm` no-disclosure** — on success it renders a success card in place of the form, never navigates away. Intentionally avoids disclosing whether the email exists.
- **`ResetPasswordForm` token guard** — reads `?token=` via `useSearchParams`. If absent, renders an error card with a link to `ROUTES.FORGOT_PASSWORD` immediately. On success calls `router.push(ROUTES.SIGN_IN)` in `onSuccess`. The form is wrapped in `<FormProvider {...methods}>` solely so `PasswordConfirmFields` can read the form context.
- **Server-side session** — use `auth.api.getSession({ headers: req.headers })` from the backend auth config. Never import `useSession` in server components.
- **Auth pages layout** — auth pages live under `app/[lng]/(auth)/` with a bare centred layout; they do not inherit `<Header>` / `<Footer>`. Pages that use `useSearchParams` (`VerifyEmailView`, `ResetPasswordForm`) must be wrapped in `<Suspense>` in their page file.

## How to extend

### Adding a new field to sign-up (e.g. phone)

1. Add the field to `SignUpFormValues` in `types.ts`.
2. Add the Yup rule to `hooks/use-sign-up-schema.ts` inside `.shape({ phone: yup.string()... })`.
3. Add the `<Label>` + `<Input>` block inside `SignUpForm.tsx` (inline, like `username`).
4. Pass the field to `signUp.email({ ..., phone: values.phone })`.
5. Add the column to `User` in `backend/prisma/schema.prisma`, run `npx prisma db push && npx prisma generate`.
6. Register the field as `additionalFields` in `backend/features/auth/auth.ts`.

### Adding another social provider (e.g. GitHub)

1. Configure the provider in `backend/features/auth/auth.ts` (see backend auth CLAUDE.md).
2. Create a button component following the same `useMutation` + `signIn.social({ provider: "github" })` pattern as `GoogleSignInButton`.
3. Add the button to `SignInForm` and `SignUpForm` below the existing `<GoogleSignInButton />`.
4. Export the new component from `components/index.ts`.

### Adding an action to the AuthStatus dropdown

1. Create the action component (or reuse an existing one).
2. Add a `<DropdownMenuSeparator />` and `<DropdownMenuItem asChild>` wrapping your component inside `<DropdownMenuContent>` in `AuthStatus.tsx`.
