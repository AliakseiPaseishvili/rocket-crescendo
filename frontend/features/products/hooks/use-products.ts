'use client';

import { useQuery } from '@tanstack/react-query';

import { ProductFilter } from '@/backend/features/product';
import { api } from '@/frontend/features/api';

import { PRODUCTS_QUERY_KEY } from '../constants';

export function useProducts(query?: ProductFilter) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, query],
    queryFn: () => api.getProducts({ query }),
  });
}
