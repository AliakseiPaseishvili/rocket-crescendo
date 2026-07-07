import { Breadcrumbs, BREADCRUMBS_ADMIN_ORDERS } from '@/frontend/features/breadcrumbs';
import { OrderList } from '@/frontend/features/orders';

const AdminOrdersPage = () => {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <Breadcrumbs items={BREADCRUMBS_ADMIN_ORDERS} />
      <OrderList />
    </main>
  );
};

export default AdminOrdersPage;
