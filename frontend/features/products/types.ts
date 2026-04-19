import type { FileModel } from '@/backend/features/file';

import { SUPPORTED_LANGUAGE } from "../translation";

export type TranslationField = {
  language: SUPPORTED_LANGUAGE;
  name: string;
  description: string;
};

export type ProductFormValues = {
  favorite: boolean;
  categoryId: number;
  translations: TranslationField[];
};

export type ProductMediaState = {
  mainImage: FileModel | null;
  video: FileModel | null;
  additionalImages: FileModel[];
};
