'use client';

import { Trash2 } from 'lucide-react';
import { FC, useCallback } from 'react';

import type { CategoryWithTranslations } from '@/backend/features/category';
import { Button } from '@/frontend/components/ui/button';
import { usePickTranslation } from '@/frontend/features/translation';

import { useDeleteCategory } from '../hooks';
import { EditCategoryModal } from './EditCategoryModal';

interface CategoryProps {
  category: CategoryWithTranslations;
}

export const Category: FC<CategoryProps> = ({ category }) => {
  const { mutate: deleteCategory, isPending } = useDeleteCategory();
  const translation = usePickTranslation(category.translations);

  const handleDelete = useCallback(() => {
    deleteCategory({ params: { id: category.id } });
  }, [deleteCategory, category.id]);

  return (
    <li className="relative flex flex-col gap-1 rounded-lg border border-border bg-muted p-4">
      <div className="absolute top-2 right-2 flex gap-1">
        <EditCategoryModal category={category} disabled={isPending} />
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          disabled={isPending}
          onClick={handleDelete}
        >
          <Trash2 className="text-muted-foreground" size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-2 pr-8">
        <span
          className="size-4 rounded-full border border-border shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-semibold text-foreground">{translation?.name}</span>
      </div>
      <span className="text-xs text-muted-foreground">{category.color}</span>
    </li>
  );
};
