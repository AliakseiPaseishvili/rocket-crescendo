# Offset Pagination Templates

Substitute `<Entity>` (PascalCase), `<entity>` (camelCase/kebab-case for file paths), `<EntityModel>` (the Prisma model type, e.g. `FileModel`, `ProductWithTranslations`), and `<EntityFilter>` (the existing filter type name, e.g. `FileFilter`) throughout.

---

## 1. `backend/types.ts` — create or add shared pagination types

Create this file if it doesn't exist. If it exists, add only what's missing.

```ts
export type PaginationFilter = {
  offset?: number;
  limit?: number;
};

export type PaginatedItems<T> = {
  items: T[];
  total: number;
  offset: number;
  limit: number;
};
```

---

## 2. `backend/features/<entity>/constants.ts` — create or update

```ts
export const DEFAULT_PAGINATION_OFFSET = 0;
export const DEFAULT_PAGINATION_LIMIT = 20;
export const MAX_PAGINATION_LIMIT = 100;
```

If the file already exists with other constants, add the three above — don't replace existing content.

---

## 3. `backend/features/<entity>/types.ts` — update filter + add alias

Import `PaginationFilter` and `PaginatedItems` from `../../types`. Use `PaginationFilter` as an intersection with the existing filter type — this keeps `offset`/`limit` out of the feature's filter definition and avoids duplication.

```ts
// Add to the top of the existing imports:
import type { <EntityModel> } from '<path-to-prisma-model>';
import type { PaginatedItems, PaginationFilter } from '../../types';

// Replace the existing filter type with an intersection:
export type <EntityFilter> = PaginationFilter & {
  // ... existing fields only (no offset/limit here) ...
};

// Add the alias (usually near the bottom, before any upload input types):
export type Paginated<Entity> = PaginatedItems<<EntityModel>>;
```

> **Import conflict**: if `<EntityModel>` is already exported via `export type { <EntityModel> } from '...'`, adding `import type { <EntityModel> }` in the same file will cause a TypeScript error ("cannot re-declare"). In that case, import under an alias:
>
> ```ts
> import type { <EntityModel> as _<EntityModel> } from '<path-to-prisma-model>';
> export type Paginated<Entity> = PaginatedItems<_<EntityModel>>;
> ```

---

## 4. `<Entity>.repository.ts` — update `findAll`

Replace the existing `findAll` body. Keep the `where` construction logic unchanged — only replace the Prisma query with a `$transaction`.

```ts
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from './constants';
// (add to existing imports — keep all other imports)

async findAll(filter?: <EntityFilter>): Promise<Paginated<Entity>> {
  const where: <EntityWhereInput> = {};
  // ... existing where-building logic stays unchanged ...

  const offset = filter?.offset ?? DEFAULT_PAGINATION_OFFSET;
  const limit = filter?.limit ?? DEFAULT_PAGINATION_LIMIT;
  const [items, total] = await prisma.$transaction([
    prisma.<entity>.findMany({ where, skip: offset, take: limit, orderBy: { id: 'desc' } }),
    prisma.<entity>.count({ where }),
  ]);
  return { items, total, offset, limit };
}
```

> If the existing `findAll` uses `include` (e.g. for translations), carry that through to the `findMany` inside the transaction.

---

## 5. `<Entity>.service.ts` — update `getAll` return type

```ts
import type { Paginated<Entity> } from './types';
// (add to existing type imports)

async getAll(filter?: <EntityFilter>): Promise<Paginated<Entity>> {
  return this.repository.findAll(filter);
}
```

Only the return type changes — the body stays the same.

---

## 6. `index.ts` — add exports

```ts
export { DEFAULT_PAGINATION_OFFSET, DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } from './constants';
export type { Paginated<Entity> } from './types';
// (add alongside existing exports — don't replace anything)
```

---

## 7. `app/api/<entity>/route.ts` — update `GET` handler

Add the three constants to the import and parse `offset`/`limit` from `searchParams`:

```ts
import {
  <Entity>Service,
  // ... existing imports ...
  MAX_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
} from "@/backend/features/<entity>";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // ... existing param parsing ...
    const offsetParam = searchParams.get("offset");
    const limitParam = searchParams.get("limit");
    const filter: <EntityFilter> = {};
    // ... existing filter assignments ...
    if (offsetParam !== null)
      filter.offset = Math.max(
        0,
        parseInt(offsetParam, 10) || DEFAULT_PAGINATION_OFFSET,
      );
    if (limitParam !== null)
      filter.limit = Math.min(
        MAX_PAGINATION_LIMIT,
        Math.max(1, parseInt(limitParam, 10) || DEFAULT_PAGINATION_LIMIT),
      );
    const result = await service.getAll(
      Object.keys(filter).length ? filter : undefined,
    );
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch <entity>s";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

---

## Quick reference — substitutions

| Placeholder | Replace with | Example (file feature) |
|---|---|---|
| `<Entity>` | PascalCase entity name | `File` |
| `<entity>` | camelCase/kebab for paths | `file` |
| `<EntityModel>` | Model type from Prisma | `FileModel` |
| `<EntityFilter>` | Existing filter type name | `FileFilter` |
| `<EntityWhereInput>` | Prisma where-input type | `FileWhereInput` |
| `Paginated<Entity>` | New alias name | `PaginatedFiles` |

---

## Real example — File feature (already implemented, use as reference)

### `backend/types.ts`
```ts
export type PaginatedItems<T> = {
  items: T[];
  total: number;
  offset: number;
  limit: number;
};
```

### `backend/features/file/constants.ts`
```ts
export const DEFAULT_PAGINATION_OFFSET = 0;
export const DEFAULT_PAGINATION_LIMIT = 20;
export const MAX_PAGINATION_LIMIT = 100;
```

### `backend/features/file/types.ts` (relevant additions)
```ts
import type { FileModel } from '../../app/generated/prisma/models/File';
import type { PaginatedItems, PaginationFilter } from '../../types';

export type FileFilter = PaginationFilter & {
  fileType?: FileType;
  name?: string;
};

export type PaginatedFiles = PaginatedItems<FileModel>;
```

### `backend/features/file/File.repository.ts` (`findAll`)
```ts
async findAll(filter?: FileFilter): Promise<PaginatedFiles> {
  const where: FileWhereInput = {};
  if (filter) {
    if (filter.fileType) where.fileType = filter.fileType;
    if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
  }
  const offset = filter?.offset ?? DEFAULT_PAGINATION_OFFSET;
  const limit = filter?.limit ?? DEFAULT_PAGINATION_LIMIT;
  const [items, total] = await prisma.$transaction([
    prisma.file.findMany({ where, skip: offset, take: limit, orderBy: { id: 'desc' } }),
    prisma.file.count({ where }),
  ]);
  return { items, total, offset, limit };
}
```

### Response shape
```json
{
  "items": [...],
  "total": 84,
  "offset": 20,
  "limit": 20
}
```
