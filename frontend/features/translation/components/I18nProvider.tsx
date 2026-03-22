'use client';

import { ReactNode } from 'react';

import i18n from '../i18n';

export const  I18nProvider = ({ lng, children }: { lng: string; children: ReactNode }) => {
  if (i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }
  return <>{children}</>;
}
