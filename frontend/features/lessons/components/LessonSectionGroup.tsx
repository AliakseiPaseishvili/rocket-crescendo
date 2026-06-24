'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import type { ProductSectionWithTranslations } from '@/backend/features/product-section';
import { usePickTranslation } from '@/frontend/features/translation';

import { LessonLink } from './LessonLink';

interface LessonSectionGroupProps {
  section: ProductSectionWithTranslations;
  bookId: string;
}

export const LessonSectionGroup: FC<LessonSectionGroupProps> = ({ section, bookId }) => {
  const t = useTranslations('lessons');
  const translation = usePickTranslation(section.translations);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{translation?.name ?? '—'}</h2>

      {section.lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('noLessons')}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {section.lessons.map((lesson) => (
            <LessonLink key={lesson.id} bookId={bookId} lesson={lesson} />
          ))}
        </div>
      )}
    </section>
  );
};
