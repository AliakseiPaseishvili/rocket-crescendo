'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/frontend/components/ui/navigation-menu';
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { key: 'hero', href: '#hero' },
  { key: 'shop', href: '#shop' },
  { key: 'game', href: '#game' },
  { key: 'aboutUs', href: '#about' },
  { key: 'support', href: '#support' },
] as const;

export const NavMenu = () => {
  const { t } = useTranslation('nav');

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAV_ITEMS.map(({ key, href }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink href={href} className={navigationMenuTriggerStyle()}>
              {t(key)}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
