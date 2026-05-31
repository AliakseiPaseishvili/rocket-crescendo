import {
  Breadcrumbs,
  BREADCRUMBS_ADMIN_PRODUCTS_VIDEO_LESSONS,
} from "@/frontend/features/breadcrumbs";
import {
  ProductSectionList,
  VideoLessonsPanel,
} from "@/frontend/features/video-lessons";

type Props = { params: Promise<{ id: string }> };

const ProductVideoLessonsPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <main className="pt-8 px-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_PRODUCTS_VIDEO_LESSONS} />
      <div className="grid grid-cols-3 mt-6">
        <div className="col-span-1 border-r border-border pr-6 h-[calc(100vh-(--spacing(14))-(--spacing(8))-(--spacing(6))-(--spacing(6)))] overflow-y-auto">
          <ProductSectionList productId={id} />
        </div>
        <div className="col-span-2 pl-6">
          <VideoLessonsPanel />
        </div>
      </div>
    </main>
  );
};

export default ProductVideoLessonsPage;
