'use client';
import { useTranslations } from "next-intl";
import { FC } from "react";

import { CategoryWithTranslations } from "@/backend/features/category";
import { SelectItem } from "@/frontend/components/ui/select";

import { usePickTranslation } from "../../translation";

type CategorySelectItemProps = {
  category: CategoryWithTranslations;
};

export const CategorySelectItem: FC<CategorySelectItemProps> = ({ category }) => {
  const t = useTranslations('category');
  const translation = usePickTranslation(category.translations);
  return (
    <SelectItem key={category.id} value={String(category.id)}>
      {translation?.name ?? t('unknownCategory', { id: category.id })}
    </SelectItem>
  );
};
