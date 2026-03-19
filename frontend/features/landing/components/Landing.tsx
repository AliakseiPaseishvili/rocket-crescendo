'use client';

import { useTranslation } from 'react-i18next';

export const Landing = () => {
  const { t } = useTranslation('common');

  return <div>{t('hello')}</div>;
};
