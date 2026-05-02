"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import * as yup from "yup";

import type { FileModel } from "@/backend/features/file";
import {
  SUPPORTED_LANGUAGE,
  supportedLngs,
} from "@/frontend/features/translation";

export function useProductFormSchema() {
  const t = useTranslations("common");
  const tProduct = useTranslations("product");

  return useMemo(
    () =>
      yup.object({
        favorite: yup.boolean().required(),
        price: yup
          .number()
          .required(tProduct("priceRequired"))
          .positive(tProduct("priceMustBePositive"))
          .min(0.01, tProduct("priceMustBePositive")),
        includeVideoLessons: yup.boolean().required(),
        categoryId: yup
          .string()
          .required(tProduct("categoryRequired"))
          .min(1, tProduct("categoryRequired")),
        translations: yup
          .array(
            yup.object({
              language: yup
                .mixed<SUPPORTED_LANGUAGE>()
                .oneOf(supportedLngs)
                .required(),
              name: yup
                .string()
                .required(t("nameRequired"))
                .min(2, t("nameMinLength")),
              description: yup
                .string()
                .required(t("descriptionRequired"))
                .min(10, t("descriptionMinLength")),
            }),
          )
          .required(),
        mainImage: yup.mixed<FileModel>().nullable().default(null),
        video: yup.mixed<FileModel>().nullable().default(null),
        additionalImages: yup
          .array()
          .of(yup.mixed<FileModel>().required())
          .default([]),
      }),
    [t, tProduct],
  );
}
