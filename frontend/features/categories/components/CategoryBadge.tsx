'use client';

import { FC } from 'react';

import type { CategoryWithTranslations } from '@/backend/features/category';
import { usePickTranslation } from '@/frontend/features/translation';

interface CategoryBadgeProps {
  category: CategoryWithTranslations;
}

export const CategoryBadge: FC<CategoryBadgeProps> = ({ category }) => {
  const translation = usePickTranslation(category.translations);

  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium">
      <span
        className="size-2 rounded-full shrink-0"
        style={{ backgroundColor: category.color }}
      />
      {translation?.name}
    </span>
  );
};
