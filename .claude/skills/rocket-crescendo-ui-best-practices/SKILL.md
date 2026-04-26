---
name: rocket-crescendo-ui-best-practices
description: Best practices for the UI side of the rocket-crescendo Next.js project. Use when creating or editing components, hooks, forms, API hooks, shared components, or any frontend code in frontend/features/ or frontend/components/. Covers file naming, directives, exports, data fetching, forms, i18n, Tailwind, and the typed API client.
---

# Rocket Crescendo — UI Best Practices

Complete reference for writing frontend code in `frontend/`. Full code templates: [references/templates.md](references/templates.md).

---

## File naming & locations

| What | Path | Name style |
|---|---|---|
| Component | `frontend/features/<feature>/components/<Name>.tsx` | `PascalCase.tsx` |
| Hook | `frontend/features/<feature>/hooks/use-<name>.ts` | `use-kebab-case.ts` |
| Schema hook | `frontend/features/<feature>/hooks/use-<name>-schema.ts` | `use-kebab-case-schema.ts` |
| Types | `frontend/features/<feature>/types.ts` | `types.ts` |
| Constants | `frontend/features/<feature>/constants.ts` | `constants.ts` |
| Feature barrel | `frontend/features/<feature>/index.ts` | `index.ts` |
| Components barrel | `frontend/features/<feature>/components/index.ts` | `index.ts` |
| Hooks barrel | `frontend/features/<feature>/hooks/index.ts` | `index.ts` |
| Shared component | `frontend/components/<Name>.tsx` | `PascalCase.tsx` |
| shadcn component | `frontend/components/ui/<name>.tsx` | `kebab-case.tsx` |

---

## Component rules

- Add `'use client'` only when the component uses hooks, event handlers, or browser APIs. Omit for pure server components.
- Named export only — `export const <Name>: FC<Props> = ...` or `export const <Name> = (...) => ...`. Never `export default`.
- Props: declare a `interface <Name>Props` in the same file above the component for complex shapes; inline `{ prop }: { prop: string }` only for single-prop trivial cases.
- Type props with `FC<Props>` when the component is a presentational leaf; omit `FC` when the function has generics or complex return types.
- `ReactNode` for slot props (e.g. `navItems?: ReactNode`).
- `useCallback` for all event handlers that are passed as props to avoid re-renders.
- `useCallback` on modal close/success handlers passed down to child hooks.

---

## Directive placement

```tsx
'use client';            // ← top of file, before all imports, only when needed

import { FC } from 'react';
import { useTranslations } from 'next-intl';
```

Hooks files always have `'use client'` at the top because they use React hooks.

---

## Barrel / export rules

**`components/index.ts`** — one named re-export per component:
```ts
export { CategoryBadge } from './CategoryBadge';
export { CreateCategoryForm } from './CreateCategoryForm';
```

**`hooks/index.ts`** — one named re-export per hook:
```ts
export { useCategories } from './use-categories';
export { useCreateCategory } from './use-create-category';
```

**`index.ts` (feature root)** — export only what external consumers need (not every internal file):
```ts
export { CategoriesList, CategoryBadge, CreateCategoryForm } from './components';
export type { CategoryFormValues } from './types';
```

- Use `export type` for TypeScript-only re-exports.
- Import cross-feature items from the feature barrel (`@/frontend/features/categories`), not direct file paths.

---

## Path aliases

Always use `@/` prefix. Never use relative paths crossing feature boundaries.

| Prefix | Resolves to |
|---|---|
| `@/frontend/features/<feature>` | feature barrel `index.ts` |
| `@/frontend/components/ui/<name>` | shadcn component |
| `@/frontend/components/<Name>` | shared non-shadcn component |
| `@/frontend/lib/utils` | `cn()` helper |
| `@/backend/features/<feature>` | backend feature barrel |
| `@/frontend/constants` | `ROUTES` and other app-level constants |

Within a feature, use relative imports (`../types`, `./use-categories`, `../hooks`).

---

## i18n rules

