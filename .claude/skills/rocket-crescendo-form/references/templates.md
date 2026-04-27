# Form Templates

## FormValues type (`types.ts`)

```ts
// frontend/features/<feature>/types.ts
export type <Entity>FormValues = {
  name: string;
  // add other fields
};

// If multilingual:
import type { SUPPORTED_LANGUAGE } from '@/frontend/features/translation';

export type <Entity>TranslationField = {
  language: SUPPORTED_LANGUAGE;
  name: string;
};

export type <Entity>FormValues = {
  translations: <Entity>TranslationField[];
  // other fields
};
```

---

## Schema hook — shared by create and edit (`hooks/use-<entity>-form-schema.ts`)

```ts
'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

export function use<Entity>FormSchema() {
  const t = useTranslations('common');
  const tEntity = useTranslations('<entityNamespace>');

  return useMemo(
    () =>
      yup.object({
        name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
        // multilingual translations array:
        translations: yup.array(
          yup.object({
            language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
            name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
          })
        ).required(),
      }),
    [t, tEntity]
  );
}
```

---

## Schema hook — schema composition (sign-up extends sign-in pattern)

```ts
'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

import { useBaseSchema } from './use-base-schema';

export const useExtendedSchema = () => {
  const t = useTranslations('<namespace>');
  const baseSchema = useBaseSchema();

  return useMemo(
    () =>
      baseSchema.shape({
        extraField: yup.string().required(t('extraFieldRequired')),
      }),
    [baseSchema, t],
  );
};
```

---

## Create form hook (`hooks/use-create-<entity>-form.ts`)

```ts
'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import { supportedLngs } from '@/frontend/features/translation';

import { <Entity>FormValues } from '../types';
import { use<Entity>FormSchema } from './<use-entity>-form-schema';
import { useCreate<Entity> } from './use-create-<entity>';

export function useCreate<Entity>Form() {
  const schema = use<Entity>FormSchema();

  const defaultValues: <Entity>FormValues = {
    // For multilingual entities:
    translations: supportedLngs.map((lng) => ({
      language: lng,
      name: '',
    })),
    // other fields with sensible empty/zero defaults
  };

  const form = useForm<<Entity>FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  // Only when translations field array is used:
  const { fields } = useFieldArray({ control, name: 'translations' });

  const { mutate, isPending, isSuccess, error } = useCreate<Entity>();

  const onSubmit = handleSubmit((body) => {
    mutate({ body }, { onSuccess: () => reset() });
  });

  return {
    register,
    control,
    fields,    // omit if no field array
    errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
  };
}
```

---

## Edit form hook (`hooks/use-edit-<entity>-form.ts`)

```ts
'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import type { <Entity>WithTranslations } from '@/backend/features/<entity>';
import { supportedLngs } from '@/frontend/features/translation';

import { <Entity>FormValues } from '../types';
import { use<Entity>FormSchema } from './use-<entity>-form-schema';
import { useEdit<Entity> } from './use-edit-<entity>';

export function useEdit<Entity>Form(entity: <Entity>WithTranslations, onSuccess?: () => void) {
  const schema = use<Entity>FormSchema();

  const defaultValues: <Entity>FormValues = {
    // For multilingual entities — map all supported languages, fallback to empty:
    translations: supportedLngs.map((lng) => {
      const existing = entity.translations.find((tr) => tr.language === lng);
      return {
        language: lng,
        name: existing?.name ?? '',
      };
    }),
    // other fields from entity
  };

  const form = useForm<<Entity>FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, formState: { errors } } = form;
  // Only when translations field array is used:
  const { fields } = useFieldArray({ control, name: 'translations' });

  const { mutate, isPending, isSuccess, error } = useEdit<Entity>();

  const onSubmit = handleSubmit((body) => {
    mutate({ params: { id: entity.id }, body }, { onSuccess });
  });

  return {
    register,
    control,
    fields,    // omit if no field array
    errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
  };
}
```

---

## Shared FormFields component (`components/<Entity>FormFields.tsx`)

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Tabs, TabsList } from '@/frontend/components/ui/tabs';
import { TranslationTabTrigger } from '@/frontend/features/translation/components';

import { <Entity>FormValues } from '../types';
import { <Entity>TranslationTabContent } from './<Entity>TranslationTabContent';

type FieldItem = { id: string; language: string };

interface <Entity>FormFieldsProps {
  register: UseFormRegister<<Entity>FormValues>;
  control: Control<<Entity>FormValues>;
  fields: FieldItem[];
  errors: FieldErrors<<Entity>FormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
}

