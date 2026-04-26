# UI Best Practices — Templates

## Query hook

```ts
'use client';

import { useQuery } from '@tanstack/react-query';

import { CategoryFilter } from '@/backend/features/category';
import { api } from '@/frontend/features/api';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useCategories(query?: CategoryFilter) {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, query],
    queryFn: () => api.getCategories({ query }),
  });
}
```

---

## Create mutation hook

```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/frontend/constants';
import { api } from '@/frontend/features/api';
import { useRouter } from '@/frontend/features/translation/i18n/navigation';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      router.push(ROUTES.ADMIN_CATEGORIES);
    },
  });
}
```

---

## Edit mutation hook

```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useEditCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}
```

---

## Delete mutation hook

```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { CATEGORIES_QUERY_KEY } from '../constants';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}
```

---

## Shared schema hook

```ts
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

export function useCategoryFormSchema() {
  const t = useTranslations('common');
  const tCategory = useTranslations('category');

  return useMemo(
    () =>
      yup.object({
        color: yup.string().required(tCategory('colorRequired')).min(1, tCategory('colorRequired')),
        translations: yup
          .array(
            yup.object({
              language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
              name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
            })
          )
          .required(),
      }),
    [t, tCategory],
  );
}
```

---

## Create form hook

```ts
'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import { supportedLngs } from '@/frontend/features/translation';

import { CategoryFormValues } from '../types';
import { useCreateCategory } from './use-create-category';
import { useCategoryFormSchema } from './use-category-form-schema';

export function useCreateCategoryForm() {
  const schema = useCategoryFormSchema();

  const defaultValues: CategoryFormValues = {
    color: '',
    translations: supportedLngs.map((lng) => ({ language: lng, name: '' })),
  };

  const form = useForm<CategoryFormValues>({ defaultValues, resolver: yupResolver(schema) });
  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreateCategory();

  const onSubmit = handleSubmit((body) => {
    mutate({ body }, { onSuccess: () => reset() });
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
```

---

## Edit form hook

```ts
'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import type { CategoryWithTranslations } from '@/backend/features/category';
import { supportedLngs } from '@/frontend/features/translation';

import { CategoryFormValues } from '../types';
import { useEditCategory } from './use-edit-category';
import { useCategoryFormSchema } from './use-category-form-schema';

export function useEditCategoryForm(category: CategoryWithTranslations, onSuccess?: () => void) {
  const schema = useCategoryFormSchema();

  const defaultValues: CategoryFormValues = {
    color: category.color,
    translations: supportedLngs.map((lng) => {
      const existing = category.translations.find((tr) => tr.language === lng);
      return { language: lng, name: existing?.name ?? '' };
    }),
  };

  const form = useForm<CategoryFormValues>({ defaultValues, resolver: yupResolver(schema) });
  const { handleSubmit, register, control, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useEditCategory();

  const onSubmit = handleSubmit((body) => {
    mutate({ params: { id: category.id }, body }, { onSuccess });
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
```

---

## Shared FormFields component

```tsx
'use client';

import { FC } from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslations } from 'next-intl';

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
  register, control, fields, errors,
  onSubmit, isPending, isSuccess, error,
  submitLabel, pendingLabel, successMessage,
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
              key={field.id}
              language={field.language as never}
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
```

---

## Create form wrapper

```tsx
'use client';

import { useTranslations } from 'next-intl';

import { useCreateCategoryForm } from '../hooks';
import { CategoryFormFields } from './CategoryFormFields';

export const CreateCategoryForm = () => {
  const tCategory = useTranslations('category');
  const tCommon = useTranslations('common');
  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } =
    useCreateCategoryForm();

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{tCategory('createCategory')}</h2>
      <CategoryFormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        submitLabel={tCategory('createCategory')}
        pendingLabel={tCommon('creating')}
        successMessage={tCategory('createSuccess')}
      />
    </div>
  );
};
```

---

## Edit modal wrapper

