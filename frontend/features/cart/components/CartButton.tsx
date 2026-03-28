'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/frontend/components/ui/drawer';

export const CartButton = () => {
  const t = useTranslations('cart');

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('openLabel')}>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t('title')}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-muted-foreground">
          <ShoppingCart className="h-10 w-10 opacity-40" />
          <p className="text-sm">{t('empty')}</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
