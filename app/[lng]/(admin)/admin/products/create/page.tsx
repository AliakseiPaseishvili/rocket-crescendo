import { Breadcrumbs, BREADCRUMBS_ADMIN_PRODUCTS_CREATE } from '@/frontend/features/breadcrumbs';
import { CreateProductForm } from '@/frontend/features/products';

const CreateProductPage = () => {
  return (
    <main className="flex flex-col gap-6 pt-8 px-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_PRODUCTS_CREATE} />
      <div className="flex flex-1">
        <CreateProductForm />
      </div>
    </main>
  );
};

export default CreateProductPage;
