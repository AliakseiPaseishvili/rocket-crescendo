---
name: rocket-crescendo-backend-get-by-ids
description: Adds a getByIds bulk-fetch operation to an existing backend feature in the rocket-crescendo project. Use when the user asks to "add getByIds", "add a by-ids endpoint", "bulk fetch by IDs", or "add bulk lookup" to an existing entity such as Product, Category, or any future feature. Adds findByIds to the repository, getByIds to the service, and a POST /api/<entity>/by-ids route.
---

# Rocket Crescendo — Backend `getByIds` Skill

Adds a bulk-fetch-by-IDs operation to an **existing** backend feature following the same pattern as `app/api/category/by-ids/`. Three touch points:

1. `findByIds` method on `<Entity>Repository`
2. `getByIds` method on `<Entity>Service`
3. New API route `app/api/<entity>/by-ids/route.ts` — `POST` with `{ ids: string[] }` body

Full copy-paste templates: see [references/templates.md](references/templates.md).

## File locations

| File | Action |
|---|---|
| `backend/features/<entity>/<Entity>.repository.ts` | Add `findByIds` method |
| `backend/features/<entity>/<Entity>.service.ts` | Add `getByIds` method |
| `app/api/<entity>/by-ids/route.ts` | Create new file |

## Workflow

1. Identify the target entity (e.g. "Product", "Category").
2. Read the existing repository and service files to find the correct return type (`<Entity>WithTranslations`, `<Entity>WithRelations`, or a plain model type).
3. Add `findByIds` to the repository — insert it after `findById`.
4. Add `getByIds` to the service — insert it after `getById`.
5. Create `app/api/<entity>/by-ids/route.ts`.

No Prisma schema changes are needed — this uses existing `prisma.<entity>.findMany` with `where: { id: { in: ids } }`.

## Repository rules

- Method signature: `async findByIds(ids: string[]): Promise<ReturnType[]>`
- Prisma query: `prisma.<entity>.findMany({ where: { id: { in: ids } }, include: { translations: true } })`
- Omit `include` for simple entities (no relations).
- Insert the method right after `findById`.

## Service rules

- Method signature: `async getByIds(ids: string[]): Promise<ReturnType[]>`
- Body: delegates directly to `this.repository.findByIds(ids)` — no extra validation needed.
- Insert the method right after `getById`.

## API route rules

- Route: `POST /api/<entity>/by-ids`
- Uses `POST` (not `GET`) because the body carries the IDs array.
- Reads `body.ids` and validates it is an array; returns `400` with `{ error: 'ids must be an array' }` if not.
- On success returns the array directly with `200`.
- Error fallback message: `'Failed to fetch <entity>s'`.
- Service is instantiated once at file scope: `const service = new <Entity>Service()`.
- Import path uses the path alias: `@/backend/features/<entity>`.

See [references/templates.md](references/templates.md) for complete copy-paste code.
