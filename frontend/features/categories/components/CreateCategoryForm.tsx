'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { ColorPicker } from '@/frontend/components/ColorPicker';
import { Button } from '@/frontend/components/ui/button';
import { Tabs, TabsList } from '@/frontend/components/ui/tabs';
import { TranslationTabTrigger } from '@/frontend/features/translation/components';

import { useCreateCategoryForm } from '../hooks';
import { CategoryTranslationTabContent } from './CategoryTranslationTabContent';

export const CreateCategoryForm = () => {
  const tCategory = useTranslations('category');
  const tCommon = useTranslations('common');
  const {
    register,
    control,
    fields,
    errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
  } = useCreateCategoryForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{tCategory('createCategory')}</h2>

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <ColorPicker
            label={tCommon('color')}
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.color?.message}
          />
        )}
      />

      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <TranslationTabTrigger
              language={field.language}
              key={field.id}
              hasError={!!errors.translations?.[index]?.name}
            />
          ))}
        </TabsList>

        {fields.map((field, index) => (
          <CategoryTranslationTabContent
            key={field.id}
            lng={field.language}
            index={index}
            errors={errors}
            register={register}
          />
        ))}
      </Tabs>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && (
        <p className="text-sm text-green-600">{tCategory('createSuccess')}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? tCommon('creating') : tCategory('createCategory')}
      </Button>
    </form>
  );
};
