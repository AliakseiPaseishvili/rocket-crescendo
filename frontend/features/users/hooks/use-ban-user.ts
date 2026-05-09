'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from '@/frontend/features/auth';

import { USERS_QUERY_KEY } from '../constants';

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      authClient.admin.banUser({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}
