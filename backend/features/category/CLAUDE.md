# Category Feature

Handles category CRUD with multilingual translations and a color field.

## Structure

```
backend/features/category/
  Category.repository.ts  # DB access via Prisma (always includes translations)
  Category.service.ts     # Business logic: validation + delegates to repository
  types.ts                # Types: CategoryWithTranslations, CategoryCreateInput, CategoryUpdateInput, CategoryFilter
  index.ts                # Barrel export
```

## Key concepts

- **Translations** — every category has one or more `CategoryTranslation` records (name, language). Always fetched via `include: { translations: true }`.
- **Update strategy** — updating translations replaces all existing ones (`deleteMany: {}` then `create`), not a partial patch.
- **`findByIds`** — bulk lookup by an array of IDs; available on repository and service (`getByIds`).
- **Validation** (in service, not repository):
  - `color` is required and must be non-empty on create.
  - At least one translation required; each must have a non-empty `name`.

## Types

| Type | Purpose |
|---|---|
| `CategoryWithTranslations` | `{ id, color, translations[] }` — standard return shape |
| `CategoryCreateInput` | `{ color, translations[] }` |
| `CategoryUpdateInput` | `{ color?, translations? }` — translations replace all if provided |
| `CategoryFilter` | `{ color?: string }` |

## Usage

```ts
import { CategoryService } from '@/backend/features/category';

const service = new CategoryService();

// Create
const category = await service.create({
  color: '#ff0000',
  translations: [
    { language: 'en', name: 'Books' },
    { language: 'fr', name: 'Livres' },
  ],
});

// Get all
const categories = await service.getAll();

// Filter by color
const red = await service.getAll({ color: '#ff0000' });

// Bulk fetch by IDs
const subset = await service.getByIds([1, 2, 3]);

// Update (replace translations)
await service.update(category.id, {
  translations: [{ language: 'en', name: 'Updated' }],
});

// Delete
await service.delete(category.id);
```
