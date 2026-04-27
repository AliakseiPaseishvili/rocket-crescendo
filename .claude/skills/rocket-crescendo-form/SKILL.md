---
name: rocket-crescendo-form
description: Adds a form to an existing feature in the rocket-crescendo Next.js project. Use when the user asks to add a create form, edit form, or any react-hook-form + Yup form to a feature. Covers schema hooks, form hooks, FormValues types, form field components, and i18n wiring following all project conventions.
---

# Rocket Crescendo — Form Skill

Conventions for adding forms inside `frontend/features/<feature>/`. Full templates: see [references/templates.md](references/templates.md).

## Decision tree before writing any file

```
Does another form exist in this feature already?
├── Yes → Share the schema in use-<entity>-form-schema.ts (see "Shared schema" below)
└── No  → Is this an auth-style form (calls 3rd-party client, not TanStack mutation)?
           ├── Yes → Self-contained form component, no separate FormFields (see "Auth exception")
           └── No  → Standard pattern: schema hook → form hook → FormFields component → Form wrapper
```

---

## Standard pattern

### 1. `FormValues` type

| Situation | Where to put it |
|---|---|
| Shared by create and edit | `frontend/features/<feature>/types.ts` |
| Only one form in the feature | Inline `type FormValues = {...}` inside the form component |

Never use `any`. Use `unknown`, proper generics, or narrowed types.

### 2. Schema hook

File: `frontend/features/<feature>/hooks/use-<entity>-form-schema.ts`

- `'use client'` directive required (calls `useTranslations`).
- Call `useTranslations` for each i18n namespace needed.
- Wrap `yup.object({...})` in `useMemo` keyed on all `t` values.
- All validation error messages come from translation keys — never hardcode strings.
- Return the schema directly (not wrapped in an object).

**When to extract vs. inline:**
- Extract to a dedicated `use-<entity>-form-schema.ts` when both create and edit share the schema (products pattern).
- Inline inside the form hook with `useMemo` when only one form uses it (categories, files pattern).
- Compose schemas via `.shape()` when one extends another (sign-up extends sign-in).

### 3. Form hook

File: `frontend/features/<feature>/hooks/use-<action>-<entity>-form.ts`

- `'use client'` directive required.
- Call `useProductFormSchema()` (or inline `useMemo` schema) to get the schema.
- Declare `defaultValues` typed as `FormValues`.
  - Create forms: empty/zero defaults; call `reset()` in the mutation's `onSuccess`.
  - Edit forms: derive defaults from the entity argument; no `reset()` needed.
- `useForm<FormValues>({ defaultValues, resolver: yupResolver(schema) })`.
- `onSubmit = handleSubmit((body) => mutate({ body }, { onSuccess: ... }))`.
- For edit: signature is `useEditEntityForm(entity: EntityType, onSuccess?: () => void)`.
- Return exactly: `{ register, control, fields?, errors, onSubmit, isPending, isSuccess, error, ...fieldArrayHelpers }`.

**`useFieldArray` (multilingual translations):**
- Call inside the form hook: `const { fields } = useFieldArray({ control, name: 'translations' })`.
- `defaultValues.translations` must be pre-populated for all supported languages:
  ```ts
  import { supportedLngs } from '@/frontend/features/translation';
  translations: supportedLngs.map((lng) => ({ language: lng, name: '', ... }))
  ```
- Return `fields` from the hook; pass to `FormFields` component.

**Shared `useFieldArray` logic (advanced):**
- If both create and edit need field-array helpers (e.g. add/remove additional images), extract to `use-<name>-field.ts` and call it from both form hooks.

### 4. `<Entity>FormFields` component

File: `frontend/features/<feature>/components/<Entity>FormFields.tsx`

- `'use client'` directive.
- Accept all form state as props: `register`, `control`, `fields?`, `errors`, `onSubmit`, `isPending`, `isSuccess`, `error`, plus i18n labels: `submitLabel`, `pendingLabel`, `successMessage`.
- Render `<form onSubmit={onSubmit} className="flex flex-col gap-4">`.
- Simple text/email/password inputs: `{...register('fieldName')}` spread directly onto `<Input>`.
- Complex/controlled inputs (checkboxes, selects, color pickers, file pickers): wrap in `<Controller name="..." control={control} render={({ field }) => ...} />`.
- Error display pattern (per field):
  ```tsx
  {errors.fieldName && <p className="text-sm text-destructive">{errors.fieldName.message}</p>}
  ```
