"use client";

import { FC } from "react";

import {
  Breadcrumbs,
  createBreadcrumbsAdminProductsVideoLessons,
} from "@/frontend/features/breadcrumbs";
import { useProduct } from "@/frontend/features/products";
import { usePickTranslation } from "@/frontend/features/translation";

interface VideoLessonsBreadcrumbsProps {
  productId: string;
}

export const VideoLessonsBreadcrumbs: FC<VideoLessonsBreadcrumbsProps> = ({
  productId,
}) => {
  const { data: product, isLoading } = useProduct(productId);
  const translation = usePickTranslation(product?.translations ?? []);

  return (
    <Breadcrumbs
      items={createBreadcrumbsAdminProductsVideoLessons(
        productId,
        translation?.name,
        isLoading,
      )}
    />
  );
};