- Client components: `const t = useTranslations('namespace')` from `next-intl`.
- Multiple namespaces: declare separate `const t = useTranslations('common')` and `const tCategory = useTranslations('category')`.
- Navigation: always use locale-aware helpers from `@/frontend/features/translation/i18n/navigation` — `Link`, `useRouter`, `usePathname`, `redirect`. Never `next/navigation` directly.
- Route constants: define in `frontend/constants.ts` as `ROUTES.XYZ`. Never hard-code path strings.
- Display translated entity name: `usePickTranslation(entity.translations)` from `@/frontend/features/translation` — never `translations[0]`.
- When adding a key: add to **all three** message files (`en.json`, `fr.json`, `ru.json`) under the same namespace.

---

## shadcn/ui rules

- Import from `@/frontend/components/ui/<name>`.
- Use compound component patterns: `<Tabs>` + `<TabsList>` + `<TabsTrigger>` + `<TabsContent>`.
- Use `asChild` to merge rendering with a child element (avoids nested `<button><button>`).
- Icons from `lucide-react` with explicit size: `size={16}`, `size={20}`, or Tailwind `h-5 w-5`.

---

## Tailwind rules

- Semantic tokens only — never raw colors like `text-gray-500`:
  - Backgrounds: `bg-background`, `bg-muted`, `bg-card`
  - Text: `text-foreground`, `text-muted-foreground`, `text-destructive`, `text-card-foreground`
  - Borders: `border-border`
  - Interactive: `hover:bg-muted`, `transition-colors`
- Responsive prefixes: `hidden md:flex`, `md:hidden`, `sm:grid-cols-2 lg:grid-cols-3`.
- Glass/sticky header: `backdrop-blur bg-background/95`.
- Use `cn()` from `@/frontend/lib/utils` to merge conditional classes.

---

## Data fetching — TanStack Query

### Query hook pattern

```ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/frontend/features/api';
import { CATEGORIES_QUERY_KEY } from '../constants';

export function useCategories(query?: CategoryFilter) {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, query],
    queryFn: () => api.getCategories({ query }),
  });
}
```

- Return the raw `useQuery` result — let the consumer destructure `data`, `isPending`, `isError`.
- Include filter/params in `queryKey` so the cache is keyed correctly.
- Query key constants live in `constants.ts` (`CATEGORIES_QUERY_KEY = 'categories'`).

### Mutation hook pattern

```ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/frontend/features/api';
import { CATEGORIES_QUERY_KEY } from '../constants';

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (options: { params: { id: string } }) => api.deleteCategory(options),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] }),
  });
}
```

- Invalidate by root query key (e.g. `[CATEGORIES_QUERY_KEY]`) to refresh all related queries.
- Create mutations that redirect after success: call `router.push(ROUTES.X)` inside `onSuccess`.
- Edit/delete mutations that close a modal: accept an `onSuccess?: () => void` param in the **form hook**, not the mutation hook.

### Cache-only reads (`useCacheQuery`)

When a parent list pre-fetches related data (e.g. categories for a product list), child cards read from cache without re-fetching:

```ts
import { useCacheQuery } from '@/frontend/features/react-query';
const { data: category } = useCacheQuery<CategoryWithTranslations>({
  queryKey: [CATEGORIES_BY_IDS, categoryId],
});
```

### Paginated queries (`useOffsetPagination`)

```ts
import { useOffsetPagination } from '@/frontend/features/react-query';

const { items, fetchNextPage, queryProps } = useOffsetPagination({
  queryKey: [FILES_QUERY_KEY, filter],
  queryFn: (offset) => api.getFiles({ query: { ...filter, offset } }),
});
// queryProps.isPending, queryProps.hasNextPage, queryProps.isFetchingNextPage
```

- Use for any endpoint returning `PaginatedItems<T>` (`{ items, total, offset, limit }`).
- `fetchNextPage` is pre-guarded — bind directly to a button `onClick`.

---

## Forms — react-hook-form + Yup

### Separation of concerns

| File | Responsibility |
|---|---|
| `use-<resource>-schema.ts` | Yup schema wrapped in `useMemo` — shared by create and edit hooks |
| `use-create-<resource>-form.ts` | `useForm` + schema + mutation + `onSubmit`; returns form state |
| `use-edit-<resource>-form.ts` | Same, but accepts the existing entity for `defaultValues` |
| `<Resource>FormFields.tsx` | Shared form UI; receives all form state as props |
| `Create<Resource>Form.tsx` | Thin wrapper: calls form hook, renders `<Resource>FormFields` |
| `Edit<Resource>Modal.tsx` | Thin wrapper: controls modal state, calls edit form hook, renders `<Resource>FormFields` |

