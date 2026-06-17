import { NextRequest, NextResponse } from 'next/server';

import { SubscriptionService } from '@/backend/features/subscription';

const service = new SubscriptionService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await service.subscribe({ email: body?.email });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to subscribe';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
