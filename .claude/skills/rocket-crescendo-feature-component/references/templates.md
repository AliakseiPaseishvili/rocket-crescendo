# Feature Component Templates

## Component

```tsx
// Add 'use client'; only when client logic exists (hooks, event handlers, browser APIs, useTranslation, etc.)
// Omit entirely for pure server components.

import { useTranslation } from 'react-i18next';
// shadcn: import { Button } from '@/frontend/components/ui/button';
// icons:  import { SomeIcon } from 'lucide-react';
// cross-feature: import { SomeThing } from '@/frontend/features/<feature>';

interface <Name>Props {
  prop: string;
  onAction?: () => void;
}

export const <Name> = ({ prop, onAction }: <Name>Props) => {
  const { t } = useTranslation('<namespace>');
  // multi-namespace: useTranslation(['ns1', 'ns2'])  → t('ns1:key')

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

## Mutation hook (`hooks/use-<name>.ts`)

```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { <resourceApi>, type <InputType> } from '@/frontend/features/api';

export type { <InputType> };

export function use<Name>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: <resourceApi>.<method>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['<resource>'] });
    },
  });
}
```

---

## Form hook (`hooks/use-<name>-form.ts`)

```ts
'use client';

import { useForm } from 'react-hook-form';
import { use<Name>, type <InputType> } from './use-<name>';

export function use<Name>Form() {
  const form = useForm<<InputType>>({
    defaultValues: { field: '', checked: false },
  });
  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { mutate, isPending, isSuccess, error } = use<Name>();

  const onSubmit = handleSubmit((data) => {
    mutate(data, { onSuccess: () => reset() });
  });

  return { register, control, errors, onSubmit, isPending, isSuccess, error };
}
```

---

## Barrel files

**`components/index.ts`**
```ts
export { <Name> } from './<Name>';
```

**`index.ts` (feature root)**
```ts
export { <Name> } from './components';
export { use<Name> } from './hooks/use-<name>';
export type { <InputType> } from './hooks/use-<name>';
```

---

## Constants (`constants.ts`)

```ts
export const ITEMS = ['a', 'b', 'c'] as const;

export const LABELS: Record<(typeof ITEMS)[number], string> = {
  a: 'Alpha',
  b: 'Beta',
  c: 'Gamma',
};
```

---

## API function (`api/<resource>.ts`)

Full CRUD example — remove methods you don't need.

```ts
export type <Resource> = {
  id: number;
  field: string;
};

export type <ResourceInput> = Omit<<Resource>, 'id'>;

// Optional filter shape for getAll
export type <Resource>Filter = {
  active?: boolean;
};

async function throwOnError(res: Response): Promise<Response> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res;
}

export const <resource>Api = {
  getAll: async (filter?: <Resource>Filter): Promise<<Resource>[]> => {
    const params = new URLSearchParams();
    if (filter?.active !== undefined) params.set('active', String(filter.active));
    const query = params.size ? `?${params}` : '';
    const res = await fetch(`/api/<resource>${query}`);
    return throwOnError(res).then((r) => r.json());
  },

  getById: async (id: number): Promise<<Resource>> => {
    const res = await fetch(`/api/<resource>/${id}`);
    return throwOnError(res).then((r) => r.json());
  },

  create: async (data: <ResourceInput>): Promise<<Resource>> => {
    const res = await fetch('/api/<resource>', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return throwOnError(res).then((r) => r.json());
  },

  // Use PATCH (not PUT) — matches the route handler convention
  update: async (id: number, data: Partial<<ResourceInput>>): Promise<<Resource>> => {
    const res = await fetch(`/api/<resource>/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return throwOnError(res).then((r) => r.json());
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`/api/<resource>/${id}`, { method: 'DELETE' });
    await throwOnError(res); // 204 — no body
  },
};
```

---

## API route handlers

### `app/api/<resource>/route.ts` (collection)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { <Resource>Service } from '@/backend/features/<resource>';

const service = new <Resource>Service();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Example optional boolean filter:
    // const activeParam = searchParams.get('active');
    // const filter = activeParam !== null ? { active: activeParam === 'true' } : undefined;
    const items = await service.getAll(/* filter */);
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

### `app/api/<resource>/[id]/route.ts` (single item)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { <Resource>Service } from '@/backend/features/<resource>';

const service = new <Resource>Service();

// Next.js 16: params is a Promise
type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const item = await service.getById(Number(id));
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

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
    return new NextResponse(null, { status: 204 }); // no body
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
```
