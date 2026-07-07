'use client';

import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { ROUTES } from '@/frontend/constants';
import { useSession } from '@/frontend/features/auth';
import { useCartStore } from '@/frontend/features/cart';
import { Link, useRouter } from '@/frontend/features/translation/i18n/navigation';

import { CheckoutForm } from './CheckoutForm';
import { CheckoutSummary } from './CheckoutSummary';
import { FlowChoice } from './FlowChoice';
import { useCheckoutForm } from '../hooks';

export const CheckoutView = () => {
  const t = useTranslations('checkout');
  const router = useRouter();
  const { data: session } = useSession();
  const { form, onSubmit, isPending, error } = useCheckoutForm();
  // Anonymous-only: whether the guest picked "Continue as guest" yet.
  // Registered (logged-in) users skip this — their flow is predefined.
  const [guestChosen, setGuestChosen] = useState(false);

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

      {!isRegistered && !guestChosen ? (
        <FlowChoice
          onGuest={() => setGuestChosen(true)}
          onRegistered={() => router.push(ROUTES.SIGN_IN)}
        />
      ) : (
        <>
          {!isRegistered && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2.5"
              onClick={() => setGuestChosen(false)}
            >
              <ArrowLeft />
              {t('back')}
            </Button>
          )}

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
        </>
      )}
    </div>
  );
};
