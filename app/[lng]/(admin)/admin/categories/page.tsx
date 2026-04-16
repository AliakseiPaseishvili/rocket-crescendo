import { Breadcrumbs, BREADCRUMBS_ADMIN_CATEGORIES } from '@/frontend/features/breadcrumbs';
import { CategoriesList } from '@/frontend/features/categories';

const AdminCategoriesPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_CATEGORIES} />
      <CategoriesList />
    </main>
  );
};

export default AdminCategoriesPage;
