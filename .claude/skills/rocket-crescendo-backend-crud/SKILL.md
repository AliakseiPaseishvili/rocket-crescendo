---
name: rocket-crescendo-backend-crud
description: Scaffolds full backend CRUD for a new entity in the rocket-crescendo project. Use this skill whenever the user asks to add a new entity, data model, resource, or backend feature — including things like "add a Category model", "create CRUD for orders", "I need an API for X", or "scaffold a new backend feature". Triggers on any request to create Prisma models, repositories, services, or API routes in this project.
---

# Rocket Crescendo — Backend CRUD Scaffold Skill

Scaffolds the full backend stack for a new entity following the repository → service → API route pattern used throughout this project. Full copy-paste templates: see [references/templates.md](references/templates.md).

## File locations

| File | Path |
|---|---|
| Prisma schema | `backend/prisma/schema.prisma` |
| Types | `backend/features/<entity>/types.ts` |
| Repository | `backend/features/<entity>/<Entity>.repository.ts` |
| Service | `backend/features/<entity>/<Entity>.service.ts` |
| Feature barrel | `backend/features/<entity>/index.ts` |
| API collection route | `app/api/<entity>/route.ts` |
| API single-item route | `app/api/<entity>/[id]/route.ts` |

## Workflow

Before writing any code, clarify with the user:
- Entity name (e.g. "Category", "Order")
- Fields and their types
- Whether it has **related records** (e.g. translations, line items) — this drives whether to use `include` clauses and the atomic replace pattern on update
- Any filterable fields for the list endpoint

Then execute in order:

1. **Add Prisma model(s)** to `backend/prisma/schema.prisma`
2. **Run `npx prisma generate`** — required after every schema change
3. **Create** `backend/features/<entity>/types.ts`
4. **Create** `backend/features/<entity>/<Entity>.repository.ts`
5. **Create** `backend/features/<entity>/<Entity>.service.ts`
6. **Create** `backend/features/<entity>/index.ts`
7. **Create** `app/api/<entity>/route.ts`
8. **Create** `app/api/<entity>/[id]/route.ts`

## Naming conventions

| Context | Convention | Example |
|---|---|---|
| Class / type names | PascalCase | `CategoryService`, `CategoryWithRelations` |
| Prisma model calls | camelCase | `prisma.category.findMany()` |
| Feature directory | kebab-case | `backend/features/category/` |
| API route directory | kebab-case | `app/api/category/` |

## Prisma schema rules

- Primary key: `id String @id @default(uuid())`
- Foreign keys: use `onDelete: Cascade` on the child relation
- For i18n translation tables: `@@unique([entityId, language])`
- Run `npx prisma generate` after every schema change — the generated client is at `backend/app/generated/prisma/`

## Types rules (`types.ts`)

- Import base types from `../../app/generated/prisma/models`
- Re-export `<Entity>Model` (and `<Entity>TranslationModel` if relevant)
- Define `<Entity>WithRelations` — the full shape including nested records
- Define `<Entity>CreateInput` and `<Entity>UpdateInput` (derived from generated base types)
- Define `<Entity>Filter` — optional fields for list filtering
- For simple entities (no relations): types are simpler — just CreateInput, UpdateInput, Filter

## Repository rules (`<Entity>.repository.ts`)

- Class `<Entity>Repository`
- `findAll` builds `where` object conditionally from `filter` argument
- `findMany` / `findUnique` / `create` / `update` / `delete` all use `include: { relations: true }` when the entity has related records; omit `include` for simple entities
- Update uses the **atomic replace pattern** for relations: `{ deleteMany: {}, create: data.relations }` — this replaces all related records in one transaction
- Imports Prisma singleton: `import prisma from '../../prisma/prisma'`

## Service rules (`<Entity>.service.ts`)

- Class `<Entity>Service` with `private readonly repository: <Entity>Repository` instantiated in constructor
- `getById` throws `Error(\`<Entity> with id ${id} not found\`)` when the record is null — this exact wording lets API routes detect 404 vs 400
- `create` validates required fields and throws descriptive errors — validation belongs in the service, not the repository
- `update` and `delete` always call `getById` first to ensure a 404 is thrown before attempting DB writes

## API route rules

- **Import path**: always `@/backend/features/<entity>` (path alias, not relative)
- **Collection route** (`route.ts`): `GET` (list with optional filter from `searchParams`) + `POST` (create, returns 201)
- **Single-item route** (`[id]/route.ts`): `GET` (by id) + `PATCH` (update, not PUT) + `DELETE` (returns 204, no body)
- **Next.js 16 async params**: `type Params = { params: Promise<{ id: string }> }` — always `await params`
- **Error detection**: check `message.includes('not found')` → 404, else 400 (for PATCH/DELETE)
- Service is instantiated once per file: `const service = new <Entity>Service()`

See [references/templates.md](references/templates.md) for complete copy-paste templates for every file.
