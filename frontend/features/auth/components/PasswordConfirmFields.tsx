"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import { Label } from "@/frontend/components/ui/label";

import { PasswordInput } from "./PasswordInput";

type PasswordConfirmValues = {
  password: string;
  confirmPassword: string;
};

type Props = {
  showRequired?: boolean;
  autoComplete?: string;
};

export const PasswordConfirmFields = ({
  showRequired,
  autoComplete,
}: Props) => {
  const t = useTranslations("auth");
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PasswordConfirmValues>();

  const [password, confirmPassword] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });
  const passwordsMatch = !!password && password === confirmPassword;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">
          {t("fields.password")}
          {showRequired && <span className="text-destructive"> *</span>}
        </Label>
        <PasswordInput
          id="password"
          placeholder={t("fields.passwordPlaceholder")}
          autoComplete={autoComplete}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">
          {t("fields.confirmPassword")}
          {showRequired && <span className="text-destructive"> *</span>}
        </Label>
        <PasswordInput
          id="confirmPassword"
          placeholder={t("fields.confirmPasswordPlaceholder")}
          autoComplete={autoComplete}
          isMatch={passwordsMatch}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </>
  );
};
