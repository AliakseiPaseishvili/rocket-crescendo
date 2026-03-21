'use client';

import { useForm } from 'react-hook-form';
import { useCreateProduct, type CreateProductInput } from './use-create-product';

export function useCreateProductForm() {
  const form = useForm<CreateProductInput>({
    defaultValues: { name: '', description: '', favorite: false },
  });

  const { mutate, isPending, isSuccess, error } = useCreateProduct();

  const onSubmit = form.handleSubmit((data) => {
    mutate(data, { onSuccess: () => form.reset() });
  });

  return {
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
  };
}
