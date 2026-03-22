'use client';

import { useForm } from 'react-hook-form';

import type { ProductCreateInput } from '@/backend/types';

import { useCreateProduct } from './use-create-product';

export function useCreateProductForm() {
  const form = useForm<ProductCreateInput>({
    defaultValues: { name: '', description: '', favorite: false },
  });

  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { mutate, isPending, isSuccess, error } = useCreateProduct();

  const onSubmit = handleSubmit((data) => {
    mutate(data, { onSuccess: () => reset() });
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
