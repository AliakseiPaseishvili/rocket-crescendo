'use client';

import { FileVideo, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

import type { VideoLessonWithTranslations } from '@/backend/features/video-lesson';
import { Button } from '@/frontend/components/ui/button';
import { usePickTranslation } from '@/frontend/features/translation';

import { useDeleteVideoLesson } from '../hooks/use-delete-video-lesson';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

interface VideoLessonCardProps {
  lesson: VideoLessonWithTranslations;
}

export const VideoLessonCard: FC<VideoLessonCardProps> = ({ lesson }) => {
  const tVl = useTranslations('videoLesson');
  const translation = usePickTranslation(lesson.translations);
  const { mutate: deleteLesson, isPending: isDeleting } = useDeleteVideoLesson(lesson.sectionId);
  const openEditLesson = useVideoLessonsPanelStore((s) => s.openEditLesson);

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <FileVideo size={16} className="shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{translation?.name ?? '—'}</p>
          {lesson.file && (
            <p className="truncate text-xs text-muted-foreground">{lesson.file.name}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => openEditLesson(lesson)}
          aria-label={tVl('editLesson')}
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={isDeleting}
          onClick={() => deleteLesson({ params: { id: lesson.id } })}
          aria-label={tVl('deleteLesson')}
        >
          <Trash2 size={14} className="text-destructive" />
        </Button>
      </div>
    </div>
  );
};
