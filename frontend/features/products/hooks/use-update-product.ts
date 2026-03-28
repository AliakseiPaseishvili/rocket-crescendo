'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { PRODUCTS_QUERY_KEY } from '../constants';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}
