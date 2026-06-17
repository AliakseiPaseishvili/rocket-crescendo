'use client';

import { useTranslations } from 'next-intl';

import { useSession } from '@/frontend/features/auth';

import { SubscribeButton } from './SubscribeButton';
import { SubscribeForm } from './SubscribeForm';

export const SubscribeNewsletter = () => {
  const t = useTranslations('subscription');
  const { data: session, isPending } = useSession();

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mt-4 max-w-md text-center text-muted-foreground">{t('form.description')}</p>
      {!isPending &&
        (session?.user ? <SubscribeButton email={session.user.email} /> : <SubscribeForm />)}
    </div>
  );
};
