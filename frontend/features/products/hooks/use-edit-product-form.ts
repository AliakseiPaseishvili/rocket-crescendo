'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import type { ProductWithTranslations } from '@/backend/features/product';
import { supportedLngs } from '@/frontend/features/translation';

import { ProductFormValues } from '../types';
import { useProductFormSchema } from './use-product-form-schema';
import { useUpdateProduct } from './use-update-product';

export function useEditProductForm(product: ProductWithTranslations, onSuccess?: () => void) {
  const schema = useProductFormSchema();

  const defaultValues: ProductFormValues = {
    favorite: product.favorite,
    categoryId: product.categoryId ?? 0,
    translations: supportedLngs.map((lng) => {
      const existing = product.translations.find((tr) => tr.language === lng);
      return {
        language: lng,
        name: existing?.name ?? '',
        description: existing?.description ?? '',
      };
    }),
    mainImage: null,
    video: null,
    additionalImages: [],
  };

  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useUpdateProduct();

  const onSubmit = handleSubmit(({ mainImage: _mi, video: _v, additionalImages: _ai, ...rest }) => {
    mutate({ params: { id: product.id }, body: rest }, { onSuccess });
  });

  return {
    register,
    control,
    fields,
    errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
  };
}
