import { OrderStatus } from "../../app/generated/prisma/enums";

export const DEFAULT_PAGINATION_OFFSET = 0;
export const DEFAULT_PAGINATION_LIMIT = 20;
export const MAX_PAGINATION_LIMIT = 100;

/** The only order statuses surfaced in the admin dashboard. */
export const ADMIN_ORDER_STATUSES = [
  OrderStatus.PAID,
  OrderStatus.PREPARED,
  OrderStatus.SENT,
] as const;
