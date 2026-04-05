# nav feature

Navigation feature — desktop and mobile nav menus with i18n-translated link labels.

## Structure

```
nav/
  components/
    NavMenu.tsx         # Desktop navigation using shadcn NavigationMenu
    NavMobileMenu.tsx   # Mobile navigation as a vertical flex list
    index.ts            # Barrel export for components
  constants.ts          # NAV_ITEMS: array of { key, href } nav entries
  index.ts              # Barrel export: NavMenu, NavMobileMenu
```

## Key patterns

- **`NAV_ITEMS`** in `constants.ts` drives both menus. Each item has a `key` (used as i18n lookup under the `nav` namespace) and an `href`.
- **Route vs anchor detection** — `NavMenu` checks `href.startsWith('/')` to decide whether to render a next-intl `<Link>` (for page routes) or a plain `<NavigationMenuLink>` (for in-page anchors like `#hero`).
- **Mobile menu** — `NavMobileMenu` renders plain `<a>` tags and accepts an optional `onSelect` callback (e.g. to close a drawer after a link is tapped).
- Both components are `'use client'` and use `useTranslations('nav')` from next-intl.

## Adding a nav item

1. Add `{ key: 'myKey', href: '/path-or-#anchor' }` to `NAV_ITEMS` in [constants.ts](constants.ts).
2. Add the translation string `"myKey": "..."` under the `nav` key in each language file at `frontend/features/translation/messages/<lng>.json`.
