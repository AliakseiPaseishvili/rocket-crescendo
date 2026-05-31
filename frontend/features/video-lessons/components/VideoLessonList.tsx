'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { Button } from '@/frontend/components/ui/button';

import { VideoLessonCard } from './VideoLessonCard';
import { useVideoLessons } from '../hooks/use-video-lessons';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

interface VideoLessonListProps {
  sectionId: string;
}

export const VideoLessonList: FC<VideoLessonListProps> = ({ sectionId }) => {
  const tVl = useTranslations('videoLesson');
  const { data: lessons, isLoading } = useVideoLessons(sectionId);
  const openCreateLesson = useVideoLessonsPanelStore((s) => s.openCreateLesson);

  return (
    <div className="flex flex-col gap-2 pl-4 mt-2">
      {isLoading && (
        <p className="text-xs text-muted-foreground">{tVl('lessons')}&hellip;</p>
      )}
      {!isLoading && (!lessons || lessons.length === 0) && (
        <p className="text-xs text-muted-foreground">{tVl('noLessons')}</p>
      )}
      {lessons?.map((lesson) => (
        <VideoLessonCard key={lesson.id} lesson={lesson} />
      ))}
      <div className="mt-1">
        <Button variant="outline" size="sm" onClick={() => openCreateLesson(sectionId)}>
          {tVl('addLesson')}
        </Button>
      </div>
    </div>
  );
};
