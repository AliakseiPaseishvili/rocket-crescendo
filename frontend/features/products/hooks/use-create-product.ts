'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, type CreateProductInput } from '@/frontend/features/api';

export type { CreateProductInput };

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
