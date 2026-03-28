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
