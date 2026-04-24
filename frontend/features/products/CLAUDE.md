# products feature

Product management feature used by admins to list, create, and edit products. Each product has multilingual translations, a category assignment, a favorite flag, and media attachments (main image, video, up to 8 additional images). Editing navigates to a dedicated full-page form (not a modal) that pre-fills all fields including media from the existing product.

## Structure

```
products/
  components/
    ProductList.tsx               # Admin list of all products with create link; prefetches category data via useCategoriesByIds
    Product.tsx                   # Single product card: image preview, favorite toggle, edit link, delete action
    ProductFormFields.tsx         # Shared form layout: per-language tabs + category selector + favorite checkbox + submit; used by CreateProductForm and EditProductFormContent
    TranslationTabContent.tsx     # Tab panel for a single language's name and description fields
    CreateProductForm.tsx         # Two-column page layout: ProductMediaPanel (left) + ProductFormFields (right); wired to useCreateProductForm
    CreateProductLink.tsx         # Button link to the admin create-product page
    EditProductForm.tsx           # Data-fetching wrapper: fetches product by id via useProduct, shows loading/error states, renders EditProductFormContent
    EditProductFormContent.tsx    # Two-column page layout identical to CreateProductForm but wired to useEditProductForm; pre-fills translations, category, favorite, and all media from the fetched product
    EditProductLink.tsx           # Ghost icon button (Pencil) rendered as a next-intl Link to /admin/products/:id/edit
    AdditionalImagesPanel.tsx     # Grid of selected additional images + "Add Images" button + FilePickerDrawer; max 8 images
    MediaPickerCard.tsx           # Clickable card for selecting a single image or video; opens FilePickerDrawer; shows preview + trash when file selected
    ProductMediaPanel.tsx         # Scrollable column with Controller-wired MediaPickerCard for main image + video, then AdditionalImagesPanel; accepts additionalImages as FileModel[]
    index.ts                      # Barrel export for components
  hooks/
    use-products.ts               # useQuery: fetch all products (accepts optional ProductFilter)
    use-product.ts                # useQuery: fetch single product by id via GET /api/products/:id
    use-create-product.ts         # useMutation: POST new product, invalidates list, redirects to admin products
    use-product-form-schema.ts    # useMemo-wrapped Yup schema shared by create and edit forms; uses next-intl for error messages
    use-create-product-form.ts    # react-hook-form + useProductFormSchema wired to useCreateProduct; delegates additionalImages field management to useAdditionalImagesField; builds files via buildProductFiles
    use-delete-product.ts         # useMutation: DELETE product by id, invalidates list
    use-update-product.ts         # useMutation: PATCH product by id, invalidates list
    use-edit-product-form.ts      # react-hook-form + useProductFormSchema wired to useUpdateProduct; pre-fills all fields including media from product.productFiles; delegates additionalImages to useAdditionalImagesField; builds files via buildProductFiles
    use-additional-images-field.ts # useFieldArray wrapper for additionalImages: deduplication, slot-capping, and index-based removal; shared by both form hooks
    index.ts                      # Barrel export for hooks
  utils.ts                        # buildProductFiles(mainImage, video, additionalImages) — maps FileModel values to ProductFileInput[]
  types.ts                        # TranslationField, ProductFormValues
  constants.ts                    # PRODUCTS_QUERY_KEY, MAX_ADDITIONAL_IMAGES
  index.ts                        # Barrel export: CreateProductForm, EditProductForm, ProductList
```

## Types

| Type | Shape |
|---|---|
| `TranslationField` | `{ language: SUPPORTED_LANGUAGE; name: string; description: string }` |
| `ProductFormValues` | `{ favorite: boolean; categoryId: string (UUID); translations: TranslationField[]; mainImage: FileModel \| null; video: FileModel \| null; additionalImages: FileModel[] }` |

`ProductWithTranslations`, `ProductFileRole`, and `ProductFileInput` come from `@/backend/features/product`. `FileModel` comes from `@/backend/features/file`.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `PRODUCTS_QUERY_KEY` | `'products'` | `useProducts`, `useProduct`, `useCreateProduct`, `useDeleteProduct`, `useUpdateProduct` |

## Key patterns

