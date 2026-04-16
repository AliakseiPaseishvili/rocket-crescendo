import { Breadcrumbs, BREADCRUMBS_ADMIN_FILES } from '@/frontend/features/breadcrumbs';
import { FileList } from '@/frontend/features/files';

const AdminFilesPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_FILES} />
      <FileList />
    </main>
  );
};

export default AdminFilesPage;
