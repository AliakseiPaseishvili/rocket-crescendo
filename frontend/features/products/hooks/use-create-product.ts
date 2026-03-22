'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { productsApi } from '@/frontend/features/api';


export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
