'use client';

import { useQuery } from '@tanstack/react-query';

import { CategoryFilter } from '@/backend/features/category';
import { api } from '@/frontend/features/api';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useCategories(query?: CategoryFilter) {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, query],
    queryFn: () => api.getCategories({ query }),
  });
}
