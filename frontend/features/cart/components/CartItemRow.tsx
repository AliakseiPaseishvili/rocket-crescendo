'use client';

import { ImageIcon, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

import { ProductFileRole } from '@/backend/app/generated/prisma/enums';
import type { ProductWithTranslations } from '@/backend/features/product';
import { Button } from '@/frontend/components/ui/button';
import { usePickTranslation } from '@/frontend/features/translation';

import { useCartStore } from '../store/useCartStore';

interface CartItemRowProps {
  product: ProductWithTranslations;
  quantity: number;
}

export const CartItemRow: FC<CartItemRowProps> = ({ product, quantity }) => {
  const translation = usePickTranslation(product.translations);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const image =
    product.productFiles.find((f) => f.role === ProductFileRole.MAIN_IMAGE)
      ?.file ?? null;

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {image ? (
          <Image
            src={image.fileUrl}
            alt={image.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="text-muted-foreground" size={20} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium">{translation?.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => removeItem(product.id)}
          >
            <Trash2 className="text-muted-foreground" size={14} />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-6"
              onClick={() => setQuantity(product.id, quantity - 1)}
            >
              <Minus size={12} />
            </Button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-6"
              onClick={() => setQuantity(product.id, quantity + 1)}
            >
              <Plus size={12} />
            </Button>
          </div>
          <span className="text-sm font-semibold">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
