# breadcrumbs feature

Renders accessible breadcrumb navigation for admin pages using shadcn/ui's `Breadcrumb` primitives and next-intl translations. Provides pre-built trail constants for every admin route so pages never assemble their own arrays.

## Structure

```
breadcrumbs/
  components/
    Breadcrumbs.tsx   # Client component: maps BreadcrumbItem[] to shadcn Breadcrumb; last item = current page (no link)
    index.ts          # Barrel export for components
  types.ts            # BreadcrumbItem
  constants.ts        # Pre-built BreadcrumbItem[] trail constants per admin route
  index.ts            # Barrel: Breadcrumbs, BreadcrumbItem, all constants
```

## Types

| Type | Shape |
|---|---|
| `BreadcrumbItem` | `{ labelKey: "admin" \| "products" \| "categories" \| "files" \| "users" \| "create" \| "edit"; href?: string }` |

`href` is omitted for the last item in a trail (the current page), which `Breadcrumbs` renders as `<BreadcrumbPage>` rather than a link.

## Key patterns

- **Last-item detection** — `Breadcrumbs` checks `index === items.length - 1`. The last item renders as `<BreadcrumbPage>` (plain text). All other items with an `href` render as a locale-aware `<Link>` wrapped in `<BreadcrumbLink asChild>`.
- **Trail composition** — every constant spreads its parent, so `BREADCRUMBS_ADMIN_PRODUCTS_CREATE` is `[...BREADCRUMBS_ADMIN_PRODUCTS, { labelKey: 'create' }]`. Add new levels by spreading the relevant parent.
- **Translations** — labels are resolved via `useTranslations("breadcrumb")`. The `labelKey` union in `types.ts` is the source of truth for which keys must exist in the `breadcrumb` namespace of every locale file.

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
| `BREADCRUMBS_ADMIN_USERS` | Admin › Users |

## How to extend

### Adding a breadcrumb trail for a new admin section

1. Add the route to `ROUTES` in `frontend/constants.ts` if it does not exist.
2. Add the new `labelKey` value to the union in `types.ts`.
3. Add the translation string under `breadcrumb.<labelKey>` in every `frontend/features/translation/messages/<lng>.json`.
4. Export a new constant from `constants.ts` by spreading the parent trail and appending the new item.
5. Re-export the constant from `index.ts`.
