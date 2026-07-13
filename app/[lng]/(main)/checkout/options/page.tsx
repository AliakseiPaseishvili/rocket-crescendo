import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CheckoutOptions } from '@/frontend/features/checkout';

type Props = { params: Promise<{ lng: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const t = await getTranslations({ locale: lng, namespace: 'checkout' });
  return { title: t('optionsTitle') };
}

export default function CheckoutOptionsPage() {
  return (
    <main className="flex min-h-[calc(100vh-338px)] w-full flex-col">
      <CheckoutOptions />
    </main>
  );
}
