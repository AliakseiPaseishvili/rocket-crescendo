import type {
  VideoLessonCreateInput,
  VideoLessonFilter,
  VideoLessonUpdateInput,
  VideoLessonWithTranslations,
} from "./types";
import prisma from "../../prisma/prisma";

const VIDEO_LESSON_INCLUDE = {
  translations: true,
  file: true,
} as const;

export class VideoLessonRepository {
  async findAll(
    filter?: VideoLessonFilter,
  ): Promise<VideoLessonWithTranslations[]> {
    return prisma.videoLesson.findMany({
      where: filter?.sectionId ? { sectionId: filter.sectionId } : undefined,
      include: VIDEO_LESSON_INCLUDE,
      orderBy: { order: "asc" },
    });
  }

  async findById(id: string): Promise<VideoLessonWithTranslations | null> {
    return prisma.videoLesson.findUnique({
      where: { id },
      include: VIDEO_LESSON_INCLUDE,
    });
  }

  async create(
    data: VideoLessonCreateInput,
  ): Promise<VideoLessonWithTranslations> {
    return prisma.videoLesson.create({
      data: {
        sectionId: data.sectionId,
        fileId: data.fileId ?? null,
        order: data.order ?? 0,
        translations: { create: data.translations },
      },
      include: VIDEO_LESSON_INCLUDE,
    });
  }

  async update(
    id: string,
    data: VideoLessonUpdateInput,
  ): Promise<VideoLessonWithTranslations> {
    return prisma.videoLesson.update({
      where: { id },
      data: {
        ...(data.order !== undefined && { order: data.order }),
        ...("fileId" in data && { fileId: data.fileId ?? null }),
        ...(data.translations?.length && {
          translations: { deleteMany: {}, create: data.translations },
        }),
      },
      include: VIDEO_LESSON_INCLUDE,
    });
  }

  async delete(id: string): Promise<VideoLessonWithTranslations> {
    return prisma.videoLesson.delete({
      where: { id },
      include: VIDEO_LESSON_INCLUDE,
    });
  }
}
