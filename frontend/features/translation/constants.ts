import { SUPPORTED_LANGUAGE } from "./types";

export const supportedLngs = [SUPPORTED_LANGUAGE.EN, SUPPORTED_LANGUAGE.FR, SUPPORTED_LANGUAGE.RU] as const;

export const languageLabels: Record<SUPPORTED_LANGUAGE, string> = {
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
};

export const fallbackLng = 'en';
export const i18nCookieName = 'i18next';
