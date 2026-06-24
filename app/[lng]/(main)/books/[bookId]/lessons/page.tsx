import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LessonsOverview } from '@/frontend/features/lessons';

type Props = { params: Promise<{ lng: string; bookId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const t = await getTranslations({ locale: lng, namespace: 'lessons' });
  return { title: t('title') };
}

const BookLessonsPage = async ({ params }: Props) => {
  const { bookId } = await params;
  return <LessonsOverview bookId={bookId} />;
};

export default BookLessonsPage;
