'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { PRODUCT_SECTIONS_QUERY_KEY } from '../constants';

export function useCreateProductSection(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createProductSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_SECTIONS_QUERY_KEY, productId] });
    },
  });
}