- Mutation error (server error):
  ```tsx
  {error && <p className="text-sm text-destructive">{error.message}</p>}
  ```
- Success message:
  ```tsx
  {isSuccess && <p className="text-sm text-green-600">{successMessage}</p>}
  ```
- Submit button:
  ```tsx
  <Button type="submit" disabled={isPending}>
    {isPending ? pendingLabel : submitLabel}
  </Button>
  ```
- **Do not** put mutation logic, schema, or `useForm` here — FormFields is pure presentation.

**Translation tabs (multilingual entity):**
```tsx
<Tabs defaultValue={fields[0]?.language}>
  <TabsList className="w-full">
    {fields.map((field, index) => (
      <TranslationTabTrigger
        language={field.language as never}
        key={field.id}
        hasError={!!errors.translations?.[index]?.name}
      />
    ))}
  </TabsList>
  {fields.map((field, index) => (
    <YourTranslationTabContent key={field.id} lng={field.language as never} index={index} errors={errors} register={register} />
  ))}
</Tabs>
```
Import `TranslationTabTrigger` from `@/frontend/features/translation/components`.

### 5. Create and Edit form wrapper components

- `Create<Entity>Form.tsx` — calls `use<Create><Entity>Form()`, renders `<Entity>FormFields` with all props.
- `Edit<Entity>Form.tsx` / `Edit<Entity>Modal.tsx` — receives entity as prop, calls `useEdit<Entity>Form(entity, onSuccess)`, renders `<Entity>FormFields`.
- Edit in a modal: use the shared `Modal` component at `@/frontend/components/Modal` with controlled `open` state.
- Edit in a full page: render a two-column grid layout directly; split into `EditEntityForm` (data fetch) + `EditEntityFormContent` (receives entity, owns hook). The split is required because `useEditEntityForm` needs the entity for `defaultValues` and hooks cannot be called conditionally.

---

## Auth exception (no TanStack mutation)

Auth forms call `signIn.email()` / `signUp.email()` from the Better Auth client directly. They do **not** follow the standard FormFields-component pattern.

Rules specific to auth forms:
- Self-contained single file: owns its own `useForm`, renders the `<form>` directly, no separate `FormFields` component.
- `'use client'` directive.
- Server error is stored in `const [serverError, setServerError] = useState<string | null>(null)`.
- `onSubmit` is an `async` function (not `handleSubmit` only): calls `setServerError(null)` first, then `await auth.method(...)`, checks `error` in the result, sets `serverError` if present.
- Use `formState: { errors, isSubmitting }` (not `isPending` from a mutation hook) for submit-in-progress state.
- Use `FormProvider` only when a child component needs form context (e.g. `PasswordPolicyChecklist`); omit it for simple auth forms.
- Schema extension: `useSignUpSchema` calls `useSignInSchema()` and extends via `.shape({...})` — the sign-up form never defines its own schema from scratch.

---

## i18n rules

- All validation error messages in schema hooks come from `useTranslations`.
- Labels, placeholders, button text, and status messages in components come from `useTranslations`.
- Add keys to **all three** message files: `frontend/features/translation/messages/en.json`, `fr.json`, `ru.json`.
- Namespace conventions: `common` for shared keys (`nameRequired`, `nameMinLength`, `descriptionRequired`…); feature namespace (`product`, `category`, `file`, `auth`) for feature-specific keys.

---

## File checklist for a new standard CRUD form pair

```
frontend/features/<feature>/
  types.ts                            ← Add FormValues (if shared create + edit)
  hooks/
    use-<entity>-form-schema.ts       ← Schema hook (only if shared by create + edit)
    use-create-<entity>-form.ts       ← Create form hook
    use-edit-<entity>-form.ts         ← Edit form hook
    index.ts                          ← Export new hooks
  components/
    <Entity>FormFields.tsx            ← Shared form fields UI
    Create<Entity>Form.tsx            ← Create wrapper
    Edit<Entity>Form.tsx              ← Edit wrapper (or modal variant)
    index.ts                          ← Export new components
  index.ts                            ← Re-export public API
```

For a **single form** (create only, no edit):
- No separate schema hook; inline `useMemo` in the form hook.
- No separate `FormValues` in `types.ts`; inline in the component if edit never shares it.
- No `<Entity>FormFields`; render the `<form>` inside the single form component.

---

## Path aliases

Always use `@/` prefix: `@/frontend/features/`, `@/frontend/components/ui/`, `@/backend/features/`.

See [references/templates.md](references/templates.md) for copy-paste templates.
