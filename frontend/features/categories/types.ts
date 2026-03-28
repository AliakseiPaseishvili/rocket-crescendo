import { SUPPORTED_LANGUAGE } from '../translation';

export type CategoryTranslationField = {
  language: SUPPORTED_LANGUAGE;
  name: string;
};

export type CategoryFormValues = {
  color: string;
  translations: CategoryTranslationField[];
};
