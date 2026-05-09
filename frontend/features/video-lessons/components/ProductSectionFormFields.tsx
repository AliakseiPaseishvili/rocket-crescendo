'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import { FormInputField } from '@/frontend/components/FormInputField';
import { Button } from '@/frontend/components/ui/button';
import { Tabs, TabsContent, TabsList } from '@/frontend/components/ui/tabs';
import { TranslationTabTrigger } from '@/frontend/features/translation/components';

import { ProductSectionFormValues } from '../types';

interface ProductSectionFormFieldsProps {
  register: UseFormRegister<ProductSectionFormValues>;
  control: Control<ProductSectionFormValues>;
  fields: { id: string; language: string }[];
  errors: FieldErrors<ProductSectionFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  error: Error | null;
  submitLabel: string;
  pendingLabel: string;
}

export const ProductSectionFormFields: FC<ProductSectionFormFieldsProps> = ({
  register,
  fields,
  errors,
  onSubmit,
  isPending,
  error,
  submitLabel,
  pendingLabel,
}) => {
  const t = useTranslations('common');
  const tVl = useTranslations('videoLesson');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <TranslationTabTrigger
              key={field.id}
              language={field.language as never}
              hasError={!!errors.translations?.[index]?.name}
            />
          ))}
        </TabsList>
        {fields.map((field, index) => (
          <TabsContent key={field.id} value={field.language} className="mt-3">
            <FormInputField
              id={`translations.${index}.name`}
              label={tVl('sectionName')}
              placeholder={t('namePlaceholder')}
              errorMessage={errors.translations?.[index]?.name?.message}
              registration={register(`translations.${index}.name`)}
            />
          </TabsContent>
        ))}
      </Tabs>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
};
