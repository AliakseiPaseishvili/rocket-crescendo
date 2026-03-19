export const supportedLngs = ['en', 'fr', 'ru'] as const;

export const languageLabels: Record<(typeof supportedLngs)[number], string> = {
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
};
