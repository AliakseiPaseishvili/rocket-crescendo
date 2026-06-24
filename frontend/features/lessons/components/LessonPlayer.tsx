'use client';

import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { Skeleton } from '@/frontend/components/ui/skeleton';
import { usePickTranslation } from '@/frontend/features/translation';
import { Link } from '@/frontend/features/translation/i18n/navigation';
import { useVideoLesson } from '@/frontend/features/video-lessons/hooks';
import { VideoPlayer } from '@/frontend/features/video-player';

interface LessonPlayerProps {
  bookId: string;
  lessonId: string;
}

export const LessonPlayer: FC<LessonPlayerProps> = ({ bookId, lessonId }) => {
  const t = useTranslations('lessons');
  const { data: lesson, isLoading } = useVideoLesson(lessonId);
  const translation = usePickTranslation(lesson?.translations ?? []);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
      <Link
        href={`/books/${bookId}/lessons`}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft size={16} />
        {t('backToLessons')}
      </Link>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-2/3" />
          <div className="min-h-50 w-full sm:min-h-80 lg:min-h-120">
            <Skeleton className="aspect-video h-full w-full" />
          </div>
        </div>
      ) : !lesson ? (
        <p className="text-sm text-muted-foreground">{t('lessonNotFound')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{translation?.name ?? '—'}</h1>

          {lesson.file ? (
            <div className="min-h-50 w-full sm:min-h-80 lg:min-h-120">
              <VideoPlayer src={lesson.file.fileUrl} autoplay muted controls />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('videoUnavailable')}</p>
          )}
        </div>
      )}
    </main>
  );
};
