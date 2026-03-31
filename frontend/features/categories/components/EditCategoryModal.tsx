'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useState } from 'react';

import type { CategoryWithTranslations } from '@/backend/features/category';
import { Button } from '@/frontend/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/frontend/components/ui/dialog';

import { CategoryFormFields } from './CategoryFormFields';
import { useEditCategoryForm } from '../hooks/';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7" disabled={disabled}>
          <Pencil className="text-muted-foreground" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tCategory('editCategory')}</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};
