# Product Feature

Handles product CRUD with multilingual translations, category association, and optional file attachments (main image, video, additional images).

## Structure

```
backend/features/product/
  Product.repository.ts   # DB access via Prisma; always includes translations + productFiles with file via PRODUCT_INCLUDE
  Product.service.ts      # Business logic: translation validation, file role limits, existence checks before update/delete
  types.ts                # ProductWithTranslations, ProductFileItem, ProductFileInput, ProductCreateInput, ProductUpdateInput, ProductFilter
  index.ts                # Barrel export — ProductService (value); all types as export type
```

## Key concepts

- **Translations** — every product has one or more `ProductTranslation` records (`name`, `description`, `language`). Always fetched via the shared `PRODUCT_INCLUDE` constant.
- **Product files** — products optionally have up to 10 files attached via the `ProductFile` join table. Each entry carries a `role`: `MAIN_IMAGE` (max 1), `VIDEO` (max 1), or `ADDITIONAL_IMAGE` (max 8). The join table enforces `@@unique([productId, fileId])` — the same file cannot be attached twice to the same product.
- **File ownership** — `ProductFile` rows cascade-delete when a product is deleted, but the referenced `File` records are never deleted automatically.
- **Update strategy** — translations and files both use full replace: when provided in an update, all existing rows are deleted and the new set is created atomically. Omitting `translations` or `files` from the update payload leaves them untouched. Passing `files: []` clears all file associations without touching `File` records.
- **`PRODUCT_INCLUDE` constant** — `{ translations: true, productFiles: { include: { file: true } } }` — used by all four query methods in the repository to guarantee a consistent `ProductWithTranslations` return shape.
- **`ProductFileRole` in frontend** — `ProductFileRole` is intentionally **not** re-exported from `index.ts` because importing from this barrel pulls in `ProductService` → `Product.repository.ts` → Prisma client, which cannot run in the browser. Frontend code that needs `ProductFileRole` as a runtime value must import it directly from `@/backend/app/generated/prisma/enums`.
- **Validation** (in service, not repository):
  - `categoryId` is required on create.
  - At least one translation required; each must have non-empty `name` and `description`.
  - Duplicate `fileId` values in the same request are rejected.
  - At most 10 files total: 1 `MAIN_IMAGE`, 1 `VIDEO`, 8 `ADDITIONAL_IMAGE`.

## Types

| Type | Purpose |
|---|---|
| `ProductWithTranslations` | `ProductGetPayload<{ include: { translations: true; productFiles: { include: { file: true } } } }>` — standard return shape for all queries |
| `ProductFileItem` | `ProductFileGetPayload<{ select: { id, role, file: { select: { id, fileId, fileUrl, fileType, name } } } }>` — shape of each item in `productFiles[]` |
| `ProductFileInput` | `{ fileId: string (UUID); role: ProductFileRole }` — used in create/update payloads |
| `ProductCreateInput` | `{ categoryId: string (UUID); favorite?: boolean; translations[]; files? }` |
| `ProductUpdateInput` | `{ favorite?, translations?, files? }` — all fields optional; translations/files replace all existing if provided |
| `ProductFilter` | `{ favorite?: boolean }` |

## Usage

```ts
import { ProductService } from '@/backend/features/product';
import { ProductFileRole } from '@/backend/app/generated/prisma/enums'; // import enum separately — not from the barrel

const service = new ProductService();

// Create with files
const product = await service.create({
  categoryId: 'category-uuid',
  favorite: false,
  translations: [
    { language: 'en', name: 'My Book', description: 'A great book' },
  ],
  files: [
    { fileId: 'file-uuid-1', role: ProductFileRole.MAIN_IMAGE },
    { fileId: 'file-uuid-2', role: ProductFileRole.VIDEO },
    { fileId: 'file-uuid-3', role: ProductFileRole.ADDITIONAL_IMAGE },
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
