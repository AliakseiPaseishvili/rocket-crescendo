import { Breadcrumbs, BREADCRUMBS_ADMIN_PRODUCTS_EDIT } from '@/frontend/features/breadcrumbs';
import { EditProductForm } from '@/frontend/features/products';

type Props = { params: Promise<{ id: string }> };

const EditProductPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <main className="flex flex-col gap-6 pt-8 px-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_PRODUCTS_EDIT} />
      <div className="flex flex-1">
        <EditProductForm id={id} />
      </div>
    </main>
  );
};

export default EditProductPage;
