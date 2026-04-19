import { NextRequest, NextResponse } from "next/server";

import type { FileFilter } from "@/backend/features/file";
import {
  FileService,
  FileType,
  MAX_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
} from "@/backend/features/file";

const service = new FileService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileTypeParam = searchParams.get("fileType");
    const filterName = searchParams.get("name");
    const offsetParam = searchParams.get("offset");
    const limitParam = searchParams.get("limit");
    const filter: FileFilter = {};
    if (fileTypeParam && fileTypeParam in FileType)
      filter.fileType = fileTypeParam as FileType;
    if (filterName) filter.name = filterName;
    if (offsetParam !== null)
      filter.offset = Math.max(
        0,
        parseInt(offsetParam, 10) || DEFAULT_PAGINATION_OFFSET,
      );
    if (limitParam !== null)
      filter.limit = Math.min(
        MAX_PAGINATION_LIMIT,
        Math.max(1, parseInt(limitParam, 10) || DEFAULT_PAGINATION_LIMIT),
      );
    const result = await service.getAll(
      Object.keys(filter).length ? filter : undefined,
    );
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch files";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "file is required" }, { status: 400 });

    const name = formData.get("name") as string | null;
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const item = await service.upload({ file, name });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
