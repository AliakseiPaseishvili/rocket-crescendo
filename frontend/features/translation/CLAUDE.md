# translation feature

i18n infrastructure — language config, routing, message loading, and shared translation utilities/components used across features.

## Structure

```
translation/
  components/
    LanguageSelector.tsx        # Dropdown to switch active language; rewrites the URL's lng segment
    TranslationTabTrigger.tsx   # Tab trigger for a single language with an error indicator dot
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
    next-intl.d.ts              # TypeScript augmentation for next-intl message types
  messages/
    en.json                     # English translations
    fr.json                     # French translations
    ru.json                     # Russian translations
  constants.ts                  # supportedLngs, languageLabels, fallbackLng
  types.ts                      # SUPPORTED_LANGUAGE enum (EN | FR | RU)
  index.ts                      # Barrel export: supportedLngs, fallbackLng, languageLabels, SUPPORTED_LANGUAGE, usePickTranslation
```

## Types & constants

| Export | Value |
|---|---|
| `SUPPORTED_LANGUAGE` | enum — `EN = 'en'`, `FR = 'fr'`, `RU = 'ru'` |
| `supportedLngs` | `['en', 'fr', 'ru']` (const tuple) |
| `fallbackLng` | `'en'` |
| `languageLabels` | `{ en: 'English', fr: 'Français', ru: 'Русский' }` |

## Key patterns

- **`pickTranslation`** — pure util: given a `translations` array and `locale`, returns the matching entry, then falls back to `fallbackLng`, then `[0]`.
- **`usePickTranslation`** — client hook wrapping `pickTranslation` with `useLocale()`. Used in components that need the current-locale translation of an entity (e.g. a product or category).
- **`TranslationTabTrigger`** — renders a shadcn `TabsTrigger` for one language and shows a red dot when `hasError` is true. Used inside form tab lists (categories, products) to flag validation errors per language.
- **`LanguageSelector`** — dropdown that reads the current locale via `useLocale()` and navigates by rewriting `pathname.split('/')[1]` with the selected language.
- **`i18n/request.ts`** — wired into Next.js via `next-intl/server`; imports the correct `messages/<locale>.json` dynamically for server components.
- **`i18n/navigation.ts`** — re-exports locale-aware navigation primitives; import from here instead of `next/navigation` in most cases.

## Adding a new language

1. Add the value to `SUPPORTED_LANGUAGE` in [types.ts](types.ts).
2. Add it to `supportedLngs` and `languageLabels` in [constants.ts](constants.ts).
3. Create `messages/<lng>.json` mirroring the keys from [messages/en.json](messages/en.json).

## Adding a new translation key

1. Add the key to [messages/en.json](messages/en.json), [messages/fr.json](messages/fr.json), and [messages/ru.json](messages/ru.json).
2. If using TypeScript strict types (via `next-intl.d.ts`), the type will update automatically from the JSON shape.
