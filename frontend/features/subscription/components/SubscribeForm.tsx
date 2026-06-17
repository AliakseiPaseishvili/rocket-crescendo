'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';

import { SubscribeResultMessage } from './SubscribeResultMessage';
import { useSubscribeForm } from '../hooks/use-subscribe-form';

export const SubscribeForm = () => {
  const t = useTranslations('subscription');
  const { register, errors, onSubmit, isPending, status, error } = useSubscribeForm();

  return (
    <form onSubmit={onSubmit} className="mt-8 flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Input
          type="email"
          placeholder={t('form.emailPlaceholder')}
          aria-label={t('form.emailLabel')}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? t('form.subscribing') : t('form.subscribeButton')}
      </Button>
      <SubscribeResultMessage status={status} isError={!!error} />
    </form>
  );
};
