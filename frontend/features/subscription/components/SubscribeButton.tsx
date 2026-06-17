'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';

import { SubscribeResultMessage } from './SubscribeResultMessage';
import { useSubscribe } from '../hooks/use-subscribe';

interface SubscribeButtonProps {
  email: string;
}

export const SubscribeButton = ({ email }: SubscribeButtonProps) => {
  const t = useTranslations('subscription');
  const { subscribe, isPending, status, error } = useSubscribe();

  return (
    <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
      <Button onClick={() => subscribe(email)} disabled={isPending}>
        {isPending ? t('form.subscribing') : t('form.subscribeButton')}
      </Button>
      <SubscribeResultMessage status={status} isError={!!error} />
    </div>
  );
};
