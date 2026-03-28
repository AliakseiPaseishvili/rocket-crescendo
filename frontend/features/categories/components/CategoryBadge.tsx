'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import type { CategoryWithTranslations } from '@/backend/features/category';
import { fallbackLng } from '@/frontend/features/translation';

interface CategoryBadgeProps {
  category: CategoryWithTranslations;
}

export const CategoryBadge: FC<CategoryBadgeProps> = ({ category }) => {
  const { lng } = useParams<{ lng: string }>();

  const translation =
    category.translations.find((t) => t.language === lng) ??
    category.translations.find((t) => t.language === fallbackLng) ??
    category.translations[0];

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium">
      <span
        className="size-2 rounded-full shrink-0"
        style={{ backgroundColor: category.color }}
      />
      {translation?.name}
    </span>
  );
};
