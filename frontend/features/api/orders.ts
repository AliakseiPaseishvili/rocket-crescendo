import type {
  AdminOrder,
  OrderFilter,
  OrderStatus,
  PaginatedAdminOrders,
  PaginatedUserOrders,
} from '@/backend/features/order';
import type { PaginationFilter } from '@/backend/types';

import { HttpMethod, RequestApiType, RequestMap } from './types';

const ORDER_API_ROUTES = {
  ORDERS: '/api/orders',
  MY_ORDERS: '/api/orders/mine',
  ORDER_STATUS: '/api/orders/:id/status',
} as const;

export type OrderApiTypes = {
  getOrders: RequestApiType<undefined, undefined, OrderFilter | undefined, PaginatedAdminOrders>;
  getMyOrders: RequestApiType<undefined, undefined, PaginationFilter | undefined, PaginatedUserOrders>;
  updateOrderStatus: RequestApiType<{ status: OrderStatus }, { id: string }, undefined, AdminOrder>;
};

export const ORDER_REQUEST_MAP: RequestMap<OrderApiTypes> = {
  getOrders: { url: ORDER_API_ROUTES.ORDERS, method: HttpMethod.GET },
  getMyOrders: { url: ORDER_API_ROUTES.MY_ORDERS, method: HttpMethod.GET },
  updateOrderStatus: { url: ORDER_API_ROUTES.ORDER_STATUS, method: HttpMethod.PATCH },
};
