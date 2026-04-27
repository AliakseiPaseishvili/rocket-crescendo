# rocket-crescendo

A Next.js 16 e-commerce/landing site for "Cyber Shop: Rocket Crescendo" — books and merch.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui (via `frontend/components/ui/`)
- **i18n**: next-intl with language-prefixed routes
- **Database**: PostgreSQL via Prisma 7 (generated client at `backend/app/generated/prisma/`)
- **Data fetching**: TanStack Query (React Query)
- **Forms**: react-hook-form + Yup validation
- **File storage**: AWS S3 (via `@aws-sdk/client-s3`)

## Project structure

```
app/
  page.tsx                              # Root redirect (middleware handles routing)
  [lng]/
    layout.tsx                          # Per-language root layout
    (main)/
      layout.tsx
      page.tsx                          # Landing page entry
    (admin)/
      layout.tsx
      admin/
        page.tsx                        # Admin dashboard
        products/create/page.tsx        # Admin: create product
        categories/create/page.tsx      # Admin: create category
        files/page.tsx                  # Admin: file manager (list + upload)
  api/
    products/                           # REST API: GET, POST, GET/:id, PUT/:id, DELETE/:id
    category/                           # REST API: GET, POST, GET/:id, PUT/:id, DELETE/:id + by-ids/
    file/                               # REST API: GET (list), POST (upload), GET/:id, PATCH/:id, DELETE/:id
  globals.css

frontend/
  components/ui/        # shadcn/ui components
  features/             # Feature-based structure (see Features below)
  lib/utils.ts          # cn() helper (clsx + tailwind-merge)
  utils/is-server-side.ts

backend/
  prisma/               # Prisma schema + migrations
  app/generated/prisma/ # Generated Prisma client
  features/             # Feature modules (repository + service per feature)
    category/           # Category.repository.ts, Category.service.ts
    file/               # File.repository.ts, File.service.ts, S3Storage.Adapter.ts
    product/            # Product.repository.ts, Product.service.ts

proxy.ts                # Next.js middleware: redirects bare paths to /{lng}/…
```

### Frontend Features

Each feature lives in `frontend/features/<feature>/` and follows this structure:

```
feature/
  components/     # React components
  hooks/          # Custom hooks (not all features have this)
  constants.ts    # Feature-level constants (not all features have this)
  types.ts        # Feature-level types (not all features have this)
  index.ts        # Barrel export
```

Features: `admin`, `api`, `cart`, `categories`, `files`, `footer`, `header`, `landing`, `nav`, `products`, `react-query`, `translation`

### Database models

- `Product` — has `categoryId`, `favorite` flag; related to `ProductTranslation[]`
- `ProductTranslation` — `productId`, `language`, `name`, `description`; unique on `(productId, language)`
- `Category` — has `color`; related to `Product[]` and `CategoryTranslation[]`
- `CategoryTranslation` — `categoryId`, `language`, `name`; unique on `(categoryId, language)`
- `File` — `fileId`, `fileUrl`, `fileType` (enum: `IMAGE | VIDEO`), `name`

## Path aliases

`@/*` maps to the repo root. Use `@/frontend/…`, `@/app/…`, `@/backend/…` etc.

## i18n

- Supported languages: `en`, `fr`, `ru` (defined in `frontend/features/translation/constants.ts`)
- All routes are prefixed: `/en/…`, `/fr/…`, `/ru/…`
- Middleware in `proxy.ts` detects language and redirects
- Translation messages live in `frontend/features/translation/messages/<lng>.json` (one file per language)
- i18n routing config: `frontend/features/translation/i18n/routing.ts`
- To add a language: add to `supportedLngs` in `constants.ts`, add `<lng>.json` under `messages/`
- Access via `useTranslations()` (client) or next-intl server helpers; routing via `frontend/features/translation/i18n/navigation.ts`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Conventions

- Feature code lives in `frontend/features/<feature>/`; export via barrel `index.ts`
- New shadcn components go in `frontend/components/ui/`
- Client components use `'use client'` directive; server components are default (no directive)
- i18n metadata is generated server-side in layout via `generateMetadata`
- Backend follows repository → service pattern per feature module under `backend/features/`
- API routes delegate to the relevant service (e.g. `ProductService`, `CategoryService`, `FileService`)
- `executeRequest` in `frontend/features/api/utils.ts` supports both JSON bodies and `FormData`; pass `FormData` as `body` and it skips `Content-Type` so the browser sets the multipart boundary automatically
- File images are rendered with Next.js `<Image>`; allowed hostnames come from `R2_PUBLIC_URL` via `remotePatterns` in `next.config.ts`
- Prisma schema is in `backend/prisma/schema.prisma`; run `npx prisma generate` after schema changes

## TypeScript rules

- **Never use `any`** — use `unknown`, proper generics, or narrowed types instead; `eslint-disable @typescript-eslint/no-explicit-any` comments are not allowed
- Each component and its props type live together in one file; if a component is complex enough to warrant helpers, each helper component and its own props type also live in their own dedicated file
- Types shared between multiple components within a feature go in `types.ts` at the feature root (e.g. `frontend/features/auth/types.ts`); types shared between multiple features or used by a common component go in `types.ts` alongside that common component
