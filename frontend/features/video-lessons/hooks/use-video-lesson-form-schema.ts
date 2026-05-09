'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

import type { FileModel } from '@/backend/features/file';
import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

export function useVideoLessonFormSchema() {
  const t = useTranslations('common');

  return useMemo(
    () =>
      yup.object({
        translations: yup
          .array(
            yup.object({
              language: yup
                .mixed<SUPPORTED_LANGUAGE>()
                .oneOf(supportedLngs)
                .required(),
              name: yup
                .string()
                .required(t('nameRequired'))
                .min(2, t('nameMinLength')),
            }),
          )
          .required(),
        video: yup.mixed<FileModel>().nullable().default(null),
      }),
    [t],
  );
}
