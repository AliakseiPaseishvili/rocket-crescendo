'use client';

import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/frontend/features/api';

import { PRODUCTS_QUERY_KEY } from '../constants';

export function useProducts() {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: productsApi.getAll,
  });
}
