'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { PRODUCT_SECTIONS_QUERY_KEY } from '../constants';

export function useDeleteProductSection(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteProductSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_SECTIONS_QUERY_KEY, productId] });
    },
  });
}
