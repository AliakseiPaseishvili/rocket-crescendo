'use client';

import { useMutation } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

export function useSubscribe() {
  const { mutate, isPending, error, data } = useMutation({
    mutationFn: (email: string) => api.subscribe({ body: { email } }),
  });

  return {
    subscribe: mutate,
    isPending,
    error,
    status: data?.status,
  };
}
