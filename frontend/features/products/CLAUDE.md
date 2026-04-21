# products feature

Product management feature used by admins to list, create, edit, and delete products. Each product has multilingual translations, a category assignment, a favorite flag, and media attachments (main image, video, up to 8 additional images).

## Structure

```
products/
  components/
    ProductList.tsx               # Admin list of all products with create link; prefetches category data via useCategoriesByIds
    Product.tsx                   # Single product card: image preview, favorite toggle, edit/delete actions
    ProductFormFields.tsx         # Shared form layout: per-language tabs + category selector + favorite checkbox + submit; used by CreateProductForm and EditProductModal
    TranslationTabContent.tsx     # Tab panel for a single language's name and description fields
    CreateProductForm.tsx         # Two-column page layout: ProductMediaPanel (left) + ProductFormFields (right)
    CreateProductLink.tsx         # Button link to the admin create-product page
    EditProductModal.tsx          # Dialog wrapper for editing an existing product; uses shared Modal component
    AdditionalImagesPanel.tsx     # Grid of selected additional images + "Add Images" button + FilePickerDrawer; max 8 images
    MediaPickerCard.tsx           # Clickable card for selecting a single image or video; opens FilePickerDrawer; shows preview + trash when file selected
    ProductMediaPanel.tsx         # Scrollable column with Controller-wired MediaPickerCard for main image + video, then AdditionalImagesPanel; accepts additionalImages as FileModel[]
    index.ts                      # Barrel export for components
  hooks/
    use-products.ts               # useQuery: fetch all products (accepts optional ProductFilter)
    use-create-product.ts         # useMutation: POST new product, invalidates list, redirects to admin products
    use-product-form-schema.ts    # useMemo-wrapped Yup schema shared by create and edit forms; uses next-intl for error messages
    use-create-product-form.ts    # react-hook-form + useProductFormSchema wired to useCreateProduct; manages mainImage/video via Controller, additionalImages via useFieldArray
    use-delete-product.ts         # useMutation: DELETE product by id, invalidates list
    use-update-product.ts         # useMutation: PUT product by id, invalidates list
    use-edit-product-form.ts      # react-hook-form + useProductFormSchema wired to useUpdateProduct; pre-fills translations from product; strips media fields from PUT payload
    index.ts                      # Barrel export for hooks
  types.ts                        # TranslationField, ProductFormValues
  constants.ts                    # PRODUCTS_QUERY_KEY, MAX_ADDITIONAL_IMAGES
  index.ts                        # Barrel export: CreateProductForm, ProductList
```

## Types

| Type | Shape |
|---|---|
| `TranslationField` | `{ language: SUPPORTED_LANGUAGE; name: string; description: string }` |
| `ProductFormValues` | `{ favorite: boolean; categoryId: number; translations: TranslationField[]; mainImage: FileModel \| null; video: FileModel \| null; additionalImages: FileModel[] }` |

`ProductWithTranslations`, `ProductFileRole`, and `ProductFileInput` come from `@/backend/features/product`. `FileModel` comes from `@/backend/features/file`.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `PRODUCTS_QUERY_KEY` | `'products'` | `useProducts`, `useCreateProduct`, `useDeleteProduct`, `useUpdateProduct` |

## Key patterns

- **`useProductFormSchema`** — extracted into its own hook so both `useCreateProductForm` and `useEditProductForm` share one source of truth for Yup rules. It calls `useTranslations` internally and wraps the schema in `useMemo` so it is only rebuilt when translations change. Any new validation rules should be added here, not in the individual form hooks.
- **`ProductFormValues` includes media fields** — `mainImage`, `video`, and `additionalImages` are part of the react-hook-form schema so all form state lives in one place. They are stripped from the API payload in `onSubmit` (destructured out before calling `mutate`). `useEditProductForm` also carries these fields to satisfy the shared type but always strips them since the edit endpoint doesn't handle media.
- **`mainImage` and `video` via `Controller`** — `ProductMediaPanel` receives `control: Control<ProductFormValues>` and wraps each `MediaPickerCard` in a `<Controller>`. `field.onChange` is passed as `onSelect`; `() => field.onChange(null)` as `onRemove`. No watch hooks or manual `setValue` calls are needed.
- **`additionalImages` via `useFieldArray`** — `useCreateProductForm` calls `useFieldArray({ control, name: 'additionalImages', keyName: '_rhfId' })`. The `keyName: '_rhfId'` avoids clobbering `FileModel.id` with RHF's internal key. `addAdditionalImages` deduplicates by `id` and respects `MAX_ADDITIONAL_IMAGES`; `removeAdditionalImage(id)` finds the index and calls `remove(index)`.
- **`CreateProductForm` two-column layout** — renders a full-width `<h1>` then a `md:grid-cols-[320px_1fr]` grid. Left column is a `overflow-y-auto md:max-h-[calc(100vh-200px)]` wrapper around `ProductMediaPanel`; right column is `ProductFormFields`. `ProductMediaPanel` gets `control` + the `additionalImageFields` array + add/remove callbacks from `useCreateProductForm`.
- **`MediaPickerCard`** — a `div` with `role="button"` and full keyboard support (`Enter`/`Space`). Always opens `FilePickerDrawer` on click regardless of current selection — clicking the card replaces the file. The trash `Button` calls `e.stopPropagation()` before `onRemove` to avoid re-opening the drawer. Uses `maxSelection={1}`.
- **`AdditionalImagesPanel`** — self-contained; owns its own `drawerOpen` state. Passes `maxSelection = MAX_ADDITIONAL_IMAGES - additionalImages.length` and `alreadySelectedIds` to the drawer so already-picked images appear disabled. Button is disabled when all 8 slots are filled.
- **`Product` image display** — derives `displayImage` by searching `product.productFiles` for the first `MAIN_IMAGE` entry, falling back to the first `ADDITIONAL_IMAGE`, then `null`. `ProductFileRole` is imported from `@/backend/app/generated/prisma/enums` (not the product barrel) to avoid pulling Prisma client into the browser.
- **`EditProductModal`** — uses the shared `Modal` component with controlled `open` state. Passes `handleSuccess = () => setOpen(false)` as `onSuccess` to `useEditProductForm` so the dialog closes after a successful mutation. Trigger is a ghost icon `Button` (size-7, Pencil icon); content is `max-w-lg`.
- **`ProductList` category prefetch** — calls `useCategoriesByIds` with all category IDs from the product list, populating the React Query cache so each `Product` card reads its category via `useCacheQuery` without individual network requests.
- **Translation tabs** — one tab per supported language, driven by `useFieldArray` on `translations`. `TranslationTabContent` renders name/description inputs for a single language; `TranslationTabTrigger` shows an error indicator dot when that language has validation errors.

## Adding a new product field

1. Add the field to `ProductFormValues` in [types.ts](types.ts).
2. Add the Yup rule to the shared schema in [use-product-form-schema.ts](hooks/use-product-form-schema.ts) — it is used by both create and edit form hooks.
3. Add the form control to [ProductFormFields.tsx](components/ProductFormFields.tsx).
4. Update the backend schema (`backend/prisma/schema.prisma`) and run `npx prisma generate`.
5. Update the API payload types in `frontend/features/api/products.ts`.
