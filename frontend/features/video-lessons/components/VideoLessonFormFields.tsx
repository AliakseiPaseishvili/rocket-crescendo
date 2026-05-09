'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { FormInputField } from '@/frontend/components/FormInputField';
import { Button } from '@/frontend/components/ui/button';
import { Tabs, TabsContent, TabsList } from '@/frontend/components/ui/tabs';
import { MediaPickerCard } from '@/frontend/features/products/components';
import { TranslationTabTrigger } from '@/frontend/features/translation/components';

import { VideoLessonFormValues } from '../types';

interface VideoLessonFormFieldsProps {
  register: UseFormRegister<VideoLessonFormValues>;
  control: Control<VideoLessonFormValues>;
  fields: { id: string; language: string }[];
  errors: FieldErrors<VideoLessonFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  error: Error | null;
  submitLabel: string;
  pendingLabel: string;
}

export const VideoLessonFormFields: FC<VideoLessonFormFieldsProps> = ({
  register,
  control,
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
              label={tVl('lessonName')}
              placeholder={t('namePlaceholder')}
              errorMessage={errors.translations?.[index]?.name?.message}
              registration={register(`translations.${index}.name`)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Controller
        name="video"
        control={control}
        render={({ field }) => (
          <MediaPickerCard
            label={tVl('video')}
            fileType="VIDEO"
            selectedFile={field.value}
            onSelect={field.onChange}
            onRemove={() => field.onChange(null)}
          />
        )}
      />

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
};
