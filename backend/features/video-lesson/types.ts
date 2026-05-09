import type {
  VideoLessonGetPayload,
  VideoLessonTranslationCreateInput,
} from "../../app/generated/prisma/models";

export type { VideoLessonModel } from "../../app/generated/prisma/models/VideoLesson";
export type { VideoLessonTranslationModel } from "../../app/generated/prisma/models/VideoLessonTranslation";

export type VideoLessonWithTranslations = VideoLessonGetPayload<{
  include: {
    translations: true;
    file: true;
  };
}>;

export type VideoLessonCreateInput = {
  sectionId: string;
  fileId?: string;
  order?: number;
  translations: Omit<VideoLessonTranslationCreateInput, "lesson">[];
};

export type VideoLessonUpdateInput = {
  fileId?: string | null;
  order?: number;
  translations?: Omit<VideoLessonTranslationCreateInput, "lesson">[];
};

export type VideoLessonFilter = {
  sectionId?: string;
};
