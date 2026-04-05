# cart feature

Cart UI feature — currently a slide-in drawer triggered from the header.

## Structure

```
cart/
  components/
    CartButton.tsx  # Trigger button + drawer shell
    index.ts        # Barrel export for components
  index.ts          # Barrel export: CartButton
```

## Components

### CartButton

Client component (`'use client'`) that renders a ghost icon button which opens a right-side `Drawer` (shadcn/ui).

- Uses `lucide-react` icon: `ShoppingCart`
- Uses `useTranslations('cart')` for i18n; keys: `openLabel`, `title`, `empty`
- The drawer body currently shows an empty-state placeholder (icon + message)
- No cart state management exists yet — items, quantities, and totals are not implemented

## Extending the cart

- Add cart state (e.g. Zustand store or React context) before wiring up item management
- Place item list, quantity controls, and totals inside `DrawerContent` in `CartButton.tsx`
- Add new translation keys to all language files under `frontend/features/translation/messages/`
