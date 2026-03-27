'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

import { useCreateProduct } from './use-create-product';
import { ProductFormValues } from '../types';

export function useCreateProductForm() {
  const { t } = useTranslation('common');

  const schema = useMemo(
    () =>
      yup.object({
        favorite: yup.boolean().required(),
        translations: yup.array(
          yup.object({
            language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
            name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
            description: yup.string().required(t('descriptionRequired')).min(10, t('descriptionMinLength')),
          })
        ).required(),
      }),
    [t]
  );

  const defaultValues: ProductFormValues = {
    favorite: false,
    translations: supportedLngs.map((lng) => ({
      language: lng,
      name: '',
      description: '',
    })),
  };

  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreateProduct();

  const onSubmit = handleSubmit((body ) => {
    mutate({ body }, { onSuccess: () => reset() });
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
