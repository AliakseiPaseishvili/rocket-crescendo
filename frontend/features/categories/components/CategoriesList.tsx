'use client';

import { useTranslations } from 'next-intl';

import { useCategories } from '../hooks';
import { Category } from './Category';
import { CreateCategoryLink } from './CreateCategoryLink';

export const CategoriesList = () => {
  const t = useTranslations('category');
  const { data: categories, isPending, isError } = useCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-2">
        <h1 className="text-3xl font-bold">{t('categories')}</h1>
        <CreateCategoryLink />
      </div>

      {isPending && <p className="text-muted-foreground">{t('loadingCategories')}</p>}
      {isError && <p className="text-destructive">{t('errorLoadingCategories')}</p>}
      {!isPending && !isError && !categories?.length && (
        <p className="text-muted-foreground">{t('noCategories')}</p>
      )}

      {!!categories?.length && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </ul>
      )}
    </div>
  );
};
