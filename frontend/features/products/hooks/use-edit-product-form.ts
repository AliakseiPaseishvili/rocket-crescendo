'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import type { ProductWithTranslations } from '@/backend/features/product';
import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

import { ProductFormValues } from '../types';
import { useUpdateProduct } from './use-update-product';

export function useEditProductForm(product: ProductWithTranslations, onSuccess?: () => void) {
  const t = useTranslations('common');
  const tProduct = useTranslations('product');

  const schema = useMemo(
    () =>
      yup.object({
        favorite: yup.boolean().required(),
        categoryId: yup.number().required(tProduct('categoryRequired')).min(1, tProduct('categoryRequired')),
        translations: yup.array(
          yup.object({
            language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
            name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
            description: yup.string().required(t('descriptionRequired')).min(10, t('descriptionMinLength')),
          })
        ).required(),
      }),
    [t, tProduct]
  );

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
  };

  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useUpdateProduct();

  const onSubmit = handleSubmit((body) => {
    mutate({ params: { id: product.id }, body }, { onSuccess });
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
