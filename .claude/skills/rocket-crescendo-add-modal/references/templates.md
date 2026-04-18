# Modal Templates

## Controlled form modal

Pattern: `EditCategoryModal`, `EditProductModal`, `UploadFileDialog`

Use when the modal contains a form and must close after a successful mutation.

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { FC, useCallback, useState } from 'react';

import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';
// import { SomeIcon } from 'lucide-react';

import { <Name>FormFields } from './<Name>FormFields'; // or inline the form body
import { use<Action><Name>Form } from '../hooks/use-<action>-<name>-form';

interface <Name>ModalProps {
  <entity>: <EntityType>;
  disabled?: boolean;
}

export const <Name>Modal: FC<<Name>ModalProps> = ({ <entity>, disabled }) => {
  const t<Ns> = useTranslations('<namespace>');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);

  const handleSuccess = useCallback(() => setOpen(false), []);

  const { /* form state */ } = use<Action><Name>Form(<entity>, handleSuccess);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={t<Ns>('<titleKey>')}
      contentClassName="max-w-lg"
      trigger={
        <Button variant="ghost" size="icon" className="size-7" disabled={disabled}>
          {/* <SomeIcon className="text-muted-foreground" size={16} /> */}
        </Button>
      }
    >
      {/* form body / FormFields component */}
    </Modal>
  );
};
```

### Form reset on cancel

When the modal contains a form, reset on close so the form is clean on next open:

```tsx
const handleOpenChange = (next: boolean) => {
  if (!next) reset(); // from react-hook-form
  setOpen(next);
};

// Pass handleOpenChange to onOpenChange instead of setOpen
```

---

## Uncontrolled modal

Pattern: `FileVideoPlayer`

Use when there is no need to close programmatically — Radix manages open state internally.

```tsx
'use client';

import { FC } from 'react';

import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

interface <Name>ModalProps {
  title: string;
}

export const <Name>Modal: FC<<Name>ModalProps> = ({ title }) => {
  return (
    <Modal
      title={title}
      trigger={
        <Button variant="ghost" className="...">
          {/* trigger content */}
        </Button>
      }
    >
      {/* modal body */}
    </Modal>
  );
};
```

---

## Fullscreen-on-mobile modal

Pattern: `FileVideoPlayer` — edge-to-edge on mobile, centred panel on `sm+`.

```tsx
<Modal
  title={name}
  contentClassName="top-0 left-0 h-full max-h-none w-full max-w-full translate-x-0 translate-y-0 rounded-none p-0 gap-0 sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[min(90vw,1200px)] sm:rounded-xl sm:p-4 sm:gap-4"
  headerClassName="px-4 pt-4 sm:px-0 sm:pt-0"
  titleClassName="truncate pr-8"
  trigger={
    <Button type="button" variant="ghost" className="flex h-40 w-full cursor-pointer items-center justify-center rounded-md bg-muted hover:bg-muted/70">
      {/* thumbnail icon */}
    </Button>
  }
>
  {/* full-width content */}
</Modal>
```

---

## Form hook pattern (use-`<action>`-`<name>`-form.ts)

When the modal wraps a mutation form, create a dedicated form hook:

```ts
'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { use<Action><Name> } from './use-<action>-<name>';

const schema = yup.object({
  // field definitions
});

type <Name>FormValues = yup.InferType<typeof schema>;

export function use<Action><Name>Form(
  initialValues: <EntityType>,
  onSuccess: () => void,
) {
  const { mutate, isPending, isSuccess, error } = use<Action><Name>();

  const { register, control, handleSubmit, formState: { errors }, reset } =
    useForm<<Name>FormValues>({
      resolver: yupResolver(schema),
      defaultValues: { /* map initialValues */ },
    });

  const onSubmit = handleSubmit((values) => {
    mutate(values, { onSuccess });
  });

  return { register, control, errors, onSubmit, isPending, isSuccess, error, reset };
}
```
