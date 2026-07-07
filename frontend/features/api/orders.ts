import type {
  AdminOrder,
  OrderFilter,
  OrderStatus,
  PaginatedAdminOrders,
} from '@/backend/features/order';

import { HttpMethod, RequestApiType, RequestMap } from './types';

const ORDER_API_ROUTES = {
  ORDERS: '/api/orders',
  ORDER_STATUS: '/api/orders/:id/status',
} as const;

export type OrderApiTypes = {
  getOrders: RequestApiType<undefined, undefined, OrderFilter | undefined, PaginatedAdminOrders>;
  updateOrderStatus: RequestApiType<{ status: OrderStatus }, { id: string }, undefined, AdminOrder>;
};

export const ORDER_REQUEST_MAP: RequestMap<OrderApiTypes> = {
  getOrders: { url: ORDER_API_ROUTES.ORDERS, method: HttpMethod.GET },
  updateOrderStatus: { url: ORDER_API_ROUTES.ORDER_STATUS, method: HttpMethod.PATCH },
};
