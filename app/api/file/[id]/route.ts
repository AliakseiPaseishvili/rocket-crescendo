import { NextRequest, NextResponse } from 'next/server';

import { withAdminAuth } from '@/backend/features/auth';
import { FileService } from '@/backend/features/file';

const service = new FileService();

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const item = await service.getById(id);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export const PATCH = withAdminAuth(async (request, ctx) => {
  try {
    const { id } = await ctx!.params;
    const body = await request.json();
    const item = await service.update(id, body);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update file';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
});

export const DELETE = withAdminAuth(async (_, ctx) => {
  try {
    const { id } = await ctx!.params;
    await service.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete file';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
});
