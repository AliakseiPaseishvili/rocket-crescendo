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

    const fileType = formData.get('fileType') as string | null;
    if (!fileType || !(fileType in FileType)) {
      return NextResponse.json({ error: 'fileType must be IMAGE or VIDEO' }, { status: 400 });
    }

    const translationsRaw = formData.get('translations') as string | null;
    if (!translationsRaw) {
      return NextResponse.json({ error: 'translations is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const item = await service.upload({
      buffer,
      key: file.name,
      contentType: file.type,
      fileType: fileType as FileType,
      translations: JSON.parse(translationsRaw),
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
