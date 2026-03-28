'use client';

import { FC } from 'react';
import { FieldErrors } from 'react-hook-form';

import { TabsTrigger } from '@/frontend/components/ui/tabs';
import { languageLabels, SUPPORTED_LANGUAGE } from '@/frontend/features/translation';

import { CategoryFormValues } from '../types';

type CategoryTranslationTabTriggerProps = {
  language: SUPPORTED_LANGUAGE;
  index: number;
  errors: FieldErrors<CategoryFormValues>;
};

export const CategoryTranslationTabTrigger: FC<CategoryTranslationTabTriggerProps> = ({ language, index, errors }) => {
  const hasError = !!errors.translations?.[index]?.name;

  return (
    <TabsTrigger value={language} className="flex-1 relative">
      {languageLabels[language]}
      {hasError && <span className="right-1 top-1 absolute size-1.5 rounded-full bg-destructive" />}
    </TabsTrigger>
  );
};
