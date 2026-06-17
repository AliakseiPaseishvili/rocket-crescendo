# landing feature

Landing page feature — renders the full public-facing page as a series of full-screen sections.

## Structure

```
landing/
  components/
    Landing.tsx           # Root component: composes all landing sections in order
    LandingSection.tsx    # Reusable full-screen section with a translated title and optional children
    HeroSection.tsx       # Hero section: displays the first favorite product
    ShopSection.tsx       # Shop section: carousel of non-favorite products
    SubscribeSection.tsx  # Newsletter sign-up section: wraps subscription feature's SubscribeNewsletter
    index.ts              # Barrel export for components
  index.ts                # Barrel export: Landing
```

## Key patterns

- **`LandingSection`** is the shared layout primitive. It takes an `id` (used as the anchor for nav links), a `titleKey` (key from the `nav` translation namespace), and optional `children`. All sections use it.
- **`Landing`** composes the page: `HeroSection` → `ShopSection` → `game` → `about` → `SubscribeSection` → `support`. The static sections (`game`, `about`, `support`) are bare `LandingSection` instances with no children.
- **`SubscribeSection`** — thin wrapper that renders the subscription feature's `SubscribeNewsletter` (`@/frontend/features/subscription`) as children of `LandingSection id="subscribe" titleKey="subscribe"`. All subscribe logic (anon form vs. logged-in button) lives in the subscription feature, not here.
- **Hero** — fetches products filtered to `{ favorite: true }` via `useProducts` and renders the first result in a `Product` card with actions hidden.
- **Shop** — fetches products filtered to `{ favorite: false }` via `useProducts` and renders them in a shadcn `Carousel`. Shows a "coming soon" message if the list is empty.
- **Category pre-fetching** — both `HeroSection` and `ShopSection` call `useCategoriesByIds` with the product `categoryId`s so category data is in the React Query cache before `Product` cards render.
- All components are `'use client'` because they rely on `useTranslations` and React Query hooks.

## Adding a new landing section

1. If the section needs a translated title, add the key to the `nav` namespace in each `frontend/features/translation/messages/<lng>.json`.
2. Add a `<LandingSection id="..." titleKey="...">` call inside [Landing.tsx](components/Landing.tsx).
3. If the section has interactive content, create a dedicated component (e.g. `MySection.tsx`) and render it as children of `LandingSection`.
