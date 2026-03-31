'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Checkbox } from '@/frontend/components/ui/checkbox';
import { Label } from '@/frontend/components/ui/label';
import { Tabs, TabsList } from '@/frontend/components/ui/tabs';
import { CategorySelector } from '@/frontend/features/categories/components';
import { TranslationTabTrigger } from '@/frontend/features/translation/components';

import { ProductFormValues } from '../types';
import { TranslationTabContent } from './TranslationTabContent';

type FieldItem = { id: string; language: string };

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  fields: FieldItem[];
  errors: FieldErrors<ProductFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
}

export const ProductFormFields: FC<ProductFormFieldsProps> = ({
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
  const tProduct = useTranslations('product');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <TranslationTabTrigger
              language={field.language as never}
              key={field.id}
              hasError={!!(errors.translations?.[index]?.name || errors.translations?.[index]?.description)}
            />
          ))}
        </TabsList>
        {fields.map((field, index) => (
          <TranslationTabContent
            key={field.id}
            lng={field.language as never}
            index={index}
            errors={errors}
            register={register}
          />
        ))}
      </Tabs>

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <CategorySelector
            value={field.value}
            onChange={field.onChange}
            error={errors.categoryId?.message}
          />
        )}
      />

      <div className="flex items-center gap-2">
        <Controller
          name="favorite"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="product-favorite"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="product-favorite" className="cursor-pointer">
          {tProduct('favorite')}
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">{successMessage}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
};
