'use client';

import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

import { VideoLessonFormFields } from './VideoLessonFormFields';
import { useCreateVideoLessonForm } from '../hooks/use-create-video-lesson-form';

interface CreateVideoLessonModalProps {
  sectionId: string;
}

export const CreateVideoLessonModal: FC<CreateVideoLessonModalProps> = ({ sectionId }) => {
  const [open, setOpen] = useState(false);
  const tVl = useTranslations('videoLesson');
  const t = useTranslations('common');

  const { register, control, fields, errors, onSubmit, isPending, error } =
    useCreateVideoLessonForm(sectionId, () => setOpen(false));

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="outline" size="sm">{tVl('addLesson')}</Button>}
      title={tVl('addLesson')}
    >
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
    </Modal>
  );
};
