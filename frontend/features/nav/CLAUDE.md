# nav feature

Site navigation for the main landing page — desktop horizontal menu and mobile vertical list. Both menus are driven by a single `NAV_ITEMS` constant and hide the admin link from non-admin users.

## Structure

```
nav/
  components/
    NavMenu.tsx         # Desktop nav using shadcn NavigationMenu; route vs anchor detection; admin-gated
    NavMobileMenu.tsx   # Mobile nav as a vertical flex list; plain <a> tags; accepts onSelect callback
    index.ts            # Barrel export for components
  constants.ts          # NAV_ITEMS — array of { key, href } entries
  index.ts              # Barrel: NavMenu, NavMobileMenu
```

## Key patterns

- **`NAV_ITEMS`** in `constants.ts` is the single source of truth for both menus. Each entry is `{ key: string; href: string }` where `key` is the i18n lookup under the `nav` namespace and `href` is either a page route (`/admin`) or an in-page anchor (`#hero`).
- **Admin gating** — both `NavMenu` and `NavMobileMenu` call `useSession()` from the auth feature and filter out the `admin` item unless `session?.user?.role === 'admin'`. The item is also hidden while the session is still loading (`isPending`) to prevent a flash.
- **Route vs anchor detection** (`NavMenu` only) — items whose `href` starts with `'/'` use the locale-aware `<Link>` component from next-intl wrapped in `<NavigationMenuLink asChild>`. Items whose `href` starts with `'#'` use a plain `<NavigationMenuLink href={...}>` (external anchor, no client-side routing needed).
- **`NavMobileMenu` `onSelect`** — accepts an optional `() => void` callback, typically used by a parent sheet/drawer to close itself after the user taps a link. Mobile items use plain `<a>` tags so the browser performs a full scroll-to-anchor or navigation.

## How to extend

### Adding a nav item

1. Add `{ key: 'myKey', href: '/path-or-#anchor' }` to `NAV_ITEMS` in `constants.ts`.
2. Add the translation string `"myKey": "..."` under the `nav` key in each `frontend/features/translation/messages/<lng>.json`.
3. If the item should be admin-only, add a condition in both `NavMenu` and `NavMobileMenu`'s `.filter()` call matching your new key.
