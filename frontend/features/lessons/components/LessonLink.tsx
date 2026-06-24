'use client';

import { FileVideo } from 'lucide-react';
import { FC } from 'react';

import type { VideoLessonWithTranslations } from '@/backend/features/video-lesson';
import { usePickTranslation } from '@/frontend/features/translation';
import { Link } from '@/frontend/features/translation/i18n/navigation';

interface LessonLinkProps {
  bookId: string;
  lesson: VideoLessonWithTranslations;
}

export const LessonLink: FC<LessonLinkProps> = ({ bookId, lesson }) => {
  const translation = usePickTranslation(lesson.translations);

  return (
    <Link
      href={`/books/${bookId}/lessons/${lesson.id}`}
      className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
    >
      <FileVideo size={16} className="shrink-0 text-muted-foreground" />
      <span className="truncate">{translation?.name ?? '—'}</span>
    </Link>
  );
};
