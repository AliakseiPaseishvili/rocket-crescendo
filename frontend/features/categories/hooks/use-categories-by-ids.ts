'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useCategoriesByIds(ids: number[]) {
  const uniqueIds = [...new Set(ids)].sort((a, b) => a - b);

  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, 'by-ids', uniqueIds],
    queryFn: () => api.getCategoriesByIds({ body: { ids: uniqueIds } }),
    enabled: uniqueIds.length > 0,
  });
}
