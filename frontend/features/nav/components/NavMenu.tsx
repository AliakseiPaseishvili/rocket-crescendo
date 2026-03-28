'use client';

import { useTranslations } from 'next-intl';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/frontend/components/ui/navigation-menu';
import { Link } from '@/frontend/features/translation/i18n/navigation';

import { NAV_ITEMS } from '../constants';

export const NavMenu = () => {
  const t = useTranslations('nav');

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAV_ITEMS.map(({ key, href }) => {
          const isRoute = href.startsWith('/');
          return (
            <NavigationMenuItem key={href}>
              {isRoute ? (
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={href}>{t(key)}</Link>
                </NavigationMenuLink>
              ) : (
                <NavigationMenuLink href={href} className={navigationMenuTriggerStyle()}>
                  {t(key)}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
