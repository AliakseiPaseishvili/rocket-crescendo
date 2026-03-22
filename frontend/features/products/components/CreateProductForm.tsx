'use client';

import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/frontend/components/ui/button';
import { Checkbox } from '@/frontend/components/ui/checkbox';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Textarea } from '@/frontend/components/ui/textarea';

import { useCreateProductForm } from '../hooks';

export const CreateProductForm = () => {
  const { t } = useTranslation(['product', 'common']);
  const { register, control, errors, onSubmit, isPending, isSuccess, error } = useCreateProductForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{t('product:createProduct')}</h2>

      <div className="flex flex-col gap-1">
        <Label htmlFor="name">{t('common:name')}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t('product:namePlaceholder')}
          {...register('name', { required: t('common:nameRequired') })}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">{t('common:description')}</Label>
        <Textarea
          id="description"
          placeholder={t('product:descriptionPlaceholder')}
          rows={3}
          {...register('description', { required: t('common:descriptionRequired') })}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Controller
          name="favorite"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="favorite"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="favorite" className="cursor-pointer">
          {t('product:favorite')}
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">{t('product:createSuccess')}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? t('common:creating') : t('product:createProduct')}
      </Button>
    </form>
  );
};
