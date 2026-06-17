import { NextRequest, NextResponse } from 'next/server';

import { SubscriptionService } from '@/backend/features/subscription';

const service = new SubscriptionService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await service.confirm(body?.token);
    return NextResponse.json({ status: 'confirmed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to confirm subscription';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
