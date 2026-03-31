'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useEditCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}
