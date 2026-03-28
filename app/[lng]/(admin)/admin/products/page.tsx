import { ProductList } from '@/frontend/features/products';

const AdminProductsPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <ProductList />
    </main>
  );
};

export default AdminProductsPage;
