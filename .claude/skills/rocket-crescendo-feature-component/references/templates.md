# Feature Component Templates

## Component

```tsx
// Add 'use client'; only when client logic exists (hooks, event handlers, browser APIs, useTranslations, etc.)
// Omit entirely for pure server components.

import { useTranslations } from 'next-intl';
// shadcn: import { Button } from '@/frontend/components/ui/button';
// icons:  import { SomeIcon } from 'lucide-react';
// cross-feature: import { SomeThing } from '@/frontend/features/<feature>';

interface <Name>Props {
  prop: string;
  onAction?: () => void;
}

export const <Name> = ({ prop, onAction }: <Name>Props) => {
  const t = useTranslations('<namespace>');
  // multiple namespaces: const tCommon = useTranslations('common');

  return (
    <div className="flex flex-col gap-4">
      {/* Tailwind semantic tokens: bg-background text-foreground text-muted-foreground
          border-border bg-muted text-destructive
          hover:bg-muted transition-colors
          responsive: hidden md:flex md:hidden sm:grid-cols-3 */}
    </div>
  );
};
```

---

## Query hook (`hooks/use-<resource>s.ts`)

```ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/frontend/features/api';
import { <RESOURCE>S_QUERY_KEY } from '../constants';

export function use<Resource>s() {
  return useQuery({
    queryKey: [<RESOURCE>S_QUERY_KEY],
    queryFn: () => api.get<Resource>s(undefined),
  });
}
```

---

## Mutation hook (`hooks/use-delete-<resource>.ts`)

```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/frontend/features/api';
import { <RESOURCE>S_QUERY_KEY } from '../constants';

export function useDelete<Resource>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (options: { params: { id: number } }) => api.delete<Resource>(options),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [<RESOURCE>S_QUERY_KEY] }),
  });
}
```

For create (body only): `mutationFn: (options: { body: <Resource>CreateInput }) => api.create<Resource>(options)`

For update (body + params): `mutationFn: (options: { params: { id: number }; body: <Resource>UpdateInput }) => api.update<Resource>(options)`

---

## Form hook with multi-language translations (`hooks/use-create-<resource>-form.ts`)

```ts
'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';
import { useCreate<Resource> } from './use-create-<resource>';
import { <Resource>FormValues } from '../types';

export function useCreate<Resource>Form() {
  const t = useTranslations('common');
  const tResource = useTranslations('<resource>');

  const schema = useMemo(() => yup.object({
    translations: yup.array(yup.object({
      language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
      name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
    })).required(),
    // add other fields here (e.g. favorite, categoryId, color)
  }), [t, tResource]);

  const defaultValues: <Resource>FormValues = {
    translations: supportedLngs.map((lng) => ({ language: lng, name: '' })),
  };

  const form = useForm<<Resource>FormValues>({ defaultValues, resolver: yupResolver(schema) });
  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreate<Resource>();

  const onSubmit = handleSubmit((body) => {
    mutate({ body }, { onSuccess: () => reset() });
  });

  return { register, control, fields, errors, onSubmit, isPending, isSuccess, error };
}
```

---

## Create form with translation tabs (`components/Create<Resource>Form.tsx`)

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/frontend/components/ui/button';
import { Tabs, TabsList } from '@/frontend/components/ui/tabs';
import { TranslationTabTrigger } from '@/frontend/features/translation/components';
import { useCreate<Resource>Form } from '../hooks';
import { <Resource>TranslationTabContent } from './<Resource>TranslationTabContent';

