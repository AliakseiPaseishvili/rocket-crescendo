# categories feature

Category management feature — listing, creating, editing, and deleting categories with multilingual translations.

## Structure

```
categories/
  components/
    CategoriesList.tsx              # Admin list of all categories with create link
    Category.tsx                    # Single category card with edit/delete actions
    CategoryBadge.tsx               # Inline badge (color dot + name) for use in other features
    CategoryFormFields.tsx          # Shared form layout: color picker + per-language name tabs + submit
    CategoryTranslationTabContent.tsx # Tab panel for a single language's name field
    CategorySelector.tsx            # Select dropdown for picking a category (used in product forms)
    CategorySelectItem.tsx          # Single option inside CategorySelector
    CreateCategoryForm.tsx          # Form wrapper for creating a new category
    CreateCategoryLink.tsx          # "+" link to the admin create-category page
    EditCategoryModal.tsx           # Dialog wrapper for editing an existing category
    index.ts                        # Barrel export for components
  hooks/
    use-categories.ts               # useQuery: fetch all categories (accepts optional CategoryFilter)
    use-categories-by-ids.ts        # useQuery: fetch categories by an array of IDs
    use-create-category.ts          # useMutation: POST new category, invalidates list, redirects to admin
    use-create-category-form.ts     # react-hook-form + Yup wired to useCreateCategory
    use-delete-category.ts          # useMutation: DELETE category by id, invalidates list
    use-edit-category.ts            # useMutation: PUT category by id, invalidates list
    use-edit-category-form.ts       # react-hook-form + Yup wired to useEditCategory, pre-fills from category
    index.ts                        # Barrel export for hooks
  types.ts                          # CategoryTranslationField, CategoryFormValues
  constants.ts                      # CATEGORIES_QUERY_KEY, CATEGORIES_BY_IDS, CATEGORY_DETAILS
  index.ts                          # Barrel export: CategoriesList, CategoryBadge, CreateCategoryForm
```

## Types

| Type | Shape |
|---|---|
| `CategoryTranslationField` | `{ language: SUPPORTED_LANGUAGE; name: string }` |
| `CategoryFormValues` | `{ color: string; translations: CategoryTranslationField[] }` |

`CategoryWithTranslations` comes from `@/backend/features/category`.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `CATEGORIES_QUERY_KEY` | `'categories'` | `useCategories`, `useCreateCategory`, `useDeleteCategory`, `useEditCategory` |
| `CATEGORIES_BY_IDS` | `'categories-by-ids'` | `useCategoriesByIds` |
| `CATEGORY_DETAILS` | `'category-details'` | (reserved for future detail queries) |

## Key patterns

- **`CategoryFormFields`** is the shared form UI used by both `CreateCategoryForm` and `EditCategoryModal`. It accepts all form state as props so the two wrappers can supply their own hooks.
- **Translation tabs** — one tab per supported language, driven by `useFieldArray`. `CategoryTranslationTabContent` renders a single language tab panel; `TranslationTabTrigger` (from the `translation` feature) renders the tab trigger and shows an error indicator.
- **Color picker** — `color` field uses the `ColorPicker` component (at `@/frontend/components/ColorPicker`) via `Controller`.
- **Edit flow** — `EditCategoryModal` opens a `Dialog` and passes an `onSuccess` callback to `useEditCategoryForm` to close the dialog after a successful mutation.
- **Delete flow** — `Category` calls `useDeleteCategory` directly; the button is disabled while the mutation is pending.

## Adding a new category field

1. Add the field to `CategoryFormValues` in [types.ts](types.ts).
2. Add the Yup rule to the schema in both [use-create-category-form.ts](hooks/use-create-category-form.ts) and [use-edit-category-form.ts](hooks/use-edit-category-form.ts).
3. Add the form control to [CategoryFormFields.tsx](components/CategoryFormFields.tsx).
4. Update the backend schema (`backend/prisma/schema.prisma`) and run `npx prisma generate`.
5. Update the API payload types in `frontend/features/api/categories.ts`.
