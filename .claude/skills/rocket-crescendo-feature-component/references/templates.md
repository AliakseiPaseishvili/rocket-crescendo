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

```ts
export type <InputType> = {
  field: string;
  checked: boolean;
};

export const <resource>Api = {
  create: async (data: <InputType>): Promise<unknown> => {
    const res = await fetch('/api/<resource>', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },
};
```
