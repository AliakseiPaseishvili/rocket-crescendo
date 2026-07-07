'use client';

import type { OrderStatus } from '@/backend/features/order';
import { api } from '@/frontend/features/api';
import { useOffsetPagination } from '@/frontend/features/react-query';

import { ORDERS_PAGE_LIMIT, ORDERS_QUERY_KEY } from '../constants';

export function useOrdersQuery(status?: OrderStatus) {
  return useOffsetPagination({
    queryKey: [ORDERS_QUERY_KEY, status],
    queryFn: (offset) =>
      api.getOrders({ query: { status, offset, limit: ORDERS_PAGE_LIMIT } }),
  });
}
