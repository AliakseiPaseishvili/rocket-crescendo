"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { ROUTES } from "@/frontend/constants";
import { Link, useRouter } from "@/frontend/features/translation/i18n/navigation";

import { useResetPasswordSchema } from "../hooks";
import { PasswordConfirmFields } from "./PasswordConfirmFields";
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

  const methods = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <PasswordConfirmFields autoComplete="new-password" />

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
        </FormProvider>
      </CardContent>
    </Card>
  );
};
