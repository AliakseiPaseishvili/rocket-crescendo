import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CheckoutCancel } from '@/frontend/features/cart';

type Props = { params: Promise<{ lng: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const t = await getTranslations({ locale: lng, namespace: 'cart' });
  return { title: t('cancelTitle') };
}

export default function CheckoutCancelPage() {
  return (
    <main className="w-full">
      <CheckoutCancel />
    </main>
  );
}
