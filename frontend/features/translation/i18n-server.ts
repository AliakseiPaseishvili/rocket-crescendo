import { createInstance, Namespace } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { fallbackLng, supportedLngs } from "./constants";

export const initI18next = async (
  lng: string,
  namespace?: Namespace,
) => {
  const instance = createInstance();
  await instance
    .use(
      resourcesToBackend(
        (language: string, ns: string) =>
          import(`./locales/${language}/${ns}.json`),
      ),
    )
    .init({
      lng,
      fallbackLng,
      supportedLngs,
      defaultNS: namespace,
      ns: Array.isArray(namespace) ? namespace : [namespace],
      interpolation: { escapeValue: false },
    });
  return {
    t: instance.getFixedT(
      lng,
      Array.isArray(namespace) ? namespace[0] : namespace,
    ),
    i18n: instance,
  };
};