export const <Entity>FormFields: FC<<Entity>FormFieldsProps> = ({
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
  const t = useTranslations('<namespace>');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Simple text input */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t('fields.name')}</Label>
        <Input id="name" type="text" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Controlled input (checkbox, select, color picker, custom) */}
      <Controller
        name="someField"
        control={control}
        render={({ field }) => (
          <SomeCustomInput
            value={field.value}
            onChange={field.onChange}
            error={errors.someField?.message}
          />
        )}
      />

      {/* Translation tabs (multilingual) */}
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
          <Entity>TranslationTabContent
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
```

---

## Create form wrapper (`components/Create<Entity>Form.tsx`)

```tsx
'use client';

import { useTranslations } from 'next-intl';

import { useCreate<Entity>Form } from '../hooks';
import { <Entity>FormFields } from './<Entity>FormFields';

export const Create<Entity>Form = () => {
  const t = useTranslations('<namespace>');
  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } =
    useCreate<Entity>Form();

  return (
    <Entity>FormFields
      register={register}
      control={control}
      fields={fields}
      errors={errors}
      onSubmit={onSubmit}
      isPending={isPending}
      isSuccess={isSuccess}
      error={error}
      submitLabel={t('create.submit')}
      pendingLabel={t('create.submitting')}
      successMessage={t('create.success')}
    />
  );
};
```

---

## Edit form modal wrapper (`components/Edit<Entity>Modal.tsx`)

```tsx
'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { <Entity>WithTranslations } from '@/backend/features/<entity>';
import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

import { useEdit<Entity>Form } from '../hooks';
import { <Entity>FormFields } from './<Entity>FormFields';

interface Edit<Entity>ModalProps {
  entity: <Entity>WithTranslations;
}

export const Edit<Entity>Modal = ({ entity }: Edit<Entity>ModalProps) => {
  const t = useTranslations('<namespace>');
  const [open, setOpen] = useState(false);

  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } =
    useEdit<Entity>Form(entity, () => setOpen(false));

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="ghost" size="icon" className="size-7">
          <Pencil className="size-4" />
        </Button>
      }
      title={t('edit.title')}
      className="max-w-lg"
    >
      <<Entity>FormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        submitLabel={t('edit.submit')}
        pendingLabel={t('edit.submitting')}
        successMessage={t('edit.success')}
      />
    </Modal>
  );
};
```

---

## Auth exception — self-contained form (no mutation, no FormFields)

```tsx
'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';

import { someAuthMethod } from '../auth-client';
import { useSomeSchema } from '../hooks';

type FormValues = {
  email: string;
  password: string;
};

export const SomeAuthForm = () => {
  const t = useTranslations('auth');
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useSomeSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await someAuthMethod({ email: values.email, password: values.password });
    if (error) {
      setServerError(error.message ?? t('errors.failed'));
      return;
    }
    // redirect / refresh
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('someForm.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t('fields.email')}</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          {serverError && <p className="text-destructive text-sm">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('someForm.submitting') : t('someForm.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

---

## Single-use inline schema (inside form hook, no dedicated schema file)

```ts
// Inside use-create-<entity>-form.ts when schema is never shared
const schema = useMemo(
  () =>
    yup.object({
      name: yup.string().required(t('nameRequired')).min(1, t('nameRequired')),
      file: yup
        .mixed<File>()
        .required(t('fileRequired'))
        .test('is-file', t('fileRequired'), (v) => v instanceof File),
    }),
  [t],
);
```

---

## TranslationTabContent sub-component

```tsx
'use client';

import { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { TabsContent } from '@/frontend/components/ui/tabs';
import { SUPPORTED_LANGUAGE } from '@/frontend/features/translation';

import { <Entity>FormValues } from '../types';

interface <Entity>TranslationTabContentProps {
  lng: SUPPORTED_LANGUAGE;
  index: number;
  errors: FieldErrors<<Entity>FormValues>;
  register: UseFormRegister<<Entity>FormValues>;
}

export const <Entity>TranslationTabContent: FC<<Entity>TranslationTabContentProps> = ({
  lng,
  index,
  errors,
  register,
}) => {
  const t = useTranslations('common');

  return (
    <TabsContent value={lng} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`translations.${index}.name`}>{t('name')}</Label>
        <Input
          id={`translations.${index}.name`}
          type="text"
          {...register(`translations.${index}.name`)}
        />
        {errors.translations?.[index]?.name && (
          <p className="text-sm text-destructive">{errors.translations[index].name.message}</p>
        )}
      </div>
    </TabsContent>
  );
};
```
