'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { ColorPicker } from '@/frontend/components/ColorPicker';
import { Button } from '@/frontend/components/ui/button';
import { Tabs, TabsList } from '@/frontend/components/ui/tabs';
import { TranslationTabTrigger } from '@/frontend/features/translation/components';

import { CategoryFormValues } from '../types';
import { CategoryTranslationTabContent } from './CategoryTranslationTabContent';

type FieldItem = { id: string; language: string };

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryFormValues>;
  control: Control<CategoryFormValues>;
  fields: FieldItem[];
  errors: FieldErrors<CategoryFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
}

export const CategoryFormFields: FC<CategoryFormFieldsProps> = ({
  register,
  control,
  fields,
  errors,
  onSubmit,
  isPending,
  isSuccess,
  error,
  submitLabel,
  pendingLabel,
  successMessage,
}) => {
  const tCommon = useTranslations('common');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <ColorPicker
            label={tCommon('color')}
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.color?.message}
          />
        )}
      />

      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <TranslationTabTrigger
              language={field.language as never}
              key={field.id}
              hasError={!!errors.translations?.[index]?.name}
            />
          ))}
        </TabsList>

        {fields.map((field, index) => (
          <CategoryTranslationTabContent
            key={field.id}
            lng={field.language as never}
            index={index}
            errors={errors}
            register={register}
          />
        ))}
      </Tabs>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">{successMessage}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
};
