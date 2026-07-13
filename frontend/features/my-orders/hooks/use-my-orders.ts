'use client';

import { api } from '@/frontend/features/api';
import { useOffsetPagination } from '@/frontend/features/react-query';

import { MY_ORDERS_PAGE_LIMIT, MY_ORDERS_QUERY_KEY } from '../constants';

export function useMyOrders() {
  return useOffsetPagination({
    queryKey: [MY_ORDERS_QUERY_KEY],
    queryFn: (offset) =>
      api.getMyOrders({ query: { offset, limit: MY_ORDERS_PAGE_LIMIT } }),
  });
}
