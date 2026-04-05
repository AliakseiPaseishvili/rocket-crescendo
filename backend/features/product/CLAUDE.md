# Product Feature

Handles product CRUD with multilingual translations and category association.

## Structure

```
backend/features/product/
  Product.repository.ts   # DB access via Prisma (always includes translations)
  Product.service.ts      # Business logic: validation + delegates to repository
  types.ts                # Types: ProductWithTranslations, ProductCreateInput, ProductUpdateInput, ProductFilter
  index.ts                # Barrel export
```

## Key concepts

- **Translations** — every product has one or more `ProductTranslation` records (name, description, language). Always fetched via `include: { translations: true }`.
- **Update strategy** — updating translations replaces all existing ones (`deleteMany: {}` then `create`), not a partial patch.
- **ProductWithTranslations** — the standard return shape: `{ id, favorite, categoryId, translations[] }`.
- **Validation** (in service, not repository):
  - `categoryId` is required on create.
  - At least one translation required; each must have non-empty `name` and `description`.

## Types

| Type | Purpose |
|---|---|
| `ProductWithTranslations` | Product with its translations array |
| `ProductCreateInput` | `{ categoryId, favorite?, translations[] }` |
| `ProductUpdateInput` | `{ favorite?, translations? }` — translations replace all if provided |
| `ProductFilter` | `{ favorite?: boolean }` |

## Usage

```ts
import { ProductService } from '@/backend/features/product';

const service = new ProductService();

// Create
const product = await service.create({
  categoryId: 1,
  favorite: false,
  translations: [
    { language: 'en', name: 'My Book', description: 'A great book' },
    { language: 'fr', name: 'Mon Livre', description: 'Un bon livre' },
  ],
});

// Get all favorites
const favorites = await service.getAll({ favorite: true });

// Update (replace translations)
await service.update(product.id, {
  translations: [{ language: 'en', name: 'Updated', description: 'Updated desc' }],
});

// Delete
await service.delete(product.id);
```
