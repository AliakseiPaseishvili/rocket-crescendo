# rocket-crescendo

A Next.js 16 e-commerce/landing site for "Cyber Shop: Rocket Crescendo" — books and merch.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack in dev)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui (via `frontend/components/ui/`)
- **i18n**: i18next + react-i18next, with SSR support

## Project structure

```
app/
  page.tsx              # Root redirect (returns null, middleware handles routing)
  [lng]/
    layout.tsx          # Per-language root layout (fonts, I18nProvider)
    page.tsx            # Landing page entry
  globals.css

frontend/
  components/ui/        # shadcn/ui components (button, dropdown-menu, …)
  features/
    landing/            # Landing feature (Landing component)
    translation/        # i18n feature
      constants.ts      # supportedLngs, languageLabels, fallbackLng
      i18n.ts           # Client-side i18next init
      i18n-server.ts    # Server-side i18next init
      locales/          # JSON translation files (en, fr, ru)
      components/       # I18nProvider, LanguageSelector
  lib/utils.ts          # cn() helper (clsx + tailwind-merge)
  utils/is-server-side.ts

proxy.ts                # Next.js middleware: redirects bare paths to /{lng}/…
```

## Path aliases

`@/*` maps to the repo root. Use `@/frontend/…`, `@/app/…` etc.

## i18n

- Supported languages: `en`, `fr`, `ru` (defined in `frontend/features/translation/constants.ts`)
- All routes are prefixed: `/en/…`, `/fr/…`, `/ru/…`
- Middleware in `proxy.ts` detects language from cookie → Accept-Language header → fallback `en` and redirects
- To add a language: add to `supportedLngs` in `constants.ts`, add locale JSON under `locales/<lng>/`
- Translation keys live in `common.json` per locale; access via `useTranslation('common')` (client) or `initI18next(lng, 'common')` (server)

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
