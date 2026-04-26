# translation feature

i18n infrastructure — language config, routing, message loading, and shared translation utilities/components used across features.

## Structure

```
translation/
  components/
    LanguageSelector.tsx        # Dropdown to switch active language; rewrites the URL's lng segment
    TranslationTabTrigger.tsx   # Tab trigger for a single language with a red error-indicator dot
    index.ts                    # Barrel export for components
  hooks/
    use-pick-translation.ts     # usePickTranslation<T>: picks the best translation for the active locale
    index.ts                    # Barrel export for hooks
  utils/
    pick-translation.ts         # pickTranslation(): locale → fallback → first match
  i18n/
    routing.ts                  # next-intl routing config (locales + defaultLocale)
    navigation.ts               # Re-exports Link, redirect, usePathname, useRouter, getPathname
    request.ts                  # getRequestConfig: loads per-locale message JSON for server components
    next-intl.d.ts              # TypeScript augmentation: AppConfig.Messages typed from en.json
  messages/
    en.json                     # English translations
    fr.json                     # French translations
    ru.json                     # Russian translations
  constants.ts                  # supportedLngs, languageLabels, fallbackLng
  types.ts                      # SUPPORTED_LANGUAGE enum (EN | FR | RU)
  index.ts                      # Barrel export: supportedLngs, fallbackLng, languageLabels, SUPPORTED_LANGUAGE, usePickTranslation
```

## Key patterns

- **`pickTranslation`** — pure util: given a `translations` array and `locale`, returns the matching entry, then falls back to `fallbackLng` (`'en'`), then `translations[0]`.
- **`usePickTranslation`** — client hook wrapping `pickTranslation` with `useLocale()`. Used in components that need the current-locale translation of an entity (e.g. a product or category).
- **`TranslationTabTrigger`** — renders a shadcn `TabsTrigger` for one language and shows a red dot when `hasError` is true. Used inside form tab lists (categories, products) to flag validation errors per language.
- **`LanguageSelector`** — dropdown that reads the current locale via `useLocale()` and navigates by rewriting `pathname.split('/')[1]` with the selected language.
- **`i18n/request.ts`** — wired into Next.js via `next-intl/server`; imports the correct `messages/<locale>.json` dynamically for server components.
- **`i18n/navigation.ts`** — re-exports locale-aware navigation primitives; import from here instead of `next/navigation` in most cases.
- **Type safety** — `next-intl.d.ts` augments `AppConfig.Messages` with the shape of `en.json`. All `useTranslations()` / `t()` calls are fully typed; passing an unknown key is a compile error.

## Message namespaces

| Namespace | Purpose |
|---|---|
| `common` | Shared labels used across multiple features (name, description, color, saving states) |
| `nav` | Top navigation link labels |
| `footer` | Footer copy, legal, links |
| `cart` | Shopping cart UI strings |
| `metadata` | Page `<title>` and `<meta description>` |
| `admin` | Admin dashboard section descriptions |
| `category` | Category list, create/edit form, validation messages |
| `file` | File manager list, upload dialog, file picker drawer, load-more button |
| `breadcrumb` | Breadcrumb segment labels |
| `product` | Product list, create/edit form, media panel labels |
| `auth` | Sign-in, sign-up, and sign-out UI: titles, labels, placeholders, validation messages, server error fallbacks. `auth.signOut.submit` is used by `SignOutButton`. |

## Notable `breadcrumb` namespace keys

| Key | Value (en) | Used by |
|---|---|---|
| `breadcrumb.create` | `"Create"` | `BREADCRUMBS_ADMIN_PRODUCTS_CREATE`, `BREADCRUMBS_ADMIN_CATEGORIES_CREATE` |
| `breadcrumb.edit` | `"Edit"` | `BREADCRUMBS_ADMIN_PRODUCTS_EDIT` |

## Notable `file` namespace keys

| Key | Value (en) | Used by |
|---|---|---|
| `file.loadMore` | `"Load more"` | `FileList`, `FilePickerDrawer` — "Load more" button for offset pagination |
| `file.loading` | `"Loading..."` | `FilePickerDrawer` — loading state text and pagination button while fetching |
| `file.selectCount` | `"Select ({count})"` | `FilePickerDrawer` — confirm button with selection count interpolation |

## Adding a new language

1. Add the value to `SUPPORTED_LANGUAGE` in `types.ts`.
2. Add it to `supportedLngs` and `languageLabels` in `constants.ts`.
3. Create `messages/<lng>.json` mirroring every key from `messages/en.json`.

## Adding a new translation key

1. Add the key under the appropriate namespace in `messages/en.json`, `messages/fr.json`, and `messages/ru.json`.
2. The TypeScript types update automatically from the `en.json` shape via `next-intl.d.ts` — no manual type changes needed.
