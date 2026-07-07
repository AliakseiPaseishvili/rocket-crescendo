'use client';

import { FC } from 'react';

import type { ProductWithTranslations } from '@/backend/features/product';
import { usePickTranslation } from '@/frontend/features/translation';

interface CheckoutSummaryRowProps {
  product: ProductWithTranslations;
  quantity: number;
}

export const CheckoutSummaryRow: FC<CheckoutSummaryRowProps> = ({
  product,
  quantity,
}) => {
  const translation = usePickTranslation(product.translations);

  return (
    <div className="flex items-start justify-between gap-2 text-sm">
      <span className="text-muted-foreground">
        {translation?.name}
        <span className="ml-1 text-xs">× {quantity}</span>
      </span>
      <span className="font-medium">
        ${(product.price * quantity).toFixed(2)}
      </span>
    </div>
  );
};
