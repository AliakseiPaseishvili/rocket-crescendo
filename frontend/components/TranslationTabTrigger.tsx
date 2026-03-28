'use client';

import { FC } from 'react';

import { TabsTrigger } from '@/frontend/components/ui/tabs';
import { languageLabels, SUPPORTED_LANGUAGE } from '@/frontend/features/translation';

type TranslationTabTriggerProps = {
  language: SUPPORTED_LANGUAGE;
  hasError: boolean;
};

export const TranslationTabTrigger: FC<TranslationTabTriggerProps> = ({ language, hasError }) => {
  return (
    <TabsTrigger value={language} className="flex-1 relative">
      {languageLabels[language]}
      {hasError && <span className="right-1 top-1 absolute size-1.5 rounded-full bg-destructive" />}
    </TabsTrigger>
  );
};
