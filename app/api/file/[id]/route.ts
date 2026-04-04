import { NextRequest, NextResponse } from 'next/server';

import { FileService } from '@/backend/features/file';

const service = new FileService();

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const item = await service.getById(Number(id));
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await service.update(Number(id), body);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update file';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await service.delete(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete file';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
