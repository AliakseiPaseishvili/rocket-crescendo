"use client";

import { useLocale } from "next-intl";

import { pickTranslation } from "../utils/pick-translation";

export function usePickTranslation<T extends { language: string }>(
  translations: T[],
): T | undefined {
  const locale = useLocale();
  return pickTranslation({ translations, locale });
}
