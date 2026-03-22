'use client';
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import { supportedLngs } from "./constants";
import { resources } from "./locales";

const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs,
    interpolation: {
      escapeValue: false, // React escapes by default
    },
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
      caches: ["cookie"],
    },
    preload: runsOnServerSide ? supportedLngs : [],
  });

// Augment i18next types for type-safe useTranslation
declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"];
  }
}

export default i18next;