export const Create<Resource>Form = () => {
  const t = useTranslations('<resource>');
  const tCommon = useTranslations('common');
  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } = useCreate<Resource>Form();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{t('create<Resource>')}</h2>

      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <TranslationTabTrigger
              key={field.id}
              language={field.language}
              hasError={!!errors.translations?.[index]?.name}
            />
          ))}
        </TabsList>
        {fields.map((field, index) => (
          <<Resource>TranslationTabContent
            key={field.id}
            lng={field.language}
            index={index}
            errors={errors}
            register={register}
          />
        ))}
      </Tabs>

      {/* For Controller fields (Checkbox, CategorySelector, ColorPicker):
      <Controller name="fieldName" control={control}
        render={({ field }) => <CategorySelector value={field.value} onChange={field.onChange} error={errors.fieldName?.message} />}
      /> */}

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">{t('createSuccess')}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? tCommon('creating') : t('create<Resource>')}
      </Button>
    </form>
  );
};
```

---

## TranslationTabContent (`components/<Resource>TranslationTabContent.tsx`)

```tsx
'use client';

import { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FormInputField } from '@/frontend/components/FormInputField';
import { FormTextAreaField } from '@/frontend/components/FormTextAreaField';
import { TabsContent } from '@/frontend/components/ui/tabs';
import { SUPPORTED_LANGUAGE } from '../../translation';
import { <Resource>FormValues } from '../types';

type Props = {
  lng: SUPPORTED_LANGUAGE;
  index: number;
  errors: FieldErrors<<Resource>FormValues>;
  register: UseFormRegister<<Resource>FormValues>;
};

export const <Resource>TranslationTabContent: FC<Props> = ({ lng, index, errors, register }) => {
  const tCommon = useTranslations('common');
  const tResource = useTranslations('<resource>');
  const translationErrors = errors.translations?.[index];

  return (
    <TabsContent value={lng} className="flex flex-col gap-3 mt-3">
      <FormInputField
        id={`translations.${index}.name`}
        label={tCommon('name')}
        placeholder={tResource('namePlaceholder')}
        errorMessage={translationErrors?.name?.message}
        registration={register(`translations.${index}.name`)}
      />
      {/* Add FormTextAreaField for description if needed */}
    </TabsContent>
  );
};
```

---

## List component (`components/<Resource>List.tsx`)

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { use<Resource>s } from '../hooks';
import { <Resource>Card } from './<Resource>Card';

export const <Resource>List = () => {
  const t = useTranslations('<resource>');
  const { data: items, isPending, isError } = use<Resource>s();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t('<resource>s')}</h1>
      {isPending && <p className="text-muted-foreground">{t('loading<Resource>s')}</p>}
      {isError && <p className="text-destructive">{t('errorLoading<Resource>s')}</p>}
      {!isPending && !isError && !items?.length && (
        <p className="text-muted-foreground">{t('no<Resource>s')}</p>
      )}
      {!!items?.length && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => <<Resource>Card key={item.id} item={item} />)}
        </ul>
      )}
    </div>
  );
};
```

---

## Card component with actions (`components/<Resource>Card.tsx`)

```tsx
'use client';

import { FC, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import type { <Resource>WithTranslations } from '@/backend/features/<resource>';
import { Button } from '@/frontend/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { usePickTranslation } from '@/frontend/features/translation';
import { useDelete<Resource> } from '../hooks';

interface <Resource>CardProps {
  item: <Resource>WithTranslations;
  isHiddenActions?: boolean;
}

export const <Resource>Card: FC<<Resource>CardProps> = ({ item, isHiddenActions }) => {
  const { mutate: deleteItem, isPending } = useDelete<Resource>();
  const translation = usePickTranslation(item.translations);

  const handleDelete = useCallback(() => {
    deleteItem({ params: { id: item.id } });
  }, [deleteItem, item.id]);

  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle>{translation?.name}</CardTitle>
          {!isHiddenActions && (
            <CardAction>
              <Button variant="ghost" size="icon" className="size-7" disabled={isPending} onClick={handleDelete}>
                <Trash2 className="text-muted-foreground" size={16} />
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <span className="text-sm text-muted-foreground">{translation?.description}</span>
        </CardContent>
      </Card>
    </li>
  );
};
```

To read prefetched related data (e.g. category prefetched by the parent list):

