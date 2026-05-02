"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Label } from "@/frontend/components/ui/label";
import { ROUTES } from "@/frontend/constants";
import { Link, useRouter } from "@/frontend/features/translation/i18n/navigation";

import { useResetPasswordSchema } from "../hooks";
import { PasswordInput } from "./PasswordInput";
import { authClient } from "../auth-client";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export const ResetPasswordForm = () => {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const schema = useResetPasswordSchema();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: yupResolver(schema) });

  const [password, confirmPassword] = watch(["password", "confirmPassword"]);
  const passwordsMatch = !!password && password === confirmPassword;

  const { mutateAsync: resetPassword, isError } = useMutation({
    mutationFn: async (newPassword: string) => {
      if (!token) throw new Error("missing token");
      const { error } = await authClient.resetPassword({ newPassword, token });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      router.push(ROUTES.SIGN_IN);
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    await resetPassword(values.password);
  };

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("resetPassword.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-destructive text-sm">
            {t("errors.resetPasswordFailed")}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t("forgotPassword.title")}
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("resetPassword.title")}</CardTitle>
        <CardDescription>{t("resetPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t("fields.password")}</Label>
            <PasswordInput
              id="password"
              placeholder={t("fields.passwordPlaceholder")}
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">
              {t("fields.confirmPassword")}
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder={t("fields.confirmPasswordPlaceholder")}
              autoComplete="new-password"
              isMatch={passwordsMatch}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {isError && (
            <p className="text-destructive text-sm">
              {t("errors.resetPasswordFailed")}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? t("resetPassword.submitting")
              : t("resetPassword.submit")}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={ROUTES.SIGN_IN}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t("resetPassword.backToSignIn")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
