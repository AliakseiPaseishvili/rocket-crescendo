'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from '@/frontend/features/auth';

import { USERS_QUERY_KEY } from '../constants';

type SetRoleArgs = { userId: string; role: 'admin' | 'user' };

export function useSetUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: SetRoleArgs) =>
      authClient.admin.setRole({ userId, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}
