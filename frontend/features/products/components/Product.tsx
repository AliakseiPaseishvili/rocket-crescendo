"use client";

import { Star, Trash2 } from "lucide-react";
import { FC, useCallback } from "react";
import { twMerge } from "tailwind-merge";

import type { CategoryWithTranslations } from "@/backend/features/category";
import type { ProductWithTranslations } from "@/backend/features/product";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { CategoryBadge } from "@/frontend/features/categories/components/CategoryBadge";
import { CATEGORY_DETAILS } from "@/frontend/features/categories/constants";
import { useCacheQuery } from "@/frontend/features/react-query";
import { usePickTranslation } from "@/frontend/features/translation";

import { useDeleteProduct, useUpdateProduct } from "../hooks";

interface ProductProps {
  product: ProductWithTranslations;
  className?: string;
  isHiddenActions?: boolean;
}

export const Product: FC<ProductProps> = ({ product, isHiddenActions, className }) => {
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { data: category } = useCacheQuery<CategoryWithTranslations>({
    queryKey: [CATEGORY_DETAILS, product.categoryId],
  });

  const isPending = isUpdating || isDeleting;

  const translation = usePickTranslation(product.translations);

  const handleFavoriteToggle = useCallback(() => {
    updateProduct({
      params: { id: product.id },
      body: { favorite: !product.favorite },
    });
  }, [product, updateProduct]);

  const handleDelete = useCallback(() => {
    deleteProduct({ params: { id: product.id } });
  }, [deleteProduct, product.id]);

  return (
    <li className={twMerge("relative flex flex-col", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{translation?.name}</CardTitle>
          {!isHiddenActions && (
            <CardAction className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
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
                className="size-7"
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash2 className="text-muted-foreground" size={16} />
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            {translation?.description}
          </span>
          {product.categoryId && (
            category
              ? <CategoryBadge category={category} />
              : <Skeleton className="h-5 w-20 rounded-full" />
          )}
        </CardContent>
      </Card>
    </li>
  );
};
