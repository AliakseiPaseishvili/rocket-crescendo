'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { FormInputField } from '@/frontend/components/FormInputField';
import { TabsContent } from '@/frontend/components/ui/tabs';

import { SUPPORTED_LANGUAGE } from '../../translation';
import { CategoryFormValues } from '../types';

type CategoryTranslationTabContentProps = {
  lng: SUPPORTED_LANGUAGE;
  index: number;
  errors: FieldErrors<CategoryFormValues>;
  register: UseFormRegister<CategoryFormValues>;
};

export const CategoryTranslationTabContent: FC<CategoryTranslationTabContentProps> = ({ lng, index, errors, register }) => {
  const tCategory = useTranslations('category');
  const tCommon = useTranslations('common');
  const translationErrors = errors.translations?.[index];

  return (
    <TabsContent value={lng} className="flex flex-col gap-3 mt-3">
      <FormInputField
        id={`translations.${index}.name`}
        label={tCommon('name')}
        placeholder={tCategory('namePlaceholder')}
        errorMessage={translationErrors?.name?.message}
        registration={register(`translations.${index}.name`)}
      />
    </TabsContent>
  );
};
