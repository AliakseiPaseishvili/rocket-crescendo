export const supportedLngs = ['en', 'fr', 'ru'] as const;

export const languageLabels: Record<(typeof supportedLngs)[number], string> = {
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
};

export const fallbackLng = 'en';
export const i18nCookieName = 'i18next';
