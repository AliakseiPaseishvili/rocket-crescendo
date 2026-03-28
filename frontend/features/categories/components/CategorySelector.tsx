'use client';

import { useLocale, useTranslations } from 'next-intl';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/frontend/components/ui/select';

import { useCategories } from '../hooks';

type CategorySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  error?: string;
};

export const CategorySelector = ({ value, onChange, error }: CategorySelectorProps) => {
  const tProduct = useTranslations('product');
  const tCategory = useTranslations('category');
  const locale = useLocale();
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) return <p className="text-sm text-muted-foreground">{tCategory('loadingCategories')}</p>;
  if (isError) return <p className="text-sm text-destructive">{tCategory('errorLoadingCategories')}</p>;

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={value > 0 ? String(value) : ''}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={tProduct('selectCategory')} />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => {
            const translation =
              category.translations.find((t) => t.language === locale) ??
              category.translations[0];
            return (
              <SelectItem key={category.id} value={String(category.id)}>
                {translation?.name ?? `Category ${category.id}`}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
