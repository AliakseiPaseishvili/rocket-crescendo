'use client';

import { Star } from 'lucide-react';

import type { ProductModel } from '@/backend/types';
import { Button } from '@/frontend/components/ui/button';

import { useUpdateProduct } from '../hooks';

interface ProductProps {
  product: ProductModel;
}

export const Product = ({ product }: ProductProps) => {
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleFavoriteToggle = () => {
    updateProduct({ id: product.id, favorite: !product.favorite });
  };

  return (
    <li className="relative flex flex-col gap-1 rounded-lg border border-border bg-muted p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7"
        disabled={isPending}
        onClick={handleFavoriteToggle}
      >
        <Star
          className={product.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
          size={16}
        />
      </Button>

      <span className="font-semibold text-foreground pr-8">{product.name}</span>
      <span className="text-sm text-muted-foreground">{product.description}</span>
    </li>
  );
};
