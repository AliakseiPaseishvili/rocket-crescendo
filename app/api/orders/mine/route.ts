import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/backend/features/auth";
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  MAX_PAGINATION_LIMIT,
  OrderService,
} from "@/backend/features/order";
import type { PaginationFilter } from "@/backend/types";

const service = new OrderService();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const offsetParam = searchParams.get("offset");
    const limitParam = searchParams.get("limit");
    const filter: PaginationFilter = {};
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

    const result = await service.getOrdersForUser({
      userId: session.user.id,
      email: session.user.email,
      ...filter,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
