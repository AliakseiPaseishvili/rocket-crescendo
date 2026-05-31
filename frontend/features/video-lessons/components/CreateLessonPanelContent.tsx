'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { VideoLessonFormFields } from './VideoLessonFormFields';
import { useCreateVideoLessonForm } from '../hooks/use-create-video-lesson-form';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

interface CreateLessonPanelContentProps {
  sectionId: string;
}

export const CreateLessonPanelContent: FC<CreateLessonPanelContentProps> = ({ sectionId }) => {
  const t = useTranslations('common');
  const close = useVideoLessonsPanelStore((s) => s.close);
  const { register, control, fields, errors, onSubmit, isPending, error } =
    useCreateVideoLessonForm(sectionId, close);

  return (
    <VideoLessonFormFields
      register={register}
      control={control}
      fields={fields}
      errors={errors}
      onSubmit={onSubmit}
      isPending={isPending}
      error={error}
      submitLabel={t('create')}
      pendingLabel={t('creating')}
    />
  );
};
