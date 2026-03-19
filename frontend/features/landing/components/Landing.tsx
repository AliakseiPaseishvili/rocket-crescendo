'use client';

import { Button } from '@/frontend/components/ui/button';
import { useTranslation } from 'react-i18next';

export const Landing = () => {
  const { t } = useTranslation('common');

  return <div>
    {t('hello')}
    <Button>Save</Button>
  </div>;
};
