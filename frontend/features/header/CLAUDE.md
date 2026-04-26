# header feature

Site header — sticky top bar with logo, desktop nav slot, language selector, right actions slot, and a mobile burger menu. Used by the main layout (`app/[lng]/(main)/layout.tsx`); `BurgerMenu` is only shown on mobile/tablet when `navItems` are present.

## Structure

```
header/
  components/
    Header.tsx      # Sticky header shell: logo, navItems slot, LanguageSelector (desktop), rightActions slot, BurgerMenu (mobile)
    BurgerMenu.tsx  # Mobile-only toggle: opens a full-screen overlay with NavMobileMenu, LanguageSelector, and AuthStatus
    index.ts        # Barrel export for components
  index.ts          # Barrel export: Header
```

## Key patterns

- **Slot-based composition** — `Header` accepts `navItems?: ReactNode` and `rightActions?: ReactNode` so callers control what goes in the nav and action areas without coupling the header to specific features. The main layout passes `<NavMenu />` as `navItems` and `<><AuthStatus /><CartButton /></>` as `rightActions`.
- **Responsive layout** — desktop nav and `LanguageSelector` are hidden below `md`; `BurgerMenu` is hidden at `md` and above. `rightActions` is always visible. `BurgerMenu` is only rendered when `navItems` is provided. `LanguageSelector`, `rightActions`, and `BurgerMenu` share a single `flex-row` wrapper div on the right side of the header.
- **BurgerMenu portal** — the mobile overlay is rendered via `createPortal` into `document.body` so it sits above all other content (`z-40`, `top-14` to clear the sticky header height).
- **Scroll lock** — `BurgerMenu` sets `document.body.style.overflow = 'hidden'` while the overlay is open and restores it on close or unmount via the `useEffect` cleanup.
- **`AuthStatus` in mobile overlay** — `BurgerMenu` renders `AuthStatus` (from `@/frontend/features/auth`) directly in the overlay so mobile users see either the sign-in button or their avatar without the overlay needing to know about `rightActions` passed to `Header`.
- **Auth in mobile overlay** — `BurgerMenu` calls `useSession()` and renders `<SignInButton />` above `<NavMobileMenu />` when the user is unauthenticated, and `<SignOutButton />` at the bottom of the overlay when `session?.user` is truthy. `AuthStatus` is no longer rendered inside `BurgerMenu`; it is passed via `rightActions` in the layout instead.
- **Logo link** — uses the i18n-aware `Link` from `translation/i18n/navigation` pointing to `ROUTES.BASE`.

## How to extend

### Adding a new action to the mobile overlay

1. Import the component into `BurgerMenu.tsx`.
2. Place it inside the portal `<div>` alongside `<LanguageSelector />` and `<AuthStatus />`.
3. If the action should also appear on desktop, pass it via the `rightActions` prop at the call site in the layout instead.

### Adding a new desktop-only element

1. Import the component into `Header.tsx`.
2. Render it inside the `hidden md:flex` wrapper alongside `<LanguageSelector />`, or add a new slot prop to `HeaderProps` if it needs to be caller-controlled.
