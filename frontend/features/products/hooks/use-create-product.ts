'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/frontend/features/api';
import type { ProductCreateInput } from '@/backend/types';

export type { ProductCreateInput };

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
