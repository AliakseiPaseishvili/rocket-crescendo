'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { PRODUCTS_QUERY_KEY } from '../constants';

export function useProduct(id: number) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: () => api.getProduct({ params: { id } }),
  });
}
