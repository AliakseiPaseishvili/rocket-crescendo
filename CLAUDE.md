# rocket-crescendo

A Next.js 16 e-commerce/landing site for "Cyber Shop: Rocket Crescendo" — books and merch.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack in dev)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui (via `frontend/components/ui/`)
- **i18n**: i18next + react-i18next, with SSR support
- **Database**: PostgreSQL via Prisma (generated client at `backend/app/generated/prisma/`)
- **Data fetching**: TanStack Query (React Query)

## Project structure

```
app/
  page.tsx                          # Root redirect (middleware handles routing)
  [lng]/
    layout.tsx                      # Per-language root layout
    page.tsx                        # Landing page entry
    admin/products/create/page.tsx  # Admin: create product page
  api/products/                     # REST API routes (GET, POST, GET/:id, PUT/:id, DELETE/:id)
  globals.css

frontend/
  components/ui/        # shadcn/ui components
  features/             # Feature-based structure (see Features below)
  lib/utils.ts          # cn() helper (clsx + tailwind-merge)
  utils/is-server-side.ts

backend/
  prisma/               # Prisma schema + client singleton (PostgreSQL)
  app/generated/prisma/ # Generated Prisma client
  repositories/         # DB access layer
  services/             # Business logic layer

proxy.ts                # Next.js middleware: redirects bare paths to /{lng}/…
```

### Frontend Features

Each feature lives in `frontend/features/<feature>/` and follows this structure:

```
feature/
  components/     # React components
  hooks/          # Custom hooks (not all features have this)
  constants.ts    # Feature-level constants (not all features have this)
  index.ts        # Barrel export
```

Features: `api`, `cart`, `footer`, `header`, `landing`, `nav`, `products`, `react-query`, `translation`

## Path aliases

`@/*` maps to the repo root. Use `@/frontend/…`, `@/app/…` etc.

## i18n

- Supported languages: `en`, `fr`, `ru` (defined in `frontend/features/translation/constants.ts`)
- All routes are prefixed: `/en/…`, `/fr/…`, `/ru/…`
- Middleware in `proxy.ts` detects language from cookie → Accept-Language header → fallback `en` and redirects
- To add a language: add to `supportedLngs` in `constants.ts`, add locale JSON under `locales/<lng>/`
- Translation namespaces per locale: `common`, `cart`, `footer`, `metadata`, `nav`, `product`
- Access via `useTranslation('common')` (client) or `initI18next(lng, 'common')` (server); pass multiple namespaces as an array

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

## Conventions

- Feature code lives in `frontend/features/<feature>/`; export via barrel `index.ts`
- New shadcn components go in `frontend/components/ui/`
- Client components use `'use client'` directive; server components are default (no directive)
- i18n metadata is generated server-side in layout via `generateMetadata`
- Backend follows repository → service pattern; API routes delegate to `ProductService`
- Prisma schema is in `backend/prisma/schema.prisma`; run `npx prisma generate` after schema changes
