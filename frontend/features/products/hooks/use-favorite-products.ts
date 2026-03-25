'use client';

import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/frontend/features/api';

import { FAVORITE_PRODUCTS_QUERY_KEY } from '../constants';

export function useFavoriteProducts() {
  return useQuery({
    queryKey: [FAVORITE_PRODUCTS_QUERY_KEY],
    queryFn: productsApi.getFavorites,
  });
}
