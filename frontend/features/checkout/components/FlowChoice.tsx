'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { Button } from '@/frontend/components/ui/button';

interface FlowChoiceProps {
  onGuest: () => void;
  onRegistered: () => void;
}

export const FlowChoice: FC<FlowChoiceProps> = ({ onGuest, onRegistered }) => {
  const t = useTranslations('checkout');

  return (
    <div className="mt-6 flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t('flowPrompt')}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" onClick={onGuest}>
          {t('flowGuestContinue')}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={onRegistered}
        >
          {t('flowSignIn')}
        </Button>
      </div>
    </div>
  );
};
