import { Breadcrumbs, BREADCRUMBS_ADMIN_PRODUCTS } from '@/frontend/features/breadcrumbs';
import { ProductList } from '@/frontend/features/products';

const AdminProductsPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_PRODUCTS} />
      <ProductList />
    </main>
  );
};

export default AdminProductsPage;