### Schema hook

```ts
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

export function useCategoryFormSchema() {
  const t = useTranslations('common');
  const tCategory = useTranslations('category');

  return useMemo(
    () => yup.object({
      color: yup.string().required(tCategory('colorRequired')).min(1, tCategory('colorRequired')),
      translations: yup.array(yup.object({
        language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
        name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
      })).required(),
    }),
    [t, tCategory],
  );
}
```

- Extract into a standalone `use-<resource>-schema.ts` hook when the schema is shared by create and edit (see products pattern). Inline in the form hook only when the schema is used in one place.
- Always wrap in `useMemo` keyed on `t` / `tNamespace`.
- All error messages come from translation keys — never hard-coded strings.

### Form hook

```ts
export function useCreateCategoryForm() {
  const schema = useCategoryFormSchema();       // or inline schema if not shared

  const defaultValues: CategoryFormValues = { color: '', translations: supportedLngs.map(lng => ({ language: lng, name: '' })) };

  const form = useForm<CategoryFormValues>({ defaultValues, resolver: yupResolver(schema) });
  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreateCategory();

  const onSubmit = handleSubmit((body) => {
    mutate({ body }, { onSuccess: () => reset() });
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
```

- Return exactly what the component needs — no raw `form` object.
- `reset()` on create success; edit success calls the `onSuccess` callback instead.

### Edit form hook — defaultValues from entity

```ts
export function useEditCategoryForm(category: CategoryWithTranslations, onSuccess?: () => void) {
  const defaultValues: CategoryFormValues = {
    color: category.color,
    translations: supportedLngs.map((lng) => {
      const existing = category.translations.find((tr) => tr.language === lng);
      return { language: lng, name: existing?.name ?? '' };
    }),
  };
  // ...same shape as create form hook...
  const onSubmit = handleSubmit((body) => {
    mutate({ params: { id: category.id }, body }, { onSuccess });
  });
}
```

- Pre-fill `defaultValues` directly — never use `useEffect` + `reset()` to populate.
- Edit hooks that close a modal: accept `onSuccess?: () => void` and call it in the mutation callback.

### Controller fields (non-input UI)

```tsx
<Controller
  name="color"
  control={control}
  render={({ field }) => (
    <ColorPicker value={field.value} onChange={field.onChange} errorMessage={errors.color?.message} />
  )}
/>
```

Use `Controller` for `ColorPicker`, `CategorySelector`, `Checkbox`, `Select`, and any non-native input.

### Shared FormFields component

When a form is used in both a create page and an edit modal, extract the form UI into a `<Resource>FormFields` component:

```tsx
interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryFormValues>;
  control: Control<CategoryFormValues>;
  fields: FieldItem[];
  errors: FieldErrors<CategoryFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
}
```

The wrapper components (`CreateCategoryForm`, `EditCategoryModal`) inject all values via props and control text labels via translation keys.

---

## Modal pattern

Use the shared `Modal` component at `@/frontend/components/Modal`:

```tsx
import { Modal } from '@/frontend/components/Modal';

const [open, setOpen] = useState(false);
const handleSuccess = useCallback(() => setOpen(false), []);

<Modal
  open={open}
  onOpenChange={setOpen}
  title={t('editCategory')}
  contentClassName="max-w-lg"
  trigger={
    <Button variant="ghost" size="icon" className="size-7" disabled={disabled}>
      <Pencil className="text-muted-foreground" size={16} />
    </Button>
  }
>
  <FormContent ... />
</Modal>
```

- `trigger` is rendered as `DialogTrigger asChild` — pass any `Button` or element.
- Control open state externally (`open` + `onOpenChange`) when the form needs to close itself on success.
- Uncontrolled (no `open`/`onOpenChange`) for simple informational dialogs.
- `contentClassName` for max-width overrides (e.g. `max-w-lg`, `max-w-[min(90vw,1200px)]`).

---

## Typed API client

All HTTP calls go through the `api` object from `@/frontend/features/api`. Never call `fetch` directly in components or hooks.

