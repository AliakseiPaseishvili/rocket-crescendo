import { NextRequest, NextResponse } from 'next/server';

import type { FileFilter } from '@/backend/features/file';
import { FileService } from '@/backend/features/file';
import { FileType } from '@/backend/features/file';

const service = new FileService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileTypeParam = searchParams.get('fileType');
    const filter: FileFilter = {};
    if (fileTypeParam && fileTypeParam in FileType) {
      filter.fileType = fileTypeParam as FileType;
    }
    const items = await service.getAll(Object.keys(filter).length ? filter : undefined);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch files';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 });

    const name = formData.get('name') as string | null;
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const item = await service.upload({ file, name });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
