# products feature

Product management feature used by admins to list, create, and edit products. Each product has multilingual translations, a category assignment, a favorite flag, a price in USD, a video lessons flag, and media attachments (main image, video, up to 8 additional images). Editing navigates to a dedicated full-page form (not a modal) that pre-fills all fields including media from the existing product.

## Structure

```
products/
  components/
    ProductList.tsx               # Admin list of all products with create link; prefetches category data via useCategoriesByIds
    Product.tsx                   # Single product card: image preview, favorite toggle, edit link, delete action; always shows price at bottom; shows "Video lessons included" badge only when isHiddenActions is false (admin context); renders AddToCartButton only when isHiddenActions is true (public context)
    AddToCartButton.tsx           # Public "Add to cart" button; calls useCartStore().addItem(product.id); uses cart.add i18n key
    ProductFormFields.tsx         # Shared form layout: per-language tabs + category selector + favorite checkbox + price input (shadcn Input with $ prefix) + includeVideoLessons checkbox + submit; used by CreateProductForm and EditProductFormContent
    TranslationTabContent.tsx     # Tab panel for a single language's name and description fields
    CreateProductForm.tsx         # Two-column page layout: ProductMediaPanel (left) + ProductFormFields (right); wired to useCreateProductForm
    CreateProductLink.tsx         # Button link to the admin create-product page
    EditProductForm.tsx           # Data-fetching wrapper: fetches product by id via useProduct, shows loading/error states, renders EditProductFormContent
    EditProductFormContent.tsx    # Two-column page layout identical to CreateProductForm but wired to useEditProductForm; pre-fills translations, category, favorite, price, includeVideoLessons, and all media from the fetched product
    EditProductLink.tsx           # Ghost icon button (Pencil) rendered as a next-intl Link to /admin/products/:id/edit
    AdditionalImagesPanel.tsx     # Grid of selected additional images + "Add Images" button + FilePickerDrawer; max 8 images
    MediaPickerCard.tsx           # Clickable card for selecting a single image or video; opens FilePickerDrawer; shows preview + trash when file selected
    ProductMediaPanel.tsx         # Scrollable column with Controller-wired MediaPickerCard for main image + video, then AdditionalImagesPanel; accepts additionalImages as FileModel[]
    index.ts                      # Barrel export for components
  hooks/
    use-products.ts               # useQuery: fetch all products (accepts optional ProductFilter — favorite, includeVideoLessons)
    use-product.ts                # useQuery: fetch single product by id via GET /api/products/:id
    use-create-product.ts         # useMutation: POST new product, invalidates list, redirects to admin products
    use-product-form-schema.ts    # useMemo-wrapped Yup schema shared by create and edit forms; validates price > 0, required translations, required categoryId; uses next-intl for error messages
    use-create-product-form.ts    # react-hook-form + useProductFormSchema wired to useCreateProduct; defaults price=5.0 and includeVideoLessons=false; delegates additionalImages to useAdditionalImagesField; builds files via buildProductFiles
    use-delete-product.ts         # useMutation: DELETE product by id, invalidates list
    use-update-product.ts         # useMutation: PATCH product by id, invalidates list
    use-edit-product-form.ts      # react-hook-form + useProductFormSchema wired to useUpdateProduct; pre-fills all fields (including price and includeVideoLessons) from product; delegates additionalImages to useAdditionalImagesField; builds files via buildProductFiles
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
| `ProductFormValues` | `{ favorite: boolean; price: number; includeVideoLessons: boolean; categoryId: string (UUID); translations: TranslationField[]; mainImage: FileModel \| null; video: FileModel \| null; additionalImages: FileModel[] }` |

`ProductWithTranslations`, `ProductFileRole`, and `ProductFileInput` come from `@/backend/features/product`. `FileModel` comes from `@/backend/features/file`.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `PRODUCTS_QUERY_KEY` | `'products'` | `useProducts`, `useProduct`, `useCreateProduct`, `useDeleteProduct`, `useUpdateProduct` |

## Key patterns

- **`useProductFormSchema`** — extracted into its own hook so both `useCreateProductForm` and `useEditProductForm` share one source of truth for Yup rules. Validates `price` as a positive number ≥ 0.01 (messages from `product.priceRequired` / `product.priceMustBePositive` i18n keys), `includeVideoLessons` as required boolean, `categoryId` as required string, and all translations. Any new validation rules go here only.
- **`useAdditionalImagesField(control)`** — shared hook that owns the `useFieldArray` for `additionalImages` (with `keyName: '_rhfId'` to avoid clobbering `FileModel.id`). Returns `additionalImageFields`, `addAdditionalImages`, and `removeAdditionalImage`. Both form hooks call this instead of duplicating field-array logic.
- **`buildProductFiles(mainImage, video, additionalImages)`** — pure utility in `utils.ts` that maps the three media fields to a `ProductFileInput[]` ready for the API. Both form hooks call it in `onSubmit` instead of repeating the spread logic inline.
- **`price` and `includeVideoLessons` flow through `...rest`** — in both `useCreateProductForm` and `useEditProductForm`, the `onSubmit` handler destructures `mainImage`, `video`, and `additionalImages` from form values and spreads the rest into the API body. `price` and `includeVideoLessons` are part of that spread automatically — no explicit forwarding needed.
- **`ProductFormValues` includes media fields** — `mainImage`, `video`, and `additionalImages` are part of the react-hook-form schema so all form state lives in one place. Both form hooks build a `files: ProductFileInput[]` array from these fields before calling `mutate`. Passing `files: []` clears all media associations (backend full-replace semantics).
- **`useEditProductForm` media pre-fill** — reads `product.productFiles` on mount to derive `mainImage`, `video`, and `additionalImages`. Also reads `product.price` and `product.includeVideoLessons` directly into `defaultValues`. All pre-fill is done via `defaultValues` — no `useEffect`/`reset` calls.
- **`Product` card footer** — always shows `$product.price.toFixed(2)` at the bottom left. The "Video lessons included" badge (i18n key `product.videoLessonsIncluded`) is only rendered when `!isHiddenActions && product.includeVideoLessons` — it is intentionally admin-only, matching the same guard that shows the favorite/edit/delete actions. Both elements use `useTranslations('product')` inside the component.
- **`ProductFileRole` import in frontend** — imported from `@/backend/app/generated/prisma/enums`, not from the product barrel, to avoid pulling Prisma client into the browser bundle.
- **Edit flow is a full page, not a modal** — `EditProductLink` renders a ghost `Button asChild` wrapping a next-intl `Link` to `/admin/products/{id}/edit`. The two-component split (`EditProductForm` + `EditProductFormContent`) is required because `useEditProductForm` needs the product for `defaultValues` and hooks cannot be called conditionally.
- **`CreateProductForm` and `EditProductFormContent` share the same layout** — both render a full-width `<h1>` followed by a `md:grid-cols-[320px_1fr]` grid. Left column is `overflow-y-auto md:max-h-[calc(100vh-200px)]` wrapping `ProductMediaPanel`; right column is `ProductFormFields`.
- **`ProductList` category prefetch** — calls `useCategoriesByIds` with all category IDs from the product list, populating the React Query cache so each `Product` card reads its category via `useCacheQuery` without individual network requests.

## Adding a new product field

1. Add the field to `ProductFormValues` in [types.ts](types.ts).
2. Add the Yup rule to the shared schema in [hooks/use-product-form-schema.ts](hooks/use-product-form-schema.ts).
3. Add a default value in [hooks/use-create-product-form.ts](hooks/use-create-product-form.ts) and a pre-fill from the product in [hooks/use-edit-product-form.ts](hooks/use-edit-product-form.ts). If the field is part of `...rest` (not a media field), the submit payload picks it up automatically.
4. Add the form control to [components/ProductFormFields.tsx](components/ProductFormFields.tsx).
5. Add the i18n keys to `frontend/features/translation/messages/en.json`, `fr.json`, and `ru.json` under the `product` namespace — TypeScript types update automatically.
6. Update `backend/prisma/schema.prisma`, run `npx prisma migrate dev --name <name>` (or create the SQL manually and run `npx prisma migrate deploy` if the shadow DB is unavailable), then `npx prisma generate`.
7. If the field should appear on the card, update [components/Product.tsx](components/Product.tsx).
