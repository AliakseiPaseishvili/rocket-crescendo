# products feature

Product management feature — listing, creating, editing, and deleting products with multilingual translations, category assignment, and media file attachments (main image, video, up to 8 additional images).

## Structure

```
products/
  components/
    ProductList.tsx               # Admin list of all products with create link; prefetches all category data via useCategoriesByIds
    Product.tsx                   # Single product card: image preview (main image → first additional image → ImageIcon placeholder), favorite toggle, edit/delete actions
    ProductFormFields.tsx         # Shared form layout: per-language name/description tabs + category selector + favorite checkbox + submit; used by both CreateProductForm and EditProductModal
    TranslationTabContent.tsx     # Tab panel for a single language's name and description fields
    CreateProductForm.tsx         # Two-column page layout: scrollable media panel (left) + ProductFormFields (right); title "Create Product"
    CreateProductLink.tsx         # Button link to the admin create-product page
    EditProductModal.tsx          # Dialog wrapper for editing an existing product
    AdditionalImagesPanel.tsx     # Grid of selected additional images + "Add Images" button + FilePickerDrawer; owns its own drawer open state; max 8 images; text via useTranslations('product')
    MediaPickerCard.tsx           # Always-clickable box card for selecting a single image or video; opens FilePickerDrawer on click; shows preview + trash when file selected; aria-labels via useTranslations('product')
    ProductMediaPanel.tsx         # Scrollable column with MediaPickerCard for main image + video, then AdditionalImagesPanel; label strings via useTranslations('product')
    index.ts                      # Barrel export for components
  hooks/
    use-products.ts               # useQuery: fetch all products (accepts optional ProductFilter)
    use-create-product.ts         # useMutation: POST new product, invalidates list, redirects to admin
    use-create-product-form.ts    # react-hook-form + Yup + ProductMediaState wired to useCreateProduct
    use-delete-product.ts         # useMutation: DELETE product by id, invalidates list
    use-update-product.ts         # useMutation: PUT product by id, invalidates list
    use-edit-product-form.ts      # react-hook-form + Yup wired to useUpdateProduct, pre-fills from product
    index.ts                      # Barrel export for hooks
  types.ts                        # TranslationField, ProductFormValues, ProductMediaState
  constants.ts                    # PRODUCTS_QUERY_KEY, MAX_ADDITIONAL_IMAGES (= 8)
  index.ts                        # Barrel export: CreateProductForm, ProductList
```

## Types

| Type | Shape |
|---|---|
| `TranslationField` | `{ language: SUPPORTED_LANGUAGE; name: string; description: string }` |
| `ProductFormValues` | `{ favorite: boolean; categoryId: number; translations: TranslationField[] }` |
| `ProductMediaState` | `{ mainImage: FileModel \| null; video: FileModel \| null; additionalImages: FileModel[] }` |

`ProductWithTranslations`, `ProductFileRole`, and `ProductFileInput` come from `@/backend/features/product`. `FileModel` comes from `@/backend/features/file`.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `PRODUCTS_QUERY_KEY` | `'products'` | `useProducts`, `useCreateProduct`, `useDeleteProduct`, `useUpdateProduct` |

## Key patterns

- **`Product` image display** — derives `displayImage` by searching `product.productFiles` for the first entry with `role === ProductFileRole.MAIN_IMAGE`, falling back to the first `ADDITIONAL_IMAGE`, and finally `null`. When a file is found, renders a Next.js `<Image fill className="object-cover">` inside a `relative h-40 overflow-hidden rounded-md bg-muted` container — identical pattern to `FileCard.tsx`. When `null`, renders a centred `<ImageIcon size={32} className="text-muted-foreground" />` placeholder inside the same container. `ProductFileRole` is imported from `@/backend/app/generated/prisma/enums` (not the product barrel, which would pull Prisma client into the browser).
- **`CreateProductForm` two-column layout** — renders a full-width `<h1>` title then a `md:grid-cols-[320px_1fr]` grid. The left column is a `overflow-y-auto md:max-h-[calc(100vh-200px)]` wrapper around `ProductMediaPanel`; the right column is `ProductFormFields`. Media state lives in `useCreateProductForm`, not in `ProductFormFields`, keeping the shared form component unaware of file picking.
- **`useCreateProductForm` media state** — holds `ProductMediaState` in local `useState` alongside the react-hook-form instance. Exposes `setMainImage`, `removeMainImage`, `setVideo`, `removeVideo`, `addAdditionalImages`, `removeAdditionalImage`. On submit, maps state to `ProductFileInput[]` with roles `MAIN_IMAGE`, `VIDEO`, `ADDITIONAL_IMAGE` and includes them in the `files` field of the create payload. On success, calls both `reset()` and `resetMedia()` to clear the form and media panel. Files are omitted from the payload entirely if none are selected.
- **`MediaPickerCard`** — a `div` with `role="button"` and full keyboard support (`Enter`/`Space`). Always clickable to open `FilePickerDrawer` regardless of whether a file is already selected — clicking the card replaces the current file. The trash `Button` calls `e.stopPropagation()` before `onRemove` so it doesn't re-open the drawer. Uses `maxSelection={1}` and `alreadySelectedIds={[]}`.
- **`AdditionalImagesPanel`** — self-contained component for the additional images section. Owns its own `drawerOpen` state. Renders the 2-column image grid (when images are selected) and the "Add Images" button. Passes `maxSelection = 8 - additionalImages.length` to the drawer; passes `alreadySelectedIds` so already-picked images appear disabled. Button is disabled when all 8 slots are filled.
- **`ProductMediaPanel`** — renders `MediaPickerCard` for main image and video, then delegates the additional images section to `AdditionalImagesPanel`. Holds no drawer state of its own.
- **`ProductFormFields`** is the shared form UI used by both `CreateProductForm` and `EditProductModal`. It accepts all form state as props so the two wrappers can supply their own hooks.
- **Translation tabs** — one tab per supported language, driven by `useFieldArray`. `TranslationTabContent` renders a single language tab panel with name and description inputs; `TranslationTabTrigger` (from the `translation` feature) renders the tab trigger and shows an error indicator.
- **Favorite toggle** — `favorite` field is a boolean `Checkbox` rendered in `ProductFormFields` and displayed as a star icon in the `Product` card.
- **Category selector** — `categoryId` field uses `CategorySelector` (from the `categories` feature) via `Controller`.
- **Edit flow** — `EditProductModal` uses the shared `Modal` component (`@/frontend/components/Modal`) with controlled state (`useState`). It passes an `onSuccess` callback to `useEditProductForm` which calls `setOpen(false)` after a successful mutation. The trigger is a ghost icon `Button` (size-7, Pencil icon); the content is constrained to `max-w-lg`.
- **Delete flow** — `Product` calls `useDeleteProduct` directly; the button is disabled while the mutation is pending.
- **`ProductList` category prefetch** — calls `useCategoriesByIds` with all category IDs from the product list. This populates the React Query cache so each `Product` card can read its category via `useCacheQuery` without individual network requests.

## Adding a new product field

1. Add the field to `ProductFormValues` in [types.ts](types.ts).
2. Add the Yup rule to the schema in both [use-create-product-form.ts](hooks/use-create-product-form.ts) and [use-edit-product-form.ts](hooks/use-edit-product-form.ts).
3. Add the form control to [ProductFormFields.tsx](components/ProductFormFields.tsx).
4. Update the backend schema (`backend/prisma/schema.prisma`) and run `npx prisma generate`.
5. Update the API payload types in `frontend/features/api/products.ts`.
