import type { FileModel } from '@/backend/features/file';

import { SUPPORTED_LANGUAGE } from '../translation';

export type SectionTranslationField = {
  language: SUPPORTED_LANGUAGE;
  name: string;
};

export type LessonTranslationField = {
  language: SUPPORTED_LANGUAGE;
  name: string;
};

export type ProductSectionFormValues = {
  translations: SectionTranslationField[];
};

export type VideoLessonFormValues = {
  translations: LessonTranslationField[];
  video: FileModel | null;
};
