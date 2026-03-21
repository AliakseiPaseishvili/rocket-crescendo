---
name: rocket-crescendo-feature-component
description: Creates components, hooks, constants, and barrel files in the rocket-crescendo Next.js project's feature-based architecture. Use when the user asks to create a component, hook, or other file inside frontend/features/, add a new feature, or scaffold any frontend feature code following the project's conventions (TypeScript strict, Tailwind CSS v4, shadcn/ui, i18next, TanStack Query).
---

# Rocket Crescendo — Feature Component Skill

Conventions for `frontend/features/<feature>/`. Full templates: see [references/templates.md](references/templates.md).

## File locations

| File type | Path |
|---|---|
| Component | `frontend/features/<feature>/components/<Name>.tsx` |
| Hook | `frontend/features/<feature>/hooks/use-<name>.ts` |
| Constants | `frontend/features/<feature>/constants.ts` |
| Feature barrel | `frontend/features/<feature>/index.ts` |
| Components barrel | `frontend/features/<feature>/components/index.ts` |

## Workflow

1. Identify or create the feature directory.
2. Create the component file (see Component rules below).
3. If data fetching is needed: create mutation hook → form hook (see templates.md).
4. Export from `components/index.ts`, then re-export from feature `index.ts`.
5. If new translation keys are needed, add to **all three** locale files: `locales/en/`, `locales/fr/`, `locales/ru/`.

## Component rules

- Add `'use client'` at the top, when client logic is applied. Hooks in component is client logic.
- Named export: `export const <Name> = ...` (PascalCase, no default export).
- Props: TypeScript `interface <Name>Props` for complex props; inline type for simple/single-use.
- i18n: `useTranslation('namespace')` or `useTranslation(['ns1', 'ns2'])`. Multi-namespace keys: `t('ns:key')`.
- Namespaces: `common`, `nav`, `cart`, `footer`, `product`, `metadata`.
- Server components: use `initI18next(lng, 'namespace')` from `@/frontend/features/translation`.

## shadcn/ui rules

- Import from `@/frontend/components/ui/<name>`.
- Use compound component patterns (e.g., `Drawer` + `DrawerTrigger` + `DrawerContent`).
- Use `asChild` to pass-through rendering.
- Icons: lucide-react with explicit sizes (`h-5 w-5`, `size-4`).

## Tailwind rules

- Semantic tokens only: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `text-destructive`.
- Responsive: `hidden md:flex`, `md:hidden`, `sm:grid-cols-3`.
- Interactive: `hover:bg-muted transition-colors`.
- Glass effect: `backdrop-blur bg-background/95`.

## Barrel / export rules

- Feature `index.ts`: export components, hooks, and `export type` for TypeScript-only types.
- `components/index.ts`: re-export all public components.
- Always use `export type` for type-only re-exports.

## Constants rules

- Use `as const` for arrays.
- Type-safe records: `Record<(typeof ARRAY)[number], Value>`.
- Place in `feature/constants.ts`.

## Path aliases

Always use `@/` prefix: `@/frontend/features/`, `@/frontend/components/ui/`, `@/app/`.

See [references/templates.md](references/templates.md) for complete copy-paste templates.
