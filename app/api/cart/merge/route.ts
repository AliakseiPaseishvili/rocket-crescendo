import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/backend/features/auth";
import { CartService } from "@/backend/features/cart";
import type { CartItemInput } from "@/backend/features/cart";

const service = new CartService();

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const items: CartItemInput[] = Array.isArray(body?.items) ? body.items : [];
    const merged = await service.mergeCart(userId, items);
    return NextResponse.json(merged);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to merge cart";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
