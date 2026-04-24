'use client';

import { useCallback } from 'react';
import { useFieldArray } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import type { FileModel } from '@/backend/features/file';


import { MAX_ADDITIONAL_IMAGES } from '../constants';
import type { ProductFormValues } from '../types';

export function useAdditionalImagesField(control: Control<ProductFormValues>) {
  const {
    fields: additionalImageFields,
    append,
    remove,
  } = useFieldArray({ control, name: 'additionalImages', keyName: '_rhfId' });

  const addAdditionalImages = useCallback((files: FileModel[]) => {
    const existingIds = new Set(additionalImageFields.map((f) => f.id));
    const newFiles = files.filter((f) => !existingIds.has(f.id));
    const slots = MAX_ADDITIONAL_IMAGES - additionalImageFields.length;
    append(newFiles.slice(0, slots));
  }, [additionalImageFields, append]);

  const removeAdditionalImage = useCallback((id: string) => {
    const index = additionalImageFields.findIndex((f) => f.id === id);
    if (index !== -1) remove(index);
  }, [additionalImageFields, remove]);

  return { additionalImageFields, addAdditionalImages, removeAdditionalImage };
}
