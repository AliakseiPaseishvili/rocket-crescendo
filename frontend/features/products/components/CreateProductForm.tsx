"use client";

import { useTranslations } from "next-intl";

import { useCreateProductForm } from "../hooks";
import { ProductFormFields } from "./ProductFormFields";

export const CreateProductForm = () => {
  const tProduct = useTranslations("product");
  const tCommon = useTranslations("common");
  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } =
    useCreateProductForm();

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{tProduct("createProduct")}</h2>
      <ProductFormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error}
        submitLabel={tProduct("createProduct")}
        pendingLabel={tCommon("creating")}
        successMessage={tProduct("createSuccess")}
      />
    </div>
  );
};
