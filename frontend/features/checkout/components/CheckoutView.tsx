'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { ROUTES } from '@/frontend/constants';
import { useSession } from '@/frontend/features/auth';
import { useCartStore } from '@/frontend/features/cart';
import { Link } from '@/frontend/features/translation/i18n/navigation';

import { CheckoutForm } from './CheckoutForm';
import { CheckoutSummary } from './CheckoutSummary';
import { useCheckoutForm } from '../hooks';

export const CheckoutView = () => {
  const t = useTranslations('checkout');
  const { data: session } = useSession();
  const { form, onSubmit, isPending, error } = useCheckoutForm();

  const items = useCartStore((state) => state.items);
  const email = session?.user.email;
  const isRegistered = !!email;

  // Prefill + lock the email field when checking out as a registered user.
  useEffect(() => {
    if (isRegistered && email) {
      form.setValue('email', email, { shouldValidate: true });
    }
  }, [isRegistered, email, form]);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3 px-4 py-24 text-center text-muted-foreground">
        <ShoppingCart className="h-10 w-10 opacity-40" />
        <p className="text-sm">{t('empty')}</p>
        <Link href={ROUTES.BASE} className="text-sm underline">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t('title')}</h1>

      <form
        onSubmit={onSubmit}
        className="mt-4 grid gap-8 md:grid-cols-[1fr_360px]"
      >
        <CheckoutForm
          register={form.register}
          control={form.control}
          errors={form.formState.errors}
          emailDisabled={isRegistered}
        />
        <CheckoutSummary
          isValid={form.formState.isValid}
          isPending={isPending}
          error={error}
        />
      </form>
    </div>
  );
};
