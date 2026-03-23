'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

import { ROUTES } from '@/frontend/constants';
import { productsApi } from '@/frontend/features/api';
import { fillUrl } from '@/frontend/utils/fill-url';

import { PRODUCTS_QUERY_KEY } from '../constants';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { lng } = useParams<{ lng: string }>();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      router.push(fillUrl({ url: ROUTES.ADMIN_PRODUCTS, params: { lng } }));
    },
  });
}
