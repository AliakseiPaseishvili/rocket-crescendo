'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { useProductSections } from '@/frontend/features/video-lessons/hooks';

import { LessonSectionGroup } from './LessonSectionGroup';

interface LessonsOverviewProps {
  bookId: string;
}

export const LessonsOverview: FC<LessonsOverviewProps> = ({ bookId }) => {
  const t = useTranslations('lessons');
  const { data: sections, isLoading } = useProductSections(bookId);

  const hasLessons = sections?.some((section) => section.lessons.length > 0);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : !sections?.length || !hasLessons ? (
        <p className="text-sm text-muted-foreground">{t('noLessons')}</p>
      ) : (
        sections.map((section) => (
          <LessonSectionGroup key={section.id} section={section} bookId={bookId} />
        ))
      )}
    </main>
  );
};
