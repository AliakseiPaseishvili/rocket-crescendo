'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { ROUTES } from '@/frontend/constants';
import { useSession } from '@/frontend/features/auth';
import { useCartStore } from '@/frontend/features/cart';
import { Link, useRouter } from '@/frontend/features/translation/i18n/navigation';

import { FlowChoice } from './FlowChoice';

export const CheckoutOptions = () => {
  const t = useTranslations('checkout');
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);

  const isRegistered = !!session?.user.email;

  // A logged-in user has no reason to pick guest vs. sign-in — send them to the form.
  useEffect(() => {
    if (isRegistered) {
      router.replace(ROUTES.CHECKOUT);
    }
  }, [isRegistered, router]);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center text-muted-foreground">
        <ShoppingCart className="h-10 w-10 opacity-40" />
        <p className="text-sm">{t('empty')}</p>
        <Link href={ROUTES.BASE} className="text-sm underline">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t('optionsTitle')}</h1>
      <FlowChoice
        onGuest={() => router.push(ROUTES.CHECKOUT)}
        onRegistered={() =>
          router.push({
            pathname: ROUTES.SIGN_IN,
            query: { redirect: ROUTES.CHECKOUT },
          })
        }
      />
    </div>
  );
};
