'use client';

import { useQuery } from '@tanstack/react-query';

import { ProductFilter } from '@/backend/types';
import { productsApi } from '@/frontend/features/api';

import { PRODUCTS_QUERY_KEY } from '../constants';


export function useProducts(filter?: ProductFilter) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, filter],
    queryFn: () => productsApi.getAll(filter),
  });
}
