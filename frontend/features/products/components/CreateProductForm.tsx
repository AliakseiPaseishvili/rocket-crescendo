"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

import { TranslationTabTrigger } from "@/frontend/components/TranslationTabTrigger";
import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Label } from "@/frontend/components/ui/label";
import { Tabs, TabsList } from "@/frontend/components/ui/tabs";
import { CategorySelector } from "@/frontend/features/categories/components";

import { useCreateProductForm } from "../hooks";
import { TranslationTabContent } from "./TranslationTabContent";

export const CreateProductForm = () => {
  const tProduct = useTranslations("product");
  const tCommon = useTranslations("common");
  const {
    register,
    control,
    fields,
    errors,
    onSubmit,
    isPending,
    isSuccess,
    error,
  } = useCreateProductForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{tProduct("createProduct")}</h2>

      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <TranslationTabTrigger
              language={field.language}
              key={field.id}
              hasError={!!(errors.translations?.[index]?.name || errors.translations?.[index]?.description)}
            />
          ))}
        </TabsList>

        {fields.map((field, index) => (
          <TranslationTabContent
            key={field.id}
            lng={field.language}
            index={index}
            errors={errors}
            register={register}
          />
        ))}
      </Tabs>

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <CategorySelector
            value={field.value}
            onChange={field.onChange}
            error={errors.categoryId?.message}
          />
        )}
      />

      <div className="flex items-center gap-2">
        <Controller
          name="favorite"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="favorite"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="favorite" className="cursor-pointer">
          {tProduct("favorite")}
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && (
        <p className="text-sm text-green-600">{tProduct("createSuccess")}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? tCommon("creating") : tProduct("createProduct")}
      </Button>
    </form>
  );
};
