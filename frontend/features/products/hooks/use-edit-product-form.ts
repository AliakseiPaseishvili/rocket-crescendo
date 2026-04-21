'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { ProductFileRole } from '@/backend/app/generated/prisma/enums';
import type { FileModel } from '@/backend/features/file';
import type { ProductWithTranslations } from '@/backend/features/product';
import { supportedLngs } from '@/frontend/features/translation';

import { MAX_ADDITIONAL_IMAGES } from '../constants';
import { ProductFormValues } from '../types';
import { useProductFormSchema } from './use-product-form-schema';
import { useUpdateProduct } from './use-update-product';

export function useEditProductForm(product: ProductWithTranslations, onSuccess?: () => void) {
  const schema = useProductFormSchema();

  const mainImageFile = product.productFiles.find((f) => f.role === ProductFileRole.MAIN_IMAGE)?.file ?? null;
  const videoFile = product.productFiles.find((f) => f.role === ProductFileRole.VIDEO)?.file ?? null;
  const additionalImageFiles = product.productFiles
    .filter((f) => f.role === ProductFileRole.ADDITIONAL_IMAGE)
    .map((f) => f.file);

  const defaultValues: ProductFormValues = {
    favorite: product.favorite,
    categoryId: product.categoryId ?? 0,
    translations: supportedLngs.map((lng) => {
      const existing = product.translations.find((tr) => tr.language === lng);
      return {
        language: lng,
        name: existing?.name ?? '',
        description: existing?.description ?? '',
      };
    }),
    mainImage: mainImageFile,
    video: videoFile,
    additionalImages: additionalImageFiles,
  };

  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const {
    fields: additionalImageFields,
    append,
    remove,
  } = useFieldArray({ control, name: 'additionalImages', keyName: '_rhfId' });

  const { mutate, isPending, isSuccess, error } = useUpdateProduct();

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

    mutate({ params: { id: product.id }, body: { ...rest, files } }, { onSuccess });
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
