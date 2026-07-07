import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/backend/features/auth";
import { OrderService } from "@/backend/features/order";
import type {
  CheckoutAddressInput,
  CheckoutItemInput,
} from "@/backend/features/order";

const service = new OrderService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: CheckoutItemInput[] = body?.items;
    const lng: string = typeof body?.lng === "string" ? body.lng : "en";
    const address: CheckoutAddressInput = body?.address;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items must be a non-empty array" }, { status: 400 });
    }

    if (!address || typeof address !== "object") {
      return NextResponse.json({ error: "address is required" }, { status: 400 });
    }

    // Guest checkout allowed — attach the user when a session exists.
    const session = await auth.api.getSession({ headers: request.headers });

    // Trust the session email when authenticated; otherwise require a form email.
    const email = session?.user.email ?? (typeof body?.email === "string" ? body.email : "");
    if (!email.trim()) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const result = await service.createCheckoutSession({
      items,
      lng,
      email,
      address,
      userId: session?.user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
