import { NextRequest, NextResponse } from "next/server";

import { withAdminAuth } from "@/backend/features/auth";
import { OrderService, OrderStatus } from "@/backend/features/order";

const service = new OrderService();

const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === "string" &&
  Object.values(OrderStatus).includes(value as OrderStatus);

export const PATCH = withAdminAuth(async (request: NextRequest, ctx) => {
  try {
    const { id } = await ctx!.params;
    const body = await request.json();
    if (!isOrderStatus(body?.status)) {
      return NextResponse.json(
        { error: "A valid status is required" },
        { status: 400 },
      );
    }
    const order = await service.updateOrderStatus(id, body.status);
    return NextResponse.json(order);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update order";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
});
