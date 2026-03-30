'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { api } from '@/frontend/features/api';

import { CATEGORIES_BY_IDS, CATEGORY_DETAILS } from '../constants';

export function useCategoriesByIds(ids: number[]) {
  const queryClient = useQueryClient();

  const uniqueIds = useMemo(
    () => [...new Set(ids)].filter((id) => !queryClient.getQueryData([CATEGORY_DETAILS, id])),
    [ids, queryClient],
  );

  return useQuery({
    queryKey: [CATEGORIES_BY_IDS, uniqueIds],
    queryFn: async () => {
      const categories = await api.getCategoriesByIds({ body: { ids: uniqueIds } });

      categories.forEach((category) => {
        queryClient.setQueryData([CATEGORY_DETAILS, category.id], category);
      });

      return categories;
    },
    enabled: uniqueIds.length > 0,
  });
}
