import { ProductList } from '@/frontend/features/products';

const AdminProductsPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <h1 className="text-3xl font-bold">Products</h1>
      <ProductList />
    </main>
  );
};

export default AdminProductsPage;
