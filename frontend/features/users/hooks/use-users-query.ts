'use client';

import { authClient } from '@/frontend/features/auth';
import { useOffsetPagination } from '@/frontend/features/react-query';

import { USERS_PAGE_LIMIT, USERS_QUERY_KEY } from '../constants';

export function useUsersQuery() {
  return useOffsetPagination({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async (offset) => {
      const { data, error } = await authClient.admin.listUsers({
        query: { limit: USERS_PAGE_LIMIT, offset },
      });
      if (error) throw new Error(error.message ?? 'Failed to fetch users');
      return {
        items: data!.users,
        total: data!.total,
        offset,
        limit: USERS_PAGE_LIMIT,
      };
    },
  });
}
