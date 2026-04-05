# products feature

Product management feature — listing, creating, editing, and deleting products with multilingual translations and category assignment.

## Structure

```
products/
  components/
    ProductList.tsx               # Admin list of all products with create link
    Product.tsx                   # Single product card with favorite toggle, edit/delete actions
    ProductFormFields.tsx         # Shared form layout: favorite toggle + category selector + per-language name/description tabs + submit
    TranslationTabContent.tsx     # Tab panel for a single language's name and description fields
    CreateProductForm.tsx         # Form wrapper for creating a new product
    CreateProductLink.tsx         # "+" link to the admin create-product page
    EditProductModal.tsx          # Dialog wrapper for editing an existing product
    index.ts                      # Barrel export for components
  hooks/
    use-products.ts               # useQuery: fetch all products (accepts optional ProductFilter)
    use-create-product.ts         # useMutation: POST new product, invalidates list, redirects to admin
    use-create-product-form.ts    # react-hook-form + Yup wired to useCreateProduct
    use-delete-product.ts         # useMutation: DELETE product by id, invalidates list
    use-update-product.ts         # useMutation: PUT product by id, invalidates list
    use-edit-product-form.ts      # react-hook-form + Yup wired to useUpdateProduct, pre-fills from product
    index.ts                      # Barrel export for hooks
  types.ts                        # TranslationField, ProductFormValues
  constants.ts                    # PRODUCTS_QUERY_KEY
  index.ts                        # Barrel export: CreateProductForm, ProductList
```

## Types

| Type | Shape |
|---|---|
| `TranslationField` | `{ language: SUPPORTED_LANGUAGE; name: string; description: string }` |
| `ProductFormValues` | `{ favorite: boolean; categoryId: number; translations: TranslationField[] }` |

`ProductWithTranslations` (and related backend types) come from `@/backend/features/product`.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `PRODUCTS_QUERY_KEY` | `'products'` | `useProducts`, `useCreateProduct`, `useDeleteProduct`, `useUpdateProduct` |

## Key patterns

- **`ProductFormFields`** is the shared form UI used by both `CreateProductForm` and `EditProductModal`. It accepts all form state as props so the two wrappers can supply their own hooks.
- **Translation tabs** — one tab per supported language, driven by `useFieldArray`. `TranslationTabContent` renders a single language tab panel with name and description inputs; `TranslationTabTrigger` (from the `translation` feature) renders the tab trigger and shows an error indicator.
- **Favorite toggle** — `favorite` field is a boolean checkbox/switch rendered in `ProductFormFields` and displayed as a star icon in the `Product` card.
- **Category selector** — `categoryId` field uses `CategorySelector` (from the `categories` feature) via `Controller`.
- **Edit flow** — `EditProductModal` opens a `Dialog` and passes an `onSuccess` callback to `useEditProductForm` to close the dialog after a successful mutation.
- **Delete flow** — `Product` calls `useDeleteProduct` directly; the button is disabled while the mutation is pending.

## Adding a new product field

1. Add the field to `ProductFormValues` in [types.ts](types.ts).
2. Add the Yup rule to the schema in both [use-create-product-form.ts](hooks/use-create-product-form.ts) and [use-edit-product-form.ts](hooks/use-edit-product-form.ts).
3. Add the form control to [ProductFormFields.tsx](components/ProductFormFields.tsx).
4. Update the backend schema (`backend/prisma/schema.prisma`) and run `npx prisma generate`.
5. Update the API payload types in `frontend/features/api/products.ts`.
