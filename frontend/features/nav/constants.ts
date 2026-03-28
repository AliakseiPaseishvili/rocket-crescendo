import { ROUTES } from "@/frontend/constants";

export const NAV_ITEMS = [
  { key: 'hero', href: '#hero' },
  { key: 'shop', href: '#shop' },
  { key: 'game', href: '#game' },
  { key: 'aboutUs', href: '#about' },
  { key: 'support', href: '#support' },
  { key: 'admin', href: ROUTES.ADMIN },
] as const;
