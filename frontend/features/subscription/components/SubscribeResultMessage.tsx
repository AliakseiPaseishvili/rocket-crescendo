'use client';

import { useTranslations } from 'next-intl';

import type { SubscribeResult } from '@/backend/features/subscription';

interface SubscribeResultMessageProps {
  status?: SubscribeResult['status'];
  isError: boolean;
}

export const SubscribeResultMessage = ({ status, isError }: SubscribeResultMessageProps) => {
  const t = useTranslations('subscription');

  if (status) {
    return (
      <p className="text-sm text-green-600">
        {status === 'pending' ? t('form.successPending') : t('form.successConfirmed')}
      </p>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">{t('form.errorMessage')}</p>;
  }

  return null;
};
