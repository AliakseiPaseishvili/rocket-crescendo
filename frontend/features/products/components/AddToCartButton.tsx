'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useCallback } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { useCartStore } from '@/frontend/features/cart';

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

export const AddToCartButton: FC<AddToCartButtonProps> = ({
  productId,
  className,
}) => {
  const t = useTranslations('cart');
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = useCallback(() => {
    addItem(productId);
  }, [addItem, productId]);

  return (
    <Button size="sm" className={className} onClick={handleAdd}>
      <ShoppingCart className="h-4 w-4" />
      {t('add')}
    </Button>
  );
};
