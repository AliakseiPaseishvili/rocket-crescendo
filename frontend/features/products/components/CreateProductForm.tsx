'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/frontend/components/ui/button';
import { useCreateProductForm } from '../hooks/use-create-product-form';

export const CreateProductForm = () => {
  const { t } = useTranslation(['product', 'common']);
  const { register, errors, onSubmit, isPending, isSuccess, error } = useCreateProductForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{t('product:createProduct')}</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          {t('common:name')}
        </label>
        <input
          id="name"
          type="text"
          placeholder={t('product:namePlaceholder')}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register('name', { required: t('common:nameRequired') })}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          {t('common:description')}
        </label>
        <textarea
          id="description"
          placeholder={t('product:descriptionPlaceholder')}
          rows={3}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          {...register('description', { required: t('common:descriptionRequired') })}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="favorite"
          type="checkbox"
          className="size-4 rounded border border-input accent-primary cursor-pointer"
          {...register('favorite')}
        />
        <label htmlFor="favorite" className="text-sm font-medium cursor-pointer">
          {t('product:favorite')}
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">{t('product:createSuccess')}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? t('common:creating') : t('product:createProduct')}
      </Button>
    </form>
  );
};
