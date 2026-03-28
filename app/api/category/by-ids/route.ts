import { NextRequest, NextResponse } from 'next/server';

import { CategoryService } from '@/backend/features/category';

const service = new CategoryService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids: number[] = body?.ids;
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids must be an array' }, { status: 400 });
    }
    const items = await service.getByIds(ids);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