```tsx
import { useCacheQuery } from '@/frontend/features/react-query';
import { Skeleton } from '@/frontend/components/ui/skeleton';
import { CategoryBadge } from '@/frontend/features/categories/components/CategoryBadge';
import { CATEGORY_DETAILS } from '@/frontend/features/categories/constants';
import type { CategoryWithTranslations } from '@/backend/features/category';

const { data: category } = useCacheQuery<CategoryWithTranslations>({
  queryKey: [CATEGORY_DETAILS, item.categoryId],
});

// In JSX:
{item.categoryId && (
  category ? <CategoryBadge category={category} /> : <Skeleton className="h-5 w-20 rounded-full" />
)}
```

---

## Barrel files

**`components/index.ts`**
```ts
export { <Name> } from './<Name>';
```

**`hooks/index.ts`**
```ts
export { use<Resource>s } from './use-<resource>s';
export { useCreate<Resource> } from './use-create-<resource>';
export { useDelete<Resource> } from './use-delete-<resource>';
```

**`index.ts` (feature root — only what external consumers need)**
```ts
export { <Resource>List, Create<Resource>Form } from './components';
```

---

## Constants (`constants.ts`)

```ts
export const <RESOURCE>S_QUERY_KEY = '<resource>s';

export const ITEMS = ['a', 'b', 'c'] as const;
export const LABELS: Record<(typeof ITEMS)[number], string> = {
  a: 'Alpha',
  b: 'Beta',
  c: 'Gamma',
};
```

---

## API definition (`frontend/features/api/<resource>.ts`)

```ts
import type {
  <Resource>CreateInput,
  <Resource>UpdateInput,
  <Resource>WithTranslations,
} from '@/backend/features/<resource>';
import { HttpMethod, RequestApiType, RequestMap } from './types';

const <RESOURCE>_API_ROUTES = {
  <RESOURCE>S: '/api/<resource>s',
  <RESOURCE>:  '/api/<resource>s/:id',
} as const;

export type <Resource>ApiTypes = {
  get<Resource>s:    RequestApiType<undefined,              undefined,        undefined,    <Resource>WithTranslations[]>;
  create<Resource>:  RequestApiType<<Resource>CreateInput,  undefined,        undefined,    <Resource>WithTranslations>;
  delete<Resource>:  RequestApiType<undefined,              { id: number },   undefined,    void>;
  update<Resource>:  RequestApiType<<Resource>UpdateInput,  { id: number },   undefined,    <Resource>WithTranslations>;
};

export const <RESOURCE>_REQUEST_MAP: RequestMap<<Resource>ApiTypes> = {
  get<Resource>s:   { url: <RESOURCE>_API_ROUTES.<RESOURCE>S, method: HttpMethod.GET },
  create<Resource>: { url: <RESOURCE>_API_ROUTES.<RESOURCE>S, method: HttpMethod.POST },
  delete<Resource>: { url: <RESOURCE>_API_ROUTES.<RESOURCE>,  method: HttpMethod.DELETE },
  update<Resource>: { url: <RESOURCE>_API_ROUTES.<RESOURCE>,  method: HttpMethod.PATCH },
};
```

Then merge into `frontend/features/api/index.ts`:
```ts
// Add to ApiTypes intersection:
type ApiTypes = ProductApiTypes & CategoryApiTypes & <Resource>ApiTypes;
// Spread into REQUEST_MAP:
const REQUEST_MAP = { ...PRODUCT_REQUEST_MAP, ...CATEGORY_REQUEST_MAP, ...<RESOURCE>_REQUEST_MAP };
```

`RequestApiType<Body, Params, Query, Response>` — use `undefined` for unused slots.

---

## API route handlers

### `app/api/<resource>s/route.ts` (collection)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { <Resource>Service } from '@/backend/features/<resource>';

const service = new <Resource>Service();

export async function GET(request: NextRequest) {
  try {
    const items = await service.getAll();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await service.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

### `app/api/<resource>s/[id]/route.ts` (single item)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { <Resource>Service } from '@/backend/features/<resource>';

const service = new <Resource>Service();

// Next.js 16: params is a Promise
type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await service.update(Number(id), body);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await service.delete(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
```
