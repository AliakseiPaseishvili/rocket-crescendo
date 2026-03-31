'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import type { CategoryWithTranslations } from '@/backend/features/category';
import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

import { CategoryFormValues } from '../types';
import { useEditCategory } from './use-edit-category';

export function useEditCategoryForm(category: CategoryWithTranslations, onSuccess?: () => void) {
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
    color: category.color,
    translations: supportedLngs.map((lng) => {
      const existing = category.translations.find((tr) => tr.language === lng);
      return {
        language: lng,
        name: existing?.name ?? '',
      };
    }),
  };

  const form = useForm<CategoryFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useEditCategory();

  const onSubmit = handleSubmit((body) => {
    mutate({ params: { id: category.id }, body }, { onSuccess });
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
