# admin feature

Admin dashboard navigation feature.

## Structure

```
admin/
  components/
    AdminNav.tsx   # Dashboard nav cards for Products, Categories, and Files
    index.ts       # Barrel export for components
  index.ts         # Barrel export: AdminNav
```

## Components

### AdminNav

Client component (`'use client'`) that renders a two-column grid of navigation cards — one each for Products, Categories, and Files.

- Uses `lucide-react` icons (`LayoutList`, `Tag`, `FileImage`)
- Uses `useTranslations()` for labels/descriptions; keys: `product.products`, `admin.productsDescription`, `category.categories`, `admin.categoriesDescription`, `file.files`, `admin.filesDescription`
- Uses shadcn/ui `Card`, `CardContent`, `CardHeader`, `CardTitle`
- Uses `Link` from `@/frontend/features/translation/i18n/navigation` for locale-aware routing
- Links are driven by `ADMIN_LINKS` constant defined in the component file

## Adding a new admin section

1. Add a new entry to `ADMIN_LINKS` in [AdminNav.tsx](components/AdminNav.tsx) with `labelKey`, `descriptionKey`, `href`, and `icon`.
2. Add the corresponding route to `ROUTES` in `@/frontend/constants`.
3. Add translation keys to all language files under `frontend/features/translation/messages/`.
