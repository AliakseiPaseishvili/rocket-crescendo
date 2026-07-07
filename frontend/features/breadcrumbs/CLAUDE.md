# breadcrumbs feature

Renders accessible breadcrumb navigation for admin pages using shadcn/ui's `Breadcrumb` primitives and next-intl translations. Provides pre-built trail constants for every static admin route and a factory utility for dynamic trails that include a runtime-loaded label (e.g. product name) with skeleton-loading support.

## Structure

```
breadcrumbs/
  components/
    Breadcrumbs.tsx       # Client component: resolves labels via useTranslations, maps items to BreadcrumbEntry
    BreadcrumbEntry.tsx   # Renders one breadcrumb item — link+separator or current-page text; shows Skeleton when item.isLoading is true
    index.ts              # Barrel export for components
  types.ts                # BreadcrumbItem
  constants.ts            # Pre-built BreadcrumbItem[] trail constants per static admin route
  utils.ts                # createBreadcrumbsAdminProductsVideoLessons — factory for the dynamic video-lessons trail
  index.ts                # Barrel: Breadcrumbs, BreadcrumbItem, all constants, factory utils
```

## Types

| Type | Shape |
|---|---|
| `BreadcrumbItem` | `{ labelKey?: "admin" \| "products" \| "categories" \| "files" \| "users" \| "orders" \| "create" \| "edit" \| "videoLessons"; label?: string; href?: string; isLoading?: boolean }` |

- `labelKey` — resolved via `useTranslations("breadcrumb")` inside `Breadcrumbs`; omit when providing a dynamic `label`.
- `label` — raw string that bypasses translation; used for runtime values like a product name.
- `isLoading` — when `true`, `BreadcrumbEntry` renders `<Skeleton className="h-4 w-24" />` instead of text.
- `href` — omitted for the last item in a trail, which renders as `<BreadcrumbPage>` (plain text / skeleton).

## Key patterns

- **`Breadcrumbs` / `BreadcrumbEntry` split** — `Breadcrumbs` owns translation (it calls `useTranslations` and resolves `item.label ?? t(item.labelKey!)`) then passes the resolved `label` down. `BreadcrumbEntry` is a pure presentational component that handles the link-vs-page branching and skeleton swap; it never touches translations directly. This keeps the translation hook in one place and lets `BreadcrumbEntry` be used without a translation context if needed.
- **Last-item detection** — `Breadcrumbs` passes `isLast={index === items.length - 1}` to each `BreadcrumbEntry`. `BreadcrumbEntry` renders `<BreadcrumbPage>` for the last item and `<BreadcrumbLink asChild><Link>` + `<BreadcrumbSeparator>` for all others.
- **Trail composition** — every static constant spreads its parent: `BREADCRUMBS_ADMIN_PRODUCTS_CREATE` is `[...BREADCRUMBS_ADMIN_PRODUCTS, { labelKey: 'create' }]`. Factory functions follow the same pattern but accept runtime arguments.
- **`createBreadcrumbsAdminProductsVideoLessons(id, productName?, isLoading?)`** — builds Admin › Products › [product name] (→ edit page) › Video Lessons. The middle item uses `label` + `isLoading` so callers can pass the loading state while the product fetches. The consumer (`VideoLessonsBreadcrumbs` in the video-lessons feature) calls `useProduct` and `usePickTranslation` externally and passes the resolved name in.

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
| `BREADCRUMBS_ADMIN_ORDERS` | Admin › Orders |

## Factory utils

| Function | Trail |
|---|---|
| `createBreadcrumbsAdminProductsVideoLessons(id, productName?, isLoading?)` | Admin › Products › [productName \| skeleton] (→ `/admin/products/:id/edit`) › Video Lessons |

## How to extend

### Adding a static breadcrumb trail for a new admin section

1. Add the route to `ROUTES` in `frontend/constants.ts` if it does not exist.
2. Add the new `labelKey` value to the union in `types.ts`.
3. Add the translation string under `breadcrumb.<labelKey>` in every `frontend/features/translation/messages/<lng>.json`.
4. Export a new constant from `constants.ts` by spreading the parent trail and appending the new item.
5. Re-export the constant from `index.ts`.

### Adding a dynamic breadcrumb trail (runtime label + loading state)

1. Add a factory function in `utils.ts` that accepts `id`, an optional label string, and an optional `isLoading` boolean.
2. Build the items array using `label` / `isLoading` for the dynamic item; use `labelKey` for all static items.
3. Export the factory from `index.ts`.
4. Create a thin client component (e.g. `FeatureBreadcrumbs.tsx`) in the consuming feature that calls the relevant data hook, resolves the label via `usePickTranslation`, and passes both to the factory. Render that component from the page instead of `<Breadcrumbs>` directly.
