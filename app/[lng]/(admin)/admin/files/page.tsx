import { FileList } from '@/frontend/features/files';

const AdminFilesPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <FileList />
    </main>
  );
};

export default AdminFilesPage;
