'use client';

import { useTranslations } from 'next-intl';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/frontend/components/ui/navigation-menu';

import { NAV_ITEMS } from '../constants';

export const NavMenu = () => {
  const t = useTranslations('nav');

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
