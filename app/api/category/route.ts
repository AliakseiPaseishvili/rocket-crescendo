import { NextRequest, NextResponse } from 'next/server';

import { withAdminAuth } from '@/backend/features/auth';
import { CategoryService } from '@/backend/features/category';
import type { CategoryFilter } from '@/backend/features/category';

const service = new CategoryService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter: CategoryFilter = {};
    const color = searchParams.get('color');
    if (color) filter.color = color;
    const items = await service.getAll(Object.keys(filter).length ? filter : undefined);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const POST = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    const item = await service.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json({ error: message }, { status: 400 });
  }
});
