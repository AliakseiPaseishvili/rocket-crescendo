import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CheckoutSuccess } from '@/frontend/features/checkout';

type Props = { params: Promise<{ lng: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const t = await getTranslations({ locale: lng, namespace: 'cart' });
  return { title: t('successTitle') };
}

export default function CheckoutSuccessPage() {
  return (
    <main className="w-full">
      <CheckoutSuccess />
    </main>
  );
}
