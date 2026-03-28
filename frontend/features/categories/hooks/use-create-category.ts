'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/frontend/constants';
import { api } from '@/frontend/features/api';
import { useRouter } from '@/frontend/features/translation/i18n/navigation';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      router.push(ROUTES.ADMIN_CATEGORIES);
    },
  });
}
