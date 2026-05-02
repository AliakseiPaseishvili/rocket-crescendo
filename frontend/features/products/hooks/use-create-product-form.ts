"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";

import { supportedLngs } from "@/frontend/features/translation";

import { ProductFormValues } from "../types";
import { buildProductFiles } from "../utils";
import { useAdditionalImagesField } from "./use-additional-images-field";
import { useCreateProduct } from "./use-create-product";
import { useProductFormSchema } from "./use-product-form-schema";

export function useCreateProductForm() {
  const schema = useProductFormSchema();

  const defaultValues: ProductFormValues = {
    favorite: false,
    price: 5.0,
    includeVideoLessons: false,
    categoryId: "",
    translations: supportedLngs.map((lng) => ({
      language: lng,
      name: "",
      description: "",
    })),
    mainImage: null,
    video: null,
    additionalImages: [],
  };

  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = form;
  const { fields } = useFieldArray({ control, name: "translations" });
  const { additionalImageFields, addAdditionalImages, removeAdditionalImage } =
    useAdditionalImagesField(control);

  const { mutate, isPending, isSuccess, error } = useCreateProduct();

  const onSubmit = handleSubmit(
    ({ mainImage: mi, video: v, additionalImages: ai, ...rest }) => {
      const files = buildProductFiles(mi, v, ai);
      mutate(
        { body: { ...rest, ...(files.length ? { files } : {}) } },
        { onSuccess: () => reset() },
      );
    },
  );

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
