"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";

import { PasswordConfirmFields } from "./PasswordConfirmFields";
import { SignUpFormValues } from "../types";

export const PasswordWithConfirmFields = () => {
  const t = useTranslations("auth");
  const {
    register,
    formState: { errors },
  } = useFormContext<SignUpFormValues>();

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">
          {t("fields.email")}
          <span className="text-destructive"> *</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("fields.emailPlaceholder")}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <PasswordConfirmFields showRequired />
    </>
  );
};
