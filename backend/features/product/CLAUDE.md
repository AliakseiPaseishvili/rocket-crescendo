# Product Feature

Handles product CRUD with multilingual translations, category association, and optional file attachments (main image, video, additional images).

## Structure

```
backend/features/product/
  Product.repository.ts   # DB access via Prisma (always includes translations + productFiles with file)
  Product.service.ts      # Business logic: translation validation, file limits, existence checks
  types.ts                # Types derived from Prisma: ProductWithTranslations, ProductFileItem, ProductFileRole (enum value + type), plus input types
  index.ts                # Barrel export
```

## Key concepts

- **Translations** — every product has one or more `ProductTranslation` records (`name`, `description`, `language`). Always fetched via `PRODUCT_INCLUDE`.
- **Product files** — products optionally have up to 10 files attached via the `ProductFile` join table. Each entry has a `role`: `MAIN_IMAGE` (max 1), `VIDEO` (max 1), or `ADDITIONAL_IMAGE` (max 8). The join table has a `@@unique([productId, fileId])` constraint — the same file cannot be attached twice to the same product.
- **File ownership** — `ProductFile` rows are deleted when a product is deleted (cascade), but the referenced `File` records are never deleted automatically.
- **Update strategy** — both translations and files use full replace: when provided in an update, all existing rows are deleted and the new set is created. Omitting `translations` or `files` from the update payload leaves them untouched. Passing `files: []` clears all file associations without touching the `File` records.
- **`PRODUCT_INCLUDE` constant** — the shared Prisma `include` object `{ translations: true, productFiles: { include: { file: true } } }` used by all four query methods to guarantee a consistent return shape.
- **Validation** (in service, not repository):
  - `categoryId` is required on create.
  - At least one translation required; each must have non-empty `name` and `description`.
  - Duplicate `fileId` values in the same request are rejected.
  - At most 10 files total, 1 `MAIN_IMAGE`, 1 `VIDEO`, 8 `ADDITIONAL_IMAGE`.

## Types

`ProductFileRole`, `ProductFileItem`, and `ProductWithTranslations` are derived from Prisma-generated types — they stay in sync with the schema automatically.

| Type | Purpose |
|---|---|
| `ProductWithTranslations` | `ProductGetPayload<{ include: { translations: true; productFiles: { include: { file: true } } } }>` — standard return shape for all queries |
| `ProductFileItem` | `ProductFileGetPayload<{ select: { id, role, file: { select: { id, fileId, fileUrl, fileType, name } } } }>` — shape of each item in `productFiles[]` |
| `ProductFileRole` | Re-exported Prisma enum (both value and type): `"MAIN_IMAGE" \| "VIDEO" \| "ADDITIONAL_IMAGE"`. Usable at runtime in `ProductService.validateFiles` |
| `ProductFileInput` | `{ fileId: number; role: ProductFileRole }` — used in create/update payloads |
| `ProductCreateInput` | `{ categoryId, favorite?, translations[], files? }` |
| `ProductUpdateInput` | `{ favorite?, translations?, files? }` — all fields optional; translations/files replace all if provided |
| `ProductFilter` | `{ favorite?: boolean }` |

## Usage

```ts
import { ProductService } from '@/backend/features/product';

const service = new ProductService();

// Create with files
const product = await service.create({
  categoryId: 1,
  favorite: false,
  translations: [
    { language: 'en', name: 'My Book', description: 'A great book' },
  ],
  files: [
    { fileId: 10, role: 'MAIN_IMAGE' },
    { fileId: 11, role: 'VIDEO' },
    { fileId: 12, role: 'ADDITIONAL_IMAGE' },
  ],
});

// Get all favorites
const favorites = await service.getAll({ favorite: true });

// Update — replace translations and clear all files
await service.update(product.id, {
  translations: [{ language: 'en', name: 'Updated', description: 'Updated desc' }],
  files: [],
});

// Update — leave files unchanged (omit the key entirely)
await service.update(product.id, { favorite: true });

// Delete (ProductFile rows cascade-deleted; File records untouched)
await service.delete(product.id);
```
