'use client';

import { Messages, useTranslations } from 'next-intl';
import { ReactNode } from 'react';

interface LandingSectionProps {
  id: string;
  titleKey: keyof Messages['nav'];
  children?: ReactNode;
}

export const LandingSection = ({ id, titleKey, children }: LandingSectionProps) => {
  const t = useTranslations('nav');

  return (
    <section id={id} className="flex w-full min-h-screen flex-col items-center justify-center border-b">
      <h1 className="text-6xl font-bold">{t(titleKey)}</h1>
      {children}
    </section>
  );
};
