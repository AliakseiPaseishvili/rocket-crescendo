'use client';

import { useQuery } from '@tanstack/react-query';

import { authClient } from '@/frontend/features/auth';

import { USERS_PAGE_LIMIT, USERS_QUERY_KEY } from '../constants';

export function useUsersQuery(offset = 0) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, offset],
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUsers({
        query: { limit: USERS_PAGE_LIMIT, offset },
      });
      if (error) throw new Error(error.message ?? 'Failed to fetch users');
      return data;
    },
  });
}
