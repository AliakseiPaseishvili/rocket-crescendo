'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { useCartProducts } from '@/frontend/features/cart';

import { CheckoutSummaryRow } from './CheckoutSummaryRow';

interface CheckoutSummaryProps {
  isValid: boolean;
  isPending: boolean;
  error: Error | null;
}

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({
  isValid,
  isPending,
  error,
}) => {
  const t = useTranslations('checkout');
  const { items, products } = useCartProducts();

  const productById = new Map(products.map((p) => [p.id, p]));
  const total = items.reduce((sum, item) => {
    const product = productById.get(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="h-fit rounded-lg border p-4 md:sticky md:top-24">
      <h2 className="mb-4 text-lg font-semibold">{t('orderSummary')}</h2>

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const product = productById.get(item.productId);
          if (!product) return null;
          return (
            <CheckoutSummaryRow
              key={item.productId}
              product={product}
              quantity={item.quantity}
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">{t('total')}</span>
        <span className="text-base font-semibold">${total.toFixed(2)}</span>
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive">{error.message}</p>
      )}

      <Button
        type="submit"
        className="mt-4 w-full"
        disabled={!isValid || isPending || items.length === 0}
      >
        {isPending ? t('processing') : t('completePurchase')}
      </Button>
    </div>
  );
};
