'use client';

import { useTranslations } from 'next-intl';

import { FormInputField } from '@/frontend/components/FormInputField';
import { Button } from '@/frontend/components/ui/button';
import { Tabs, TabsList } from '@/frontend/components/ui/tabs';

import { useCreateCategoryForm } from '../hooks';
import { CategoryTranslationTabContent } from './CategoryTranslationTabContent';
import { CategoryTranslationTabTrigger } from './CategoryTranslationTabTrigger';

export const CreateCategoryForm = () => {
  const tCategory = useTranslations('category');
  const tCommon = useTranslations('common');
  const {
    register,
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

      <FormInputField
        id="color"
        label={tCommon('color')}
        placeholder={tCategory('colorPlaceholder')}
        errorMessage={errors.color?.message}
        registration={register('color')}
      />

      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <CategoryTranslationTabTrigger
              language={field.language}
              index={index}
              key={field.id}
              errors={errors}
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
