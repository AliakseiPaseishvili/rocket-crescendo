'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { PRODUCT_SECTIONS_QUERY_KEY } from '../constants';

export function useProductSections(productId: string) {
  return useQuery({
    queryKey: [PRODUCT_SECTIONS_QUERY_KEY, productId],
    queryFn: () => api.getProductSections({ query: { productId } }),
    enabled: !!productId,
  });
}
