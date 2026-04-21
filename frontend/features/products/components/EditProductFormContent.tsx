'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import type { ProductWithTranslations } from '@/backend/features/product';

import { useEditProductForm } from '../hooks';
import { ProductFormFields } from './ProductFormFields';
import { ProductMediaPanel } from './ProductMediaPanel';

interface EditProductFormContentProps {
  product: ProductWithTranslations;
}

export const EditProductFormContent: FC<EditProductFormContentProps> = ({ product }) => {
  const tProduct = useTranslations('product');
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
    additionalImageFields,
    addAdditionalImages,
    removeAdditionalImage,
  } = useEditProductForm(product);

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-bold">{tProduct('editProduct')}</h1>
      <div className="grid w-full gap-8 md:grid-cols-[320px_1fr]">
        <div className="overflow-y-auto md:max-h-[calc(100vh-200px)]">
          <ProductMediaPanel
            control={control}
            additionalImages={additionalImageFields}
            onSelectAdditionalImages={addAdditionalImages}
            onRemoveAdditionalImage={removeAdditionalImage}
          />
        </div>
        <ProductFormFields
          register={register}
          control={control}
          fields={fields}
          errors={errors}
          onSubmit={onSubmit}
          isPending={isPending}
          isSuccess={isSuccess}
          error={error}
          submitLabel={tProduct('editProduct')}
          pendingLabel={tCommon('saving')}
          successMessage={tProduct('editSuccess')}
        />
      </div>
    </div>
  );
};
