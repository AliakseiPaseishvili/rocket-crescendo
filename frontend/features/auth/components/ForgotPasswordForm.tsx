"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
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
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { ROUTES } from "@/frontend/constants";
import { Link } from "@/frontend/features/translation/i18n/navigation";

import { authClient } from "../auth-client";
import { useForgotPasswordSchema } from "../hooks";

type ForgotPasswordFormValues = {
  email: string;
};

export const ForgotPasswordForm = () => {
  const t = useTranslations("auth");
  const schema = useForgotPasswordSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: yupResolver(schema) });

  const { mutateAsync: requestReset, isSuccess, isError } = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
      });
      if (error) throw new Error(error.message);
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await requestReset(values.email);
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("forgotPassword.successTitle")}
          </CardTitle>
          <CardDescription>{t("forgotPassword.successHint")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={ROUTES.SIGN_IN}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t("forgotPassword.backToSignIn")}
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("forgotPassword.title")}</CardTitle>
        <CardDescription>{t("forgotPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("fields.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("fields.emailPlaceholder")}
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          {isError && (
            <p className="text-destructive text-sm">
              {t("errors.forgotPasswordFailed")}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? t("forgotPassword.submitting")
              : t("forgotPassword.submit")}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={ROUTES.SIGN_IN}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t("forgotPassword.backToSignIn")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
