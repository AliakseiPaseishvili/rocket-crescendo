'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import type { VideoLessonWithTranslations } from '@/backend/features/video-lesson';
import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

import { VideoLessonFormFields } from './VideoLessonFormFields';
import { useEditVideoLessonForm } from '../hooks/use-edit-video-lesson-form';

interface EditVideoLessonModalProps {
  lesson: VideoLessonWithTranslations;
}

export const EditVideoLessonModal: FC<EditVideoLessonModalProps> = ({ lesson }) => {
  const [open, setOpen] = useState(false);
  const tVl = useTranslations('videoLesson');
  const t = useTranslations('common');

  const { register, control, fields, errors, onSubmit, isPending, error } =
    useEditVideoLessonForm(lesson, () => setOpen(false));

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="ghost" size="icon" className="size-8">
          <Pencil size={14} />
        </Button>
      }
      title={tVl('editLesson')}
    >
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
    </Modal>
  );
};
