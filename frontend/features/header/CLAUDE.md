# header feature

Site header — sticky top bar with logo, desktop nav slot, language selector, right actions slot, and a mobile burger menu.

## Structure

```
header/
  components/
    Header.tsx        # Sticky header shell with logo, navItems slot, rightActions slot, and BurgerMenu
    BurgerMenu.tsx    # Mobile-only toggle: opens a full-screen overlay with NavMobileMenu + LanguageSelector
    index.ts          # Barrel export for components
  index.ts            # Barrel export: Header
```

## Key patterns

- **Slot-based composition** — `Header` accepts `navItems` and `rightActions` as `ReactNode` props so callers control what goes in the nav and action areas without coupling the header to specific features.
- **Responsive layout** — desktop nav and `LanguageSelector` are hidden below `md`; `BurgerMenu` is hidden at `md` and above. `rightActions` is always visible.
- **BurgerMenu portal** — the mobile overlay is rendered via `createPortal` into `document.body` so it sits above all other content (`z-40`, `top-14` to clear the sticky header).
- **Scroll lock** — `BurgerMenu` sets `document.body.style.overflow = 'hidden'` while open and restores it on close or unmount.
- **Logo link** — uses the i18n-aware `Link` from `translation/i18n/navigation` pointing to `ROUTES.BASE`.
