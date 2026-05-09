import { Breadcrumbs, BREADCRUMBS_ADMIN_USERS } from '@/frontend/features/breadcrumbs';
import { UserList } from '@/frontend/features/users';

const AdminUsersPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_USERS} />
      <UserList />
    </main>
  );
};

export default AdminUsersPage;
