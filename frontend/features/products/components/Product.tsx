"use client";

import { Star, Trash2 } from "lucide-react";
import { useCallback } from "react";

import type { ProductModel } from "@/backend/types";
import { Button } from "@/frontend/components/ui/button";

import { useDeleteProduct, useUpdateProduct } from "../hooks";

interface ProductProps {
  product: ProductModel;
}

export const Product = ({ product }: ProductProps) => {
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const isPending = isUpdating || isDeleting;

  const handleFavoriteToggle = useCallback(() => {
    updateProduct({ id: product.id, favorite: !product.favorite });
  }, [product.favorite, product.id, updateProduct]);

  const handleDelete = useCallback(() => {
    deleteProduct(product.id);
  }, [deleteProduct, product.id]);

  return (
    <li className="relative flex flex-col gap-1 rounded-lg border border-border bg-muted p-4">
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={isPending}
          onClick={handleFavoriteToggle}
        >
          <Star
            className={
              product.favorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }
            size={16}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={isPending}
          onClick={handleDelete}
        >
          <Trash2 className="text-muted-foreground" size={16} />
        </Button>
      </div>

      <span className="font-semibold text-foreground pr-8">{product.name}</span>
      <span className="text-sm text-muted-foreground">
        {product.description}
      </span>
    </li>
  );
};
