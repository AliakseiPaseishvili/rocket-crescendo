'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import type { VideoLessonWithTranslations } from '@/backend/features/video-lesson';
import { supportedLngs } from '@/frontend/features/translation';

import { VideoLessonFormValues } from '../types';
import { useUpdateVideoLesson } from './use-update-video-lesson';
import { useVideoLessonFormSchema } from './use-video-lesson-form-schema';

export function useEditVideoLessonForm(
  lesson: VideoLessonWithTranslations,
  onSuccess?: () => void,
) {
  const schema = useVideoLessonFormSchema();

  const defaultValues: VideoLessonFormValues = {
    translations: supportedLngs.map((lng) => {
      const existing = lesson.translations.find((tr) => tr.language === lng);
      return { language: lng, name: existing?.name ?? '' };
    }),
    video: lesson.file ?? null,
  };

  const { handleSubmit, register, control, formState: { errors } } = useForm<VideoLessonFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useUpdateVideoLesson(lesson.sectionId);

  const onSubmit = handleSubmit(({ video, translations }) => {
    mutate(
      {
        params: { id: lesson.id },
        body: { translations, fileId: video?.id ?? null },
      },
      { onSuccess },
    );
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
