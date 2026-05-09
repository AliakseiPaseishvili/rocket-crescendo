'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import { supportedLngs } from '@/frontend/features/translation';

import { ProductSectionFormValues } from '../types';
import { useCreateProductSection } from './use-create-product-section';
import { useProductSectionFormSchema } from './use-product-section-form-schema';

export function useCreateProductSectionForm(productId: string, onSuccess?: () => void) {
  const schema = useProductSectionFormSchema();

  const defaultValues: ProductSectionFormValues = {
    translations: supportedLngs.map((lng) => ({ language: lng, name: '' })),
  };

  const { handleSubmit, register, control, reset, formState: { errors } } = useForm<ProductSectionFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreateProductSection(productId);

  const onSubmit = handleSubmit(({ translations }) => {
    mutate(
      { body: { productId, translations } },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      },
    );
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
