import type {
  VideoLessonCreateInput,
  VideoLessonFilter,
  VideoLessonUpdateInput,
  VideoLessonWithTranslations,
} from '@/backend/features/video-lesson';

import { HttpMethod, RequestApiType, RequestMap } from './types';

const VIDEO_LESSON_API_ROUTES = {
  VIDEO_LESSONS: '/api/video-lessons',
  VIDEO_LESSON: '/api/video-lessons/:id',
} as const;

export type VideoLessonApiTypes = {
  getVideoLessons: RequestApiType<
    undefined,
    undefined,
    VideoLessonFilter | undefined,
    VideoLessonWithTranslations[]
  >;
  getVideoLesson: RequestApiType<
    undefined,
    { id: string },
    undefined,
    VideoLessonWithTranslations
  >;
  createVideoLesson: RequestApiType<
    VideoLessonCreateInput,
    undefined,
    undefined,
    VideoLessonWithTranslations
  >;
  updateVideoLesson: RequestApiType<
    VideoLessonUpdateInput,
    { id: string },
    undefined,
    VideoLessonWithTranslations
  >;
  deleteVideoLesson: RequestApiType<undefined, { id: string }, undefined, void>;
};

export const VIDEO_LESSON_REQUEST_MAP: RequestMap<VideoLessonApiTypes> = {
  getVideoLessons: { url: VIDEO_LESSON_API_ROUTES.VIDEO_LESSONS, method: HttpMethod.GET },
  getVideoLesson: { url: VIDEO_LESSON_API_ROUTES.VIDEO_LESSON, method: HttpMethod.GET },
  createVideoLesson: { url: VIDEO_LESSON_API_ROUTES.VIDEO_LESSONS, method: HttpMethod.POST },
  updateVideoLesson: { url: VIDEO_LESSON_API_ROUTES.VIDEO_LESSON, method: HttpMethod.PATCH },
  deleteVideoLesson: { url: VIDEO_LESSON_API_ROUTES.VIDEO_LESSON, method: HttpMethod.DELETE },
};
