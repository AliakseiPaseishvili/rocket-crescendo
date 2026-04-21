'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { ProductFileRole } from '@/backend/app/generated/prisma/enums';
import type { FileModel } from '@/backend/features/file';
import { supportedLngs } from '@/frontend/features/translation';

import { MAX_ADDITIONAL_IMAGES } from '../constants';
import { ProductFormValues } from '../types';
import { useCreateProduct } from './use-create-product';
import { useProductFormSchema } from './use-product-form-schema';

export function useCreateProductForm() {
  const schema = useProductFormSchema();

  const defaultValues: ProductFormValues = {
    favorite: false,
    categoryId: 0,
    translations: supportedLngs.map((lng) => ({
      language: lng,
      name: '',
      description: '',
    })),
    mainImage: null,
    video: null,
    additionalImages: [],
  };

  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const {
    fields: additionalImageFields,
    append,
    remove,
  } = useFieldArray({ control, name: 'additionalImages', keyName: '_rhfId' });

  const { mutate, isPending, isSuccess, error } = useCreateProduct();

  const addAdditionalImages = useCallback((files: FileModel[]) => {
    const existingIds = new Set(additionalImageFields.map((f) => f.id));
    const newFiles = files.filter((f) => !existingIds.has(f.id));
    const slots = MAX_ADDITIONAL_IMAGES - additionalImageFields.length;
    append(newFiles.slice(0, slots));
  }, [additionalImageFields, append]);

  const removeAdditionalImage = useCallback((id: number) => {
    const index = additionalImageFields.findIndex((f) => f.id === id);
    if (index !== -1) remove(index);
  }, [additionalImageFields, remove]);

  const onSubmit = handleSubmit(({ mainImage: mi, video: v, additionalImages: ai, ...rest }) => {
    const files = [
      ...(mi ? [{ fileId: mi.id, role: ProductFileRole.MAIN_IMAGE }] : []),
      ...(v ? [{ fileId: v.id, role: ProductFileRole.VIDEO }] : []),
      ...ai.map((f) => ({ fileId: f.id, role: ProductFileRole.ADDITIONAL_IMAGE })),
    ];

    mutate(
      { body: { ...rest, ...(files.length ? { files } : {}) } },
      { onSuccess: () => reset() }
    );
  });

  return {
    register,
    control,
    fields,
    errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
    additionalImageFields,
    addAdditionalImages,
    removeAdditionalImage,
  };
}
