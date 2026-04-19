---
name: rocket-crescendo-backend-pagination
description: Adds offset pagination to an existing backend feature in the rocket-crescendo project. Use this skill whenever the user asks to "add pagination", "add offset pagination", "paginate the list endpoint", or "add limit/offset to" an existing entity such as Product, Category, File, or any future feature. Adds pagination constants to the feature's constants.ts, a PaginatedItems<Model> alias to the feature's types.ts, updates the repository findAll with a Prisma $transaction for items+count, updates the service getAll return type, and updates the API route GET handler to parse and cap offset/limit query params. Also ensures the generic PaginatedItems<T> type exists in backend/types.ts.
---

# Rocket Crescendo — Backend Offset Pagination Skill

Adds offset pagination to an **existing** backend feature. Touch points in order:

1. `backend/types.ts` — ensure `PaginatedItems<T>` generic exists
2. `backend/features/<entity>/constants.ts` — add `DEFAULT_PAGINATION_OFFSET`, `DEFAULT_PAGINATION_LIMIT`, `MAX_PAGINATION_LIMIT`
3. `backend/features/<entity>/types.ts` — add `Paginated<Entity>` alias + `offset`/`limit` to the filter type
4. `backend/features/<entity>/<Entity>.repository.ts` — update `findAll` to return `Paginated<Entity>` using `$transaction`
5. `backend/features/<entity>/<Entity>.service.ts` — update `getAll` return type
6. `backend/features/<entity>/index.ts` — export the three new constants and the new paginated type
7. `app/api/<entity>/route.ts` — parse `offset` and `limit` query params in the `GET` handler

Full copy-paste templates: see [references/templates.md](references/templates.md).

## File locations

| File | Action |
|---|---|
| `backend/types.ts` | Create or update — add `PaginatedItems<T>` if missing |
| `backend/features/<entity>/constants.ts` | Create or update — add three pagination constants |
| `backend/features/<entity>/types.ts` | Add `offset?`/`limit?` to filter type; add `Paginated<Entity>` alias |
| `backend/features/<entity>/<Entity>.repository.ts` | Update `findAll` to use `$transaction` + `skip`/`take` |
| `backend/features/<entity>/<Entity>.service.ts` | Update `getAll` return type to `Paginated<Entity>` |
| `backend/features/<entity>/index.ts` | Export new constants and paginated type |
| `app/api/<entity>/route.ts` | Parse `offset`/`limit` in `GET` handler |

## Workflow

1. Ask the user which entity to paginate if not stated (e.g. "Product", "Category").
2. **Read all existing files** — repository, service, types, constants (if any), index, and the API route — before writing anything. You need to know: the existing filter type name, the existing return type of `findAll`/`getAll`, and what the existing GET handler looks like.
3. Check whether `backend/types.ts` exists and already exports `PaginatedItems<T>`. Create or update it as needed.
4. Create or update `constants.ts` with the three pagination constants.
5. Update `types.ts` — add `offset?` and `limit?` to the existing filter type, and add the `Paginated<Entity>` alias. Import `PaginatedItems` from `../../types` and the model type locally so the alias can reference it.
6. Update the repository `findAll` — replace the `prisma.<entity>.findMany` with a `$transaction` that fetches items and total count simultaneously.
7. Update the service `getAll` return type to match.
8. Update `index.ts` — export the three constants and the new `Paginated<Entity>` type.
9. Update the API route `GET` handler — parse `offset` and `limit` from `searchParams`, apply defaults and cap, pass into the filter.
10. Run `npx tsc --noEmit` and fix any type errors before finishing.

## Key rules

- **Always read before writing.** The existing filter type, model type, and `findAll` signature vary per feature — don't assume.
- **`$transaction` fetches items and count in one round-trip.** Use `prisma.$transaction([prisma.<entity>.findMany(...), prisma.<entity>.count(...)])`.
- **Constants live in the feature's `constants.ts`.** `DEFAULT_PAGINATION_OFFSET = 0`, `DEFAULT_PAGINATION_LIMIT = 20`, `MAX_PAGINATION_LIMIT = 100`. Export all three from the barrel `index.ts`.
- **`Paginated<Entity>` is an alias, not a new struct.** Use `export type Paginated<Entity> = PaginatedItems<<EntityModel>>` — this reuses the generic from `backend/types.ts`.
- **Filter type uses intersection.** Use `export type <EntityFilter> = PaginationFilter & { ...feature-specific fields... }` — do not copy `offset`/`limit` into the feature's filter type directly. Import `PaginationFilter` from `../../types`.
- **Import conflict in `types.ts`.** If `<EntityModel>` is already re-exported via `export type { <EntityModel> }`, add a separate local `import type { <EntityModel> }` — or alias it — so `PaginatedItems<<EntityModel>>` can reference it. See templates.
- **`findAll` always returns the paginated shape**, even with no filter — defaults kick in from constants.
- **API route cap:** `limit` is clamped to `[1, MAX_PAGINATION_LIMIT]`; `offset` is clamped to `[0, ∞)`. Invalid parse results fall back to the default constants.
- **Only update the `GET` handler** in the API route — `POST`, `PATCH`, `DELETE` routes are untouched.

See [references/templates.md](references/templates.md) for complete copy-paste code for each file.
