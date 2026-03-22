'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/frontend/features/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
}
