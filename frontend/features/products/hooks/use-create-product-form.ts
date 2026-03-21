'use client';

import { useForm } from 'react-hook-form';
import { useCreateProduct, type CreateProductInput } from './use-create-product';

export function useCreateProductForm() {
  const form = useForm<CreateProductInput>({
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
