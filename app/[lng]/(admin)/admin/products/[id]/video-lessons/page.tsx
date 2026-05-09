import { Breadcrumbs, BREADCRUMBS_ADMIN_PRODUCTS_VIDEO_LESSONS } from '@/frontend/features/breadcrumbs';
import { ProductSectionList } from '@/frontend/features/video-lessons';

type Props = { params: Promise<{ id: string }> };

const ProductVideoLessonsPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <main className="flex flex-col gap-6 pt-8 px-8 max-w-3xl">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_PRODUCTS_VIDEO_LESSONS} />
      <ProductSectionList productId={id} />
    </main>
  );
};

export default ProductVideoLessonsPage;
