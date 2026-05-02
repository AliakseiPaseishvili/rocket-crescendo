"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { ROUTES } from "@/frontend/constants";
import { Link } from "@/frontend/features/translation/i18n/navigation";

import { authClient } from "../auth-client";

export const VerifyEmailView = () => {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const { mutate: resend, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      if (!email) return;
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: ROUTES.BASE,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setSecondsLeft(300);
    },
  });

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("verifyEmail.title")}</CardTitle>
        <CardDescription>{t("verifyEmail.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{t("verifyEmail.hint")}</p>
        {email && (
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => resend()}
              disabled={isPending || secondsLeft > 0}
            >
              {secondsLeft > 0
                ? t("verifyEmail.resendIn", { minutes, seconds })
                : isPending
                  ? t("verifyEmail.resendSending")
                  : t("verifyEmail.resend")}
            </Button>
            {isSuccess && (
              <p className="text-sm text-green-600">
                {t("verifyEmail.resendSuccess")}
              </p>
            )}
            {isError && (
              <p className="text-destructive text-sm">
                {t("verifyEmail.resendError")}
              </p>
            )}
          </div>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={ROUTES.SIGN_IN}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {t("verifyEmail.backToSignIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
