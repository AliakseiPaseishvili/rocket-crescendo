'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

import { ROUTES } from '@/frontend/constants';
import { api } from '@/frontend/features/api';
import { formUrlParams } from '@/frontend/utils/form-url';

import { PRODUCTS_QUERY_KEY } from '../constants';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { lng } = useParams<{ lng: string }>();

  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      router.push(formUrlParams({ url: ROUTES.ADMIN_PRODUCTS, params: { lng } }));
    },
  });
}
