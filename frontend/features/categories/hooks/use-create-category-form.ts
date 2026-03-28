'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

import { CategoryFormValues } from '../types';
import { useCreateCategory } from './use-create-category';

export function useCreateCategoryForm() {
  const t = useTranslations('common');
  const tCategory = useTranslations('category');

  const schema = useMemo(
    () =>
      yup.object({
        color: yup.string().required(tCategory('colorRequired')).min(1, tCategory('colorRequired')),
        translations: yup.array(
          yup.object({
            language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
            name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
          })
        ).required(),
      }),
    [t, tCategory]
  );

  const defaultValues: CategoryFormValues = {
    color: '',
    translations: supportedLngs.map((lng) => ({
      language: lng,
      name: '',
    })),
  };

  const form = useForm<CategoryFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreateCategory();

  const onSubmit = handleSubmit((body) => {
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
