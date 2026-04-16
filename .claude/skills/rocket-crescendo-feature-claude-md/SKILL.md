---
name: rocket-crescendo-feature-claude-md
description: Writes or updates a CLAUDE.md documentation file inside a feature folder in the rocket-crescendo project. Use this skill whenever the user asks to "document a feature", "write a CLAUDE.md for X", "add docs to the feature folder", or after finishing any task that creates or significantly changes files inside frontend/features/<name>/ or backend/features/<name>/. Always invoke this skill when completing work on a feature — do not skip it just because the task was small.
---

# Rocket Crescendo — Feature CLAUDE.md Skill

Write (or update) a `CLAUDE.md` file inside a feature folder that gives future contributors an instant, accurate map of the feature. The two real examples below are the gold standard — match their depth and concreteness.

## When to write

- User explicitly asks to document a feature.
- You just finished creating or meaningfully changing files in `frontend/features/<name>/` or `backend/features/<name>/`.
- A feature folder exists but has no `CLAUDE.md` yet.

Do **not** write one for shared utility folders (`frontend/components/ui/`, `frontend/lib/`, etc.).

## Step-by-step process

1. **Read the entire feature folder.** List every file in `frontend/features/<name>/` (or `backend/features/<name>/`) including all subdirectories. Read each file — components, hooks, types, constants, index barrels, the works. Do not write anything until you have read them all.
2. **Identify the feature type** — frontend or backend — and follow the matching template below.
3. **Write the file** to `<feature-folder>/CLAUDE.md`. Overwrite any existing one.
4. Be concrete: name actual file names, actual exported type names, actual query key constants, actual mutation hooks. Never use vague placeholders like `<ComponentName>` or `<queryKey>`.

---

## Frontend feature template

Target: `frontend/features/<name>/CLAUDE.md`

```markdown
# <feature name> feature

<One-paragraph summary: what the feature does, who uses it (admin / customer), and what operations it covers.>

## Structure

\`\`\`
<name>/
  components/
    <FileName>.tsx              # <what it renders / what it does>
    ...
    index.ts                    # Barrel export for components
  hooks/
    use-<name>.ts               # useQuery / useMutation: <brief description>
    ...
    index.ts                    # Barrel export for hooks
  types.ts                      # <TypeName1>, <TypeName2>
  constants.ts                  # <CONSTANT_NAME>, <CONSTANT_NAME2>
  index.ts                      # Barrel export: <ExportedThing1>, <ExportedThing2>
\`\`\`

## Types

| Type | Shape |
|---|---|
| `<TypeName>` | `{ field: type; ... }` |

<Note any types imported from backend, e.g. "`FooWithBar` comes from `@/backend/features/foo`.">

## Query keys

<Omit this section entirely if the feature has no TanStack Query constants.>

| Constant | Value | Used by |
|---|---|---|
| `<CONSTANT>` | `'<value>'` | `useHookA`, `useHookB` |

## Key patterns

- **`<ComponentName>`** — <non-obvious design decision: why it exists, what it accepts, how it connects to other pieces>
- **<Pattern name>** — <explanation, e.g. how translations are handled, how modals close on success, why a particular hook wires two others together>
- ...

## How to extend

<Title this after the most common extension task, e.g. "Adding a new <entity> field".>

1. <Step 1 — usually: add field to the form type in `types.ts`>
2. <Step 2 — usually: add Yup validation rule>
3. <Step 3 — usually: add form control to the shared form component>
4. <Step 4 — usually: update backend schema + run `npx prisma generate`>
5. <Step 5 — usually: update API payload type in `frontend/features/api/<resource>.ts`>
```

---

## Backend feature template

Target: `backend/features/<name>/CLAUDE.md`

```markdown
# <Feature Name> Feature

<One sentence: what entity this manages and what operations it provides.>

## Structure

\`\`\`
backend/features/<name>/
  <Name>.repository.ts  # DB access via Prisma (<key detail, e.g. "always includes translations">)
  <Name>.service.ts     # Business logic: <what validation or orchestration lives here>
  types.ts              # Types: <TypeName1>, <TypeName2>, <TypeName3>
  index.ts              # Barrel export
\`\`\`

## Key concepts

- **<Data model detail>** — <e.g. how relations are fetched, what's always included>
- **<Update strategy>** — <e.g. whether patch is partial or full-replace>
- **<Special operations>** — <e.g. bulk lookup, soft-delete, cascade behaviour>
- **Validation** (in service, not repository):
  - <rule 1>
  - <rule 2>

## Types

| Type | Purpose |
|---|---|
| `<TypeName>` | `{ ... }` — <standard return shape / input shape> |

## Usage

\`\`\`ts
import { <Name>Service } from '@/backend/features/<name>';

const service = new <Name>Service();

// Create
await service.create({ ... });

// Get all
await service.getAll();

// Get by ID
await service.getById(id);

// Update
await service.update(id, { ... });

// Delete
await service.delete(id);
\`\`\`
```

---

## Quality bar — what makes a great entry

Read the two reference examples before writing. The things that make them valuable:

- **Component annotations are one-liners that tell you the *role*, not just the name.** "Admin list of all categories with create link" is better than "list component". "Dialog wrapper for editing an existing category" is better than "edit modal".
- **Hook annotations name the React Query operation and the side-effect.** "useMutation: DELETE category by id, invalidates list" is better than "delete hook".
- **Key patterns explain the *why* and *how*, not the *what*.** "EditCategoryModal opens a Dialog and passes an onSuccess callback to useEditCategoryForm to close the dialog after a successful mutation" — that tells you the wiring, not just that it exists.
- **Types tables show actual shapes**, not just names.
- **Query keys table names every hook that uses each key**, so you know what gets invalidated.
- **How to extend is a real, ordered checklist** — someone should be able to follow it without reading any other file.

If a section doesn't apply (e.g. no query keys, no types), omit it rather than leaving it empty.
