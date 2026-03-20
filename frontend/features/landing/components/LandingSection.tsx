'use client';

import { useTranslation } from 'react-i18next';
import { ParseKeys } from 'i18next';
import { ReactNode } from 'react';

interface LandingSectionProps {
  id: string;
  titleKey: ParseKeys<'nav'>;
  children?: ReactNode;
}

export const LandingSection = ({ id, titleKey, children }: LandingSectionProps) => {
  const { t } = useTranslation('nav');

  return (
    <section id={id} className="flex w-full min-h-screen flex-col items-center justify-center border-b">
      <h1 className="text-6xl font-bold">{t(titleKey)}</h1>
      {children}
    </section>
  );
};
