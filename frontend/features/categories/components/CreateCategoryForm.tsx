'use client';

import { useTranslations } from 'next-intl';

import { useCreateCategoryForm } from '../hooks';
import { CategoryFormFields } from './CategoryFormFields';

export const CreateCategoryForm = () => {
  const tCategory = useTranslations('category');
  const tCommon = useTranslations('common');
  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } =
    useCreateCategoryForm();

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{tCategory('createCategory')}</h2>
      <CategoryFormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        submitLabel={tCategory('createCategory')}
        pendingLabel={tCommon('creating')}
        successMessage={tCategory('createSuccess')}
      />
    </div>
  );
};
