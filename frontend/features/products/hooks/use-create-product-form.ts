'use client';

import { useForm } from 'react-hook-form';

import type { ProductCreateInput } from '@/backend/types';
import { supportedLngs } from '@/frontend/features/translation';

import { useCreateProduct } from './use-create-product';

type LngKey = (typeof supportedLngs)[number];

export type ProductFormValues = {
  favorite: boolean;
} & {
  [K in LngKey as `${K}_name`]: string;
} & {
  [K in LngKey as `${K}_description`]: string;
};

export function useCreateProductForm() {
  const defaultValues = {
    favorite: false,
    ...Object.fromEntries(
      supportedLngs.flatMap((lng) => [
        [`${lng}_name`, ''],
        [`${lng}_description`, ''],
      ])
    ),
  } as ProductFormValues;

  const form = useForm<ProductFormValues>({ defaultValues });

  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { mutate, isPending, isSuccess, error } = useCreateProduct();

  const onSubmit = handleSubmit((data) => {
    const payload: ProductCreateInput = {
      favorite: data.favorite,
      translations: supportedLngs.map((lng) => ({
        language: lng,
        name: data[`${lng}_name` as keyof ProductFormValues] as string,
        description: data[`${lng}_description` as keyof ProductFormValues] as string,
      })),
    };
    mutate(payload, { onSuccess: () => reset() });
  });

  return {
    register,
    control,
    errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
  };
}
