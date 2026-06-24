'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

import type { VideoLessonWithTranslations } from '@/backend/features/video-lesson';

import { LessonShareQrCode } from './LessonShareQrCode';
import { VideoLessonFormFields } from './VideoLessonFormFields';
import { useEditVideoLessonForm } from '../hooks/use-edit-video-lesson-form';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

interface EditLessonPanelContentProps {
  lesson: VideoLessonWithTranslations;
}

export const EditLessonPanelContent: FC<EditLessonPanelContentProps> = ({ lesson }) => {
  const t = useTranslations('common');
  const { id: bookId } = useParams<{ id: string }>();
  const close = useVideoLessonsPanelStore((s) => s.close);
  const { register, control, fields, errors, onSubmit, isPending, error } =
    useEditVideoLessonForm(lesson, close);

  return (
    <div className="flex flex-col gap-6">
      <VideoLessonFormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        error={error}
        submitLabel={t('save')}
        pendingLabel={t('saving')}
      />

      <LessonShareQrCode bookId={bookId} lessonId={lesson.id} />
    </div>
  );
};
