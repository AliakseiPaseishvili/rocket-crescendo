'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import { supportedLngs } from '@/frontend/features/translation';

import { VideoLessonFormValues } from '../types';
import { useCreateVideoLesson } from './use-create-video-lesson';
import { useVideoLessonFormSchema } from './use-video-lesson-form-schema';

export function useCreateVideoLessonForm(sectionId: string, onSuccess?: () => void) {
  const schema = useVideoLessonFormSchema();

  const defaultValues: VideoLessonFormValues = {
    translations: supportedLngs.map((lng) => ({ language: lng, name: '' })),
    video: null,
  };

  const { handleSubmit, register, control, reset, formState: { errors } } = useForm<VideoLessonFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreateVideoLesson(sectionId);

  const onSubmit = handleSubmit(({ video, translations }) => {
    mutate(
      { body: { sectionId, translations, ...(video ? { fileId: video.id } : {}) } },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      },
    );
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
