import { fallbackLng } from "../constants";

export const pickTranslation = <T extends { language: string }>({
  translations,
  locale,
}: {
  translations: T[];
  locale: string;
}): T | undefined => {
  return (
    translations.find((t) => t.language === locale) ??
    translations.find((t) => t.language === fallbackLng) ??
    translations[0]
  );
};