```tsx
'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useState } from 'react';

import type { CategoryWithTranslations } from '@/backend/features/category';
import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

import { useEditCategoryForm } from '../hooks';
import { CategoryFormFields } from './CategoryFormFields';

interface EditCategoryModalProps {
  category: CategoryWithTranslations;
  disabled?: boolean;
}

export const EditCategoryModal: FC<EditCategoryModalProps> = ({ category, disabled }) => {
  const tCategory = useTranslations('category');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const handleSuccess = useCallback(() => setOpen(false), []);

  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } =
    useEditCategoryForm(category, handleSuccess);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={tCategory('editCategory')}
      contentClassName="max-w-lg"
      trigger={
        <Button variant="ghost" size="icon" className="size-7" disabled={disabled}>
          <Pencil className="text-muted-foreground" size={16} />
        </Button>
      }
    >
      <CategoryFormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        submitLabel={tCategory('editCategory')}
        pendingLabel={tCommon('saving')}
        successMessage={tCategory('editSuccess')}
      />
    </Modal>
  );
};
```

---

## TranslationTabContent

```tsx
'use client';

import { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { FormInputField } from '@/frontend/components/FormInputField';
import { FormTextAreaField } from '@/frontend/components/FormTextAreaField';
import { TabsContent } from '@/frontend/components/ui/tabs';

import { SUPPORTED_LANGUAGE } from '../../translation';
import { CategoryFormValues } from '../types';

type Props = {
  lng: SUPPORTED_LANGUAGE;
  index: number;
  errors: FieldErrors<CategoryFormValues>;
  register: UseFormRegister<CategoryFormValues>;
};

export const CategoryTranslationTabContent: FC<Props> = ({ lng, index, errors, register }) => {
  const tCommon = useTranslations('common');
  const tCategory = useTranslations('category');
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
      {/* Add FormTextAreaField for description if needed */}
    </TabsContent>
  );
};
```

---

## Types file

```ts
import { SUPPORTED_LANGUAGE } from '../translation';

export type CategoryTranslationField = {
  language: SUPPORTED_LANGUAGE;
  name: string;
};

export type CategoryFormValues = {
  color: string;
  translations: CategoryTranslationField[];
};
```

---

## Constants file

```ts
export const CATEGORIES_QUERY_KEY = 'categories';
export const CATEGORIES_BY_IDS = 'categories-by-ids';
export const CATEGORY_DETAILS = 'category-details';
```

---

## Barrel files

**`components/index.ts`**
```ts
export { CategoryBadge } from './CategoryBadge';
export { CategoryFormFields } from './CategoryFormFields';
export { CategoryTranslationTabContent } from './CategoryTranslationTabContent';
export { CreateCategoryForm } from './CreateCategoryForm';
export { EditCategoryModal } from './EditCategoryModal';
```

**`hooks/index.ts`**
```ts
export { useCategories } from './use-categories';
export { useCategoryFormSchema } from './use-category-form-schema';
export { useCreateCategory } from './use-create-category';
export { useCreateCategoryForm } from './use-create-category-form';
export { useDeleteCategory } from './use-delete-category';
export { useEditCategory } from './use-edit-category';
export { useEditCategoryForm } from './use-edit-category-form';
```

**`index.ts` (feature root — public API only)**
```ts
export { CategoriesList, CategoryBadge, CreateCategoryForm } from './components';
export type { CategoryFormValues } from './types';
```

---

## Offset pagination hook (feature-level)

```ts
'use client';

import { useOffsetPagination } from '@/frontend/features/react-query';
import { useDebounce } from '@/frontend/features/hooks';
import { api } from '@/frontend/features/api';
import { FileFilter } from '@/backend/features/file';

import { FILES_QUERY_KEY } from '../constants';

export function useFiles(filter?: FileFilter) {
  const debouncedFilter = useDebounce(filter, 300);

  return useOffsetPagination({
    queryKey: [FILES_QUERY_KEY, debouncedFilter],
    queryFn: (offset) => api.getFiles({ query: { ...debouncedFilter, offset } }),
  });
}
```

Consumer:
```ts
const { items, fetchNextPage, queryProps: { isPending, hasNextPage, isFetchingNextPage } } = useFiles(filter);
```

---

## Cache-read for pre-fetched related data

Parent list pre-fetches category data:
```ts
useCategoriesByIds(products.map((p) => p.categoryId));
```

Child card reads from cache without fetching:
```ts
import { useCacheQuery } from '@/frontend/features/react-query';
import { CATEGORY_DETAILS } from '@/frontend/features/categories/constants';
import type { CategoryWithTranslations } from '@/backend/features/category';

const { data: category } = useCacheQuery<CategoryWithTranslations>({
  queryKey: [CATEGORY_DETAILS, item.categoryId],
});
```
