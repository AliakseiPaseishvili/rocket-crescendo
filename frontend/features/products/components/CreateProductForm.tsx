"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Label } from "@/frontend/components/ui/label";
import { Tabs, TabsList } from "@/frontend/components/ui/tabs";

import { useCreateProductForm } from "../hooks";
import { TranslationTabContent } from "./TranslationTabContent";
import { TranslationTabTrigger } from "./TranslationTabTrigger";

export const CreateProductForm = () => {
  const { t } = useTranslation(["product", "common"]);
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
      <h2 className="text-2xl font-bold">{t("product:createProduct")}</h2>

      <Tabs defaultValue={fields[0]?.language}>
        <TabsList className="w-full">
          {fields.map((field, index) => (
            <TranslationTabTrigger
              language={field.language}
              index={index}
              key={field.id}
              errors={errors}
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
          {t("product:favorite")}
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && (
        <p className="text-sm text-green-600">{t("product:createSuccess")}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? t("common:creating") : t("product:createProduct")}
      </Button>
    </form>
  );
};
