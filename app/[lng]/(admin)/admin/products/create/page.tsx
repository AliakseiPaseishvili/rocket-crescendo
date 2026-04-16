import { Breadcrumbs, BREADCRUMBS_ADMIN_PRODUCTS_CREATE } from '@/frontend/features/breadcrumbs';
import { CreateProductForm } from '@/frontend/features/products';

const CreateProductPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_PRODUCTS_CREATE} />
      <div className="flex flex-1 items-center justify-center">
        <CreateProductForm />
      </div>
    </main>
  );
};

export default CreateProductPage;
