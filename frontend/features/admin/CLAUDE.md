# admin feature

Admin dashboard entry point — renders a grid of navigation cards that link to each admin section (Products, Categories, Files, Users).

## Structure

```
admin/
  components/
    AdminNav.tsx   # 2-column card grid linking to all admin sections; uses ADMIN_LINKS constant defined inline
    index.ts       # Barrel export for components
  index.ts         # Barrel: AdminNav
```

## Key patterns

- **`ADMIN_LINKS`** — defined as a local constant inside `AdminNav.tsx` (not exported). Each entry has `{ labelKey, descriptionKey, href, icon }`. Labels come from multiple i18n namespaces (`product.products`, `category.categories`, `file.files`, `user.users`, `order.orders`); descriptions come from the `admin` namespace (`admin.productsDescription`, etc.). `useTranslations()` is called with no namespace argument so both can be resolved in one call.
- **Icons** — each card uses a Lucide icon (`LayoutList` for products, `Tag` for categories, `FileImage` for files, `Users` for users, `Package` for orders). The icon is rendered at `size={20}` inside `CardTitle` alongside the label.
- **Locale-aware links** — cards are wrapped in `<Link>` from `@/frontend/features/translation/i18n/navigation` so routes include the current language prefix.

## Current admin sections

| Section | Route constant | Icon |
|---|---|---|
| Products | `ROUTES.ADMIN_PRODUCTS` | `LayoutList` |
| Categories | `ROUTES.ADMIN_CATEGORIES` | `Tag` |
| Files | `ROUTES.ADMIN_FILES` | `FileImage` |
| Users | `ROUTES.ADMIN_USERS` | `Users` |
| Orders | `ROUTES.ADMIN_ORDERS` | `Package` |

## How to extend

### Adding a new admin section card

1. Add a new route to `ROUTES` in `frontend/constants.ts`.
2. Add a new entry to `ADMIN_LINKS` in `AdminNav.tsx` with the matching `labelKey`, `descriptionKey`, `href`, and a Lucide `icon`.
3. Add translation keys for the label (in the relevant feature namespace, e.g. `order.orders`) and description (`admin.ordersDescription`) in every `frontend/features/translation/messages/<lng>.json`.
4. Create the page at `app/[lng]/(admin)/admin/<section>/page.tsx`.
