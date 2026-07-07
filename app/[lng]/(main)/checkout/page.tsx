import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CheckoutView } from '@/frontend/features/checkout';

type Props = { params: Promise<{ lng: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const t = await getTranslations({ locale: lng, namespace: 'checkout' });
  return { title: t('title') };
}

export default function CheckoutPage() {
  return (
    <main className="w-full">
      <CheckoutView />
    </main>
  );
}
