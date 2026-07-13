'use client';

import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { useCartStore } from '@/frontend/features/cart';
import { Link } from '@/frontend/features/translation/i18n/navigation';

export const CheckoutSuccess = () => {
  const t = useTranslations('cart');
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <CheckCircle2 className="h-14 w-14 text-green-500" />
      <h1 className="text-2xl font-semibold">{t('successTitle')}</h1>
      <p className="max-w-md text-muted-foreground">{t('successMessage')}</p>
      <Button asChild>
        <Link href="/">{t('backHome')}</Link>
      </Button>
    </div>
  );
};
