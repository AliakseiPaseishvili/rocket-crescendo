'use client';

import { useForm } from 'react-hook-form';
import { useCreateProduct, type ProductCreateInput } from './use-create-product';

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
