import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { MyOrders } from '@/frontend/features/my-orders';

type Props = { params: Promise<{ lng: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const t = await getTranslations({ locale: lng, namespace: 'myOrders' });
  return { title: t('title') };
}

export default function OrdersPage() {
  return (
    <main className="min-h-[calc(100vh-338px)] w-full">
      <MyOrders />
    </main>
  );
}
