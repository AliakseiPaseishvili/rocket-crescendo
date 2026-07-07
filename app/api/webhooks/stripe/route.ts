import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { OrderService } from "@/backend/features/order";
import { stripe } from "@/backend/features/stripe";

const service = new OrderService();

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  // Read the raw body — required for Stripe signature verification.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await service.fulfillCheckout(event.data.object);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fulfilment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
