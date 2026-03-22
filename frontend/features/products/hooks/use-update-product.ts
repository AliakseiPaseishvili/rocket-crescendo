'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { productsApi } from '@/frontend/features/api';

import { PRODUCTS_QUERY_KEY } from '../constants';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}
