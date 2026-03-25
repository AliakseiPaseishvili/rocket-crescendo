'use client';
import { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormInputField } from '@/frontend/components/FormInputField';
import { FormTextAreaField } from '@/frontend/components/FormTextAreaField';
import { TabsContent } from '@/frontend/components/ui/tabs';

import { SUPPORTED_LANGUAGE } from '../../translation';
import { ProductFormValues } from '../types';

type TranslationTabContentProps = {
  lng: SUPPORTED_LANGUAGE;
  index: number;
  errors: FieldErrors<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
};

export const TranslationTabContent: FC<TranslationTabContentProps> = ({ lng, index, errors, register }) => {
  const { t } = useTranslation(['product', 'common']);
  const translationErrors = errors.translations?.[index];

  return (
    <TabsContent value={lng} className="flex flex-col gap-3 mt-3">
      <FormInputField
        id={`translations.${index}.name`}
        label={t('common:name')}
        placeholder={t('product:namePlaceholder')}
        errorMessage={translationErrors?.name?.message}
        registration={register(`translations.${index}.name`)}
      />
      <FormTextAreaField
        rows={3}
        id={`translations.${index}.description`}
        label={t('common:description')}
        placeholder={t('product:descriptionPlaceholder')}
        errorMessage={translationErrors?.description?.message}
        registration={register(`translations.${index}.description`)}
      />
    </TabsContent>
  );
};