- **`useProductFormSchema`** — extracted into its own hook so both `useCreateProductForm` and `useEditProductForm` share one source of truth for Yup rules. It calls `useTranslations` internally and wraps the schema in `useMemo`. Any new validation rules should be added here only.
- **`useAdditionalImagesField(control)`** — shared hook that owns the `useFieldArray` for `additionalImages` (with `keyName: '_rhfId'` to avoid clobbering `FileModel.id`). Returns `additionalImageFields`, `addAdditionalImages`, and `removeAdditionalImage`. Both form hooks call this instead of duplicating the field-array logic. `addAdditionalImages` deduplicates by `id` and respects `MAX_ADDITIONAL_IMAGES`; `removeAdditionalImage(id)` finds the index and calls `remove(index)`.
- **`buildProductFiles(mainImage, video, additionalImages)`** — pure utility in `utils.ts` that maps the three media fields to a `ProductFileInput[]` array ready for the API. Both form hooks call it in `onSubmit` instead of repeating the spread logic inline.
- **`ProductFormValues` includes media fields** — `mainImage`, `video`, and `additionalImages` are part of the react-hook-form schema so all form state lives in one place. Both form hooks build a `files: ProductFileInput[]` array from these fields before calling `mutate`. Passing `files: []` to the update endpoint clears all media associations (backend full-replace semantics).
- **`useEditProductForm` media pre-fill** — reads `product.productFiles` on mount to derive `mainImage` (first `MAIN_IMAGE` entry's `.file`), `video` (first `VIDEO` entry's `.file`), and `additionalImages` (all `ADDITIONAL_IMAGE` entries' `.file`). These become `defaultValues` so the form renders pre-populated without any `useEffect`/`reset` calls.
- **`mainImage` and `video` via `Controller`** — `ProductMediaPanel` receives `control: Control<ProductFormValues>` and wraps each `MediaPickerCard` in a `<Controller>`. `field.onChange` is passed as `onSelect`; `() => field.onChange(null)` as `onRemove`.
- **Edit flow is a full page, not a modal** — `EditProductLink` renders a ghost `Button asChild` wrapping a next-intl `Link` to `/admin/products/{id}/edit`. The edit page renders `EditProductForm` which fetches the product then mounts `EditProductFormContent` once data is available. The two-component split (`EditProductForm` + `EditProductFormContent`) is required because `useEditProductForm` needs the product for `defaultValues` and hooks cannot be called conditionally.
- **`CreateProductForm` and `EditProductFormContent` share the same layout** — both render a full-width `<h1>` followed by a `md:grid-cols-[320px_1fr]` grid. Left column is `overflow-y-auto md:max-h-[calc(100vh-200px)]` wrapping `ProductMediaPanel`; right column is `ProductFormFields`.
- **`useProduct` query key** — uses `[PRODUCTS_QUERY_KEY, id]` so the single-product cache is scoped under the same root key as the list but keyed by id, allowing independent per-product caching.
- **`MediaPickerCard`** — a `div` with `role="button"` and full keyboard support (`Enter`/`Space`). Always opens `FilePickerDrawer` on click — clicking the card replaces the current file. The trash `Button` calls `e.stopPropagation()` before `onRemove` to avoid re-opening the drawer. Uses `maxSelection={1}`.
- **`AdditionalImagesPanel`** — self-contained; owns its own `drawerOpen` state. Passes `maxSelection = MAX_ADDITIONAL_IMAGES - additionalImages.length` and `alreadySelectedIds` to the drawer so already-picked images appear disabled. Button is disabled when all 8 slots are filled.
- **`Product` image display** — derives `displayImage` by searching `product.productFiles` for the first `MAIN_IMAGE` entry, falling back to the first `ADDITIONAL_IMAGE`, then `null`. `ProductFileRole` is imported from `@/backend/app/generated/prisma/enums` (not the product barrel) to avoid pulling Prisma client into the browser.
- **`ProductList` category prefetch** — calls `useCategoriesByIds` with all category IDs from the product list, populating the React Query cache so each `Product` card reads its category via `useCacheQuery` without individual network requests.
- **Translation tabs** — one tab per supported language, driven by `useFieldArray` on `translations`. `TranslationTabContent` renders name/description inputs for a single language; `TranslationTabTrigger` shows an error indicator dot when that language has validation errors.

## Adding a new product field

1. Add the field to `ProductFormValues` in [types.ts](types.ts).
2. Add the Yup rule to the shared schema in [use-product-form-schema.ts](hooks/use-product-form-schema.ts) — used by both form hooks.
3. Add the form control to [ProductFormFields.tsx](components/ProductFormFields.tsx).
4. Update the backend schema (`backend/prisma/schema.prisma`) and run `npx prisma generate`.
5. Update the API payload types in `frontend/features/api/products.ts`.
