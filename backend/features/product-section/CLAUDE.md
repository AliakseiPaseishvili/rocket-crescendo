# ProductSection Feature

Handles CRUD for product curriculum sections. Each section belongs to a product (via `productId`) and contains ordered video lessons. Sections have multilingual names via `ProductSectionTranslation`.

## Structure

```
backend/features/product-section/
  ProductSection.repository.ts  # DB access via Prisma; always includes translations + lessons with their translations and file via PRODUCT_SECTION_INCLUDE
  ProductSection.service.ts     # Business logic: productId required on create, translation validation, existence checks before update/delete
  types.ts                      # ProductSectionWithTranslations, ProductSectionCreateInput, ProductSectionUpdateInput, ProductSectionFilter
  index.ts                      # Barrel export — ProductSectionService (value); all types as export type
```

## Key concepts

- **Translations** — every section has one or more `ProductSectionTranslation` records (`name`, `language`). Always fetched via `PRODUCT_SECTION_INCLUDE`.
- **Lessons** — the `PRODUCT_SECTION_INCLUDE` constant also nests `lessons` with their translations and file, so `findAll` and `findById` return the full curriculum tree in a single query.
- **Order** — `order: Int @default(0)` on the model; repository uses `orderBy: { order: 'asc' }` on all list queries so callers get a stable sort.
- **Cascade delete** — `ProductSection` rows cascade-delete when the parent `Product` is deleted. Lessons cascade-delete when their section is deleted.
- **Update strategy** — translations use full replace: when provided in an update, `deleteMany: {}` + `create: data.translations` runs atomically. Omitting `translations` from the payload leaves them untouched.
- **`PRODUCT_SECTION_INCLUDE` constant** — `{ translations: true, lessons: { include: { translations: true, file: true } } }` — used by all four repository methods to guarantee a consistent return shape.
- **Validation** (in service, not repository):
  - `productId` is required on create.
  - At least one translation required; each must have a non-empty `name`.

## Types

| Type | Purpose |
|---|---|
| `ProductSectionWithTranslations` | `ProductSectionGetPayload<{ include: { translations: true; lessons: { include: { translations: true; file: true } } } }>` — standard return shape for all queries; includes nested lessons with their translations and file |
| `ProductSectionCreateInput` | `{ productId: string; order?: number; translations: { language: string; name: string }[] }` |
| `ProductSectionUpdateInput` | `{ order?: number; translations?: { language: string; name: string }[] }` — all optional; translations replace all existing if provided |
| `ProductSectionFilter` | `{ productId?: string }` — optional; only applied when present |

## Usage

```ts
import { ProductSectionService } from '@/backend/features/product-section';

const service = new ProductSectionService();

// Create a section with two languages
const section = await service.create({
  productId: 'product-uuid',
  order: 0,
  translations: [
    { language: 'en', name: 'Introduction' },
    { language: 'fr', name: 'Introduction' },
  ],
});

// Get all sections for a product (ordered by `order` asc)
const sections = await service.getAll({ productId: 'product-uuid' });

// Update name translations only (lessons and order untouched)
await service.update(section.id, {
  translations: [{ language: 'en', name: 'Getting Started' }],
});

// Delete (cascade-deletes all VideoLesson rows for this section)
await service.delete(section.id);
```
