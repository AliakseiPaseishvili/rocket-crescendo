import { LessonPlayer } from '@/frontend/features/lessons';

type Props = { params: Promise<{ lng: string; bookId: string; lessonId: string }> };

const BookLessonPage = async ({ params }: Props) => {
  const { bookId, lessonId } = await params;
  return <LessonPlayer bookId={bookId} lessonId={lessonId} />;
};

export default BookLessonPage;
