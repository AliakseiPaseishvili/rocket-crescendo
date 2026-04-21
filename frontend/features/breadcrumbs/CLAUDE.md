# breadcrumbs feature

Renders accessible breadcrumb navigation using shadcn/ui's `Breadcrumb` primitives and next-intl translations.

## Structure

```
breadcrumbs/
  components/
    Breadcrumbs.tsx   # Client component — renders the breadcrumb trail
    index.ts          # Barrel for components/
  constants.ts        # Pre-built BreadcrumbItem[] arrays per admin route
  types.ts            # BreadcrumbItem type
  index.ts            # Barrel for the feature
```

## Types

```ts
interface BreadcrumbItem {
  labelKey: "admin" | "products" | "categories" | "files" | "create" | "edit";
  href?: string;   // omit for the current (last) item
}
```

## Usage

Pass a `BreadcrumbItem[]` array to `<Breadcrumbs>`. The last item in the array is rendered as the current page (no link). All other items render as links with a separator.

```tsx
import { Breadcrumbs, BREADCRUMBS_ADMIN_PRODUCTS_CREATE } from "@/frontend/features/breadcrumbs";

<Breadcrumbs items={BREADCRUMBS_ADMIN_PRODUCTS_CREATE} />
```

## Pre-built constants

| Constant | Trail |
|---|---|
| `BREADCRUMBS_ADMIN` | Admin |
| `BREADCRUMBS_ADMIN_PRODUCTS` | Admin › Products |
| `BREADCRUMBS_ADMIN_PRODUCTS_CREATE` | Admin › Products › Create |
| `BREADCRUMBS_ADMIN_PRODUCTS_EDIT` | Admin › Products › Edit |
| `BREADCRUMBS_ADMIN_FILES` | Admin › Files |
| `BREADCRUMBS_ADMIN_CATEGORIES` | Admin › Categories |
| `BREADCRUMBS_ADMIN_CATEGORIES_CREATE` | Admin › Categories › Create |

Constants are composable — each one spreads its parent, so adding a new level means spreading the parent constant and appending the new item.

## Translations

Labels are resolved via `useTranslations("breadcrumb")`. Add new `labelKey` values to:
1. The `BreadcrumbItem.labelKey` union in `types.ts`
2. The `breadcrumb` namespace in every `frontend/features/translation/messages/<lng>.json`

## Adding a new route

1. Add the new route to `ROUTES` in `frontend/constants.ts` if it does not exist.
2. Add the `labelKey` to the union in `types.ts` and to all translation files.
3. Export a new constant from `constants.ts`, spreading the parent trail.
4. Re-export it from `index.ts`.
