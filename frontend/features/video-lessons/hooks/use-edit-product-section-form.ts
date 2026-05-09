'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import type { ProductSectionWithTranslations } from '@/backend/features/product-section';
import { supportedLngs } from '@/frontend/features/translation';

import { ProductSectionFormValues } from '../types';
import { useProductSectionFormSchema } from './use-product-section-form-schema';
import { useUpdateProductSection } from './use-update-product-section';

export function useEditProductSectionForm(
  section: ProductSectionWithTranslations,
  productId: string,
  onSuccess?: () => void,
) {
  const schema = useProductSectionFormSchema();

  const defaultValues: ProductSectionFormValues = {
    translations: supportedLngs.map((lng) => {
      const existing = section.translations.find((tr) => tr.language === lng);
      return { language: lng, name: existing?.name ?? '' };
    }),
  };

  const { handleSubmit, register, control, formState: { errors } } = useForm<ProductSectionFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useUpdateProductSection(productId);

  const onSubmit = handleSubmit(({ translations }) => {
    mutate({ params: { id: section.id }, body: { translations } }, { onSuccess });
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
