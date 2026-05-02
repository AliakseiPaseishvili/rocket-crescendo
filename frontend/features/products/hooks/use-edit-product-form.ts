'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import { ProductFileRole } from '@/backend/app/generated/prisma/enums';
import type { ProductWithTranslations } from '@/backend/features/product';
import { supportedLngs } from '@/frontend/features/translation';

import { ProductFormValues } from '../types';
import { buildProductFiles } from '../utils';
import { useAdditionalImagesField } from './use-additional-images-field';
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
    price: product.price,
    includeVideoLessons: product.includeVideoLessons,
    categoryId: product.categoryId ?? '',
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
  const { additionalImageFields, addAdditionalImages, removeAdditionalImage } = useAdditionalImagesField(control);

  const { mutate, isPending, isSuccess, error } = useUpdateProduct();

  const onSubmit = handleSubmit(({ mainImage: mi, video: v, additionalImages: ai, ...rest }) => {
    const files = buildProductFiles(mi, v, ai);
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
