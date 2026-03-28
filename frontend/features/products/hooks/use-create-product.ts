'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/frontend/constants';
import { api } from '@/frontend/features/api';
import { useRouter } from '@/i18n/navigation';

import { PRODUCTS_QUERY_KEY } from '../constants';


export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      router.push(ROUTES.ADMIN_PRODUCTS);
    },
  });
}
