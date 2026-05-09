import { NextRequest, NextResponse } from "next/server";

import { withAdminAuth } from "@/backend/features/auth";
import { VideoLessonService } from "@/backend/features/video-lesson";
import type { VideoLessonFilter } from "@/backend/features/video-lesson";

const service = new VideoLessonService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("sectionId");
    const filter: VideoLessonFilter = {};
    if (sectionId) filter.sectionId = sectionId;
    const lessons = await service.getAll(
      Object.keys(filter).length ? filter : undefined,
    );
    return NextResponse.json(lessons);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch lessons";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const POST = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    const lesson = await service.create(body);
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create lesson";
    return NextResponse.json({ error: message }, { status: 400 });
  }
});
