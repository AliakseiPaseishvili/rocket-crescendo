'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ProductFileRole } from '@/backend/app/generated/prisma/enums';
import type { FileModel } from '@/backend/features/file';
import { SUPPORTED_LANGUAGE, supportedLngs } from '@/frontend/features/translation';

import { ProductFormValues, ProductMediaState } from '../types';
import { useCreateProduct } from './use-create-product';

export function useCreateProductForm() {
  const t = useTranslations('common');
  const tProduct = useTranslations('product');

  const [mediaState, setMediaState] = useState<ProductMediaState>({
    mainImage: null,
    video: null,
    additionalImages: [],
  });

  const schema = useMemo(
    () =>
      yup.object({
        favorite: yup.boolean().required(),
        categoryId: yup.number().required(tProduct('categoryRequired')).min(1, tProduct('categoryRequired')),
        translations: yup.array(
          yup.object({
            language: yup.mixed<SUPPORTED_LANGUAGE>().oneOf(supportedLngs).required(),
            name: yup.string().required(t('nameRequired')).min(2, t('nameMinLength')),
            description: yup.string().required(t('descriptionRequired')).min(10, t('descriptionMinLength')),
          })
        ).required(),
      }),
    [t, tProduct]
  );

  const defaultValues: ProductFormValues = {
    favorite: false,
    categoryId: 0,
    translations: supportedLngs.map((lng) => ({
      language: lng,
      name: '',
      description: '',
    })),
  };

  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, control, reset, formState: { errors } } = form;
  const { fields } = useFieldArray({ control, name: 'translations' });
  const { mutate, isPending, isSuccess, error } = useCreateProduct();

  const resetMedia = useCallback(() => {
    setMediaState({ mainImage: null, video: null, additionalImages: [] });
  }, []);

  const setMainImage = useCallback((file: FileModel) => {
    setMediaState((prev) => ({ ...prev, mainImage: file }));
  }, []);

  const removeMainImage = useCallback(() => {
    setMediaState((prev) => ({ ...prev, mainImage: null }));
  }, []);

  const setVideo = useCallback((file: FileModel) => {
    setMediaState((prev) => ({ ...prev, video: file }));
  }, []);

  const removeVideo = useCallback(() => {
    setMediaState((prev) => ({ ...prev, video: null }));
  }, []);

  const addAdditionalImages = useCallback((files: FileModel[]) => {
    setMediaState((prev) => {
      const existingIds = new Set(prev.additionalImages.map((f) => f.id));
      const newFiles = files.filter((f) => !existingIds.has(f.id));
      return {
        ...prev,
        additionalImages: [...prev.additionalImages, ...newFiles].slice(0, 8),
      };
    });
  }, []);

  const removeAdditionalImage = useCallback((id: number) => {
    setMediaState((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((f) => f.id !== id),
    }));
  }, []);

  const onSubmit = handleSubmit((body) => {
    const files = [
      ...(mediaState.mainImage
        ? [{ fileId: mediaState.mainImage.id, role: ProductFileRole.MAIN_IMAGE }]
        : []),
      ...(mediaState.video
        ? [{ fileId: mediaState.video.id, role: ProductFileRole.VIDEO }]
        : []),
      ...mediaState.additionalImages.map((f) => ({
        fileId: f.id,
        role: ProductFileRole.ADDITIONAL_IMAGE,
      })),
    ];

    mutate(
      { body: { ...body, ...(files.length ? { files } : {}) } },
      { onSuccess: () => { reset(); resetMedia(); } }
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
    mediaState,
    setMainImage,
    removeMainImage,
    setVideo,
    removeVideo,
    addAdditionalImages,
    removeAdditionalImage,
  };
}
