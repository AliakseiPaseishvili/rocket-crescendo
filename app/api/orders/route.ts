import { NextResponse } from "next/server";

import { withAdminAuth } from "@/backend/features/auth";
import {
  ADMIN_ORDER_STATUSES,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  MAX_PAGINATION_LIMIT,
  OrderService,
  OrderStatus,
} from "@/backend/features/order";
import type { OrderFilter } from "@/backend/features/order";

const service = new OrderService();

const isAdminStatus = (value: string): value is OrderStatus =>
  (ADMIN_ORDER_STATUSES as readonly string[]).includes(value);

export const GET = withAdminAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const offsetParam = searchParams.get("offset");
    const limitParam = searchParams.get("limit");
    const filter: OrderFilter = {};
    if (statusParam && isAdminStatus(statusParam)) filter.status = statusParam;
    if (offsetParam !== null)
      filter.offset = Math.max(
        0,
        parseInt(offsetParam, 10) || DEFAULT_PAGINATION_OFFSET,
      );
    if (limitParam !== null)
      filter.limit = Math.min(
        MAX_PAGINATION_LIMIT,
        Math.max(1, parseInt(limitParam, 10) || DEFAULT_PAGINATION_LIMIT),
      );
    const result = await service.getOrdersForAdmin(
      Object.keys(filter).length ? filter : undefined,
    );
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
