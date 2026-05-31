'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';

import { CreateLessonPanelContent } from './CreateLessonPanelContent';
import { CreateSectionPanelContent } from './CreateSectionPanelContent';
import { EditLessonPanelContent } from './EditLessonPanelContent';
import { EditSectionPanelContent } from './EditSectionPanelContent';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

export const VideoLessonsPanel = () => {
  const tVl = useTranslations('videoLesson');
  const { panel, close } = useVideoLessonsPanelStore();

  if (!panel) return null;

  const titleMap = {
    'create-section': tVl('addSection'),
    'edit-section': tVl('editSection'),
    'create-lesson': tVl('addLesson'),
    'edit-lesson': tVl('editLesson'),
  };

  const title = titleMap[panel.type];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" className="size-8" onClick={close} aria-label="Close panel">
          <X size={16} />
        </Button>
      </div>

      {panel.type === 'create-section' && (
        <CreateSectionPanelContent productId={panel.productId} />
      )}
      {panel.type === 'edit-section' && (
        <EditSectionPanelContent section={panel.section} productId={panel.productId} />
      )}
      {panel.type === 'create-lesson' && (
        <CreateLessonPanelContent sectionId={panel.sectionId} />
      )}
      {panel.type === 'edit-lesson' && (
        <EditLessonPanelContent lesson={panel.lesson} />
      )}
    </div>
  );
};
