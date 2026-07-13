'use client';

import { XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import { Link } from '@/frontend/features/translation/i18n/navigation';

export const CheckoutCancel = () => {
  const t = useTranslations('cart');

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <XCircle className="h-14 w-14 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">{t('cancelTitle')}</h1>
      <p className="max-w-md text-muted-foreground">{t('cancelMessage')}</p>
      <Button asChild>
        <Link href="/">{t('backHome')}</Link>
      </Button>
    </div>
  );
};
