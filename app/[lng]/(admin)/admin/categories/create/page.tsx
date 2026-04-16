import { Breadcrumbs, BREADCRUMBS_ADMIN_CATEGORIES_CREATE } from '@/frontend/features/breadcrumbs';
import { CreateCategoryForm } from '@/frontend/features/categories';

const CreateCategoryPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_CATEGORIES_CREATE} />
      <div className="flex flex-1 items-center justify-center">
        <CreateCategoryForm />
      </div>
    </main>
  );
};

export default CreateCategoryPage;
