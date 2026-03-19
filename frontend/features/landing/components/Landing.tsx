'use client';

import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/frontend/features/translation/components';

export const Landing = () => {
  const { t } = useTranslation('common');

  return <div>
    {t('hello')}
    <LanguageSelector />
  </div>;
};