```ts
import { api } from '@/frontend/features/api';

// In a mutation hook:
mutationFn: (options: { params: { id: string }; body: CategoryUpdateInput }) => api.updateCategory(options)

// In a query hook:
queryFn: () => api.getCategories({ query: filter })
```

- `FormData` bodies: pass `FormData` as `body` — `executeRequest` detects it and skips JSON serialisation and `Content-Type`, letting the browser set the multipart boundary.
- Adding a new resource: create `frontend/features/api/<resource>.ts` following the `products.ts` pattern, then spread `*ApiTypes` and `*_REQUEST_MAP` into `index.ts`.

---

## Translation tabs (multi-language forms)

```tsx
<Tabs defaultValue={fields[0]?.language}>
  <TabsList className="w-full">
    {fields.map((field, index) => (
      <TranslationTabTrigger
        key={field.id}
        language={field.language as SUPPORTED_LANGUAGE}
        hasError={!!errors.translations?.[index]?.name}
      />
    ))}
  </TabsList>
  {fields.map((field, index) => (
    <ResourceTranslationTabContent
      key={field.id}
      lng={field.language as SUPPORTED_LANGUAGE}
      index={index}
      errors={errors}
      register={register}
    />
  ))}
</Tabs>
```

- `useFieldArray({ control, name: 'translations' })` drives the tabs.
- `TranslationTabTrigger` (from `@/frontend/features/translation/components`) shows an error indicator when `hasError` is true.
- One `<Resource>TranslationTabContent` component per feature that renders language-specific fields inside `<TabsContent value={lng}>`.

---

## Server-side vs. client-side

- Default to **server components** (no `'use client'` directive). Use for static layout, metadata, and data passed as props from the page.
- Add `'use client'` only for: hooks (`useState`, `useEffect`, `useQuery`, etc.), event handlers, `useTranslations`, `useRouter`, `usePathname`.
- Server components pass `params.lng` down as a prop when language-specific server logic is needed (e.g. `generateMetadata`).
- Never import `useSession` or other client hooks in server components. Use `auth.api.getSession({ headers: await headers() })` for server-side session access.

---

## Slot-based composition

Prefer slot props (`ReactNode`) over coupling components to specific features:

```tsx
// Header accepts slots — doesn't know about NavMenu or CartButton
<Header
  navItems={<NavMenu />}
  rightActions={<><AuthStatus /><CartButton /></>}
/>
```

This keeps the header reusable across layouts with different nav content.

---

## Shared components (`frontend/components/`)

| Component | Path | Use for |
|---|---|---|
| `Modal` | `@/frontend/components/Modal` | Any dialog wrapping a `Dialog` |
| `FormInputField` | `@/frontend/components/FormInputField` | Labeled text input with error display |
| `FormTextAreaField` | `@/frontend/components/FormTextAreaField` | Labeled textarea with error display |
| `ColorPicker` | `@/frontend/components/ColorPicker` | Color selection (controlled via `Controller`) |

Use `FormInputField` / `FormTextAreaField` inside `TranslationTabContent` components — they accept `registration={register('field.name')}` and `errorMessage`.

---

## Constants patterns

```ts
// Query key (string constant)
export const CATEGORIES_QUERY_KEY = 'categories';

// Typed tuple
export const ITEMS = ['a', 'b', 'c'] as const;
export const LABELS: Record<(typeof ITEMS)[number], string> = {
  a: 'Alpha', b: 'Beta', c: 'Gamma',
};

// Numeric cap
export const MAX_ADDITIONAL_IMAGES = 8;
```

- Query keys are plain strings in `constants.ts` — not Symbols or enums.
- Use `as const` on arrays used as union types.

---

## Types patterns

```ts
// Feature-local form value types live in types.ts
export type CategoryTranslationField = {
  language: SUPPORTED_LANGUAGE;
  name: string;
};

export type CategoryFormValues = {
  color: string;
  translations: CategoryTranslationField[];
};
```

- Backend entity types (`CategoryWithTranslations`, `FileModel`) come from `@/backend/features/<feature>` — never duplicate them in the frontend.
- Import Prisma-generated enums from `@/backend/app/generated/prisma/enums` when needed client-side (avoids pulling the full Prisma client bundle).

---

See [references/templates.md](references/templates.md) for complete copy-paste templates.
