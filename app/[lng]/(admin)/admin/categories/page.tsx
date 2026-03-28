import { CategoriesList } from '@/frontend/features/categories';

const AdminCategoriesPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <CategoriesList />
    </main>
  );
};

export default AdminCategoriesPage;
