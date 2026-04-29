"use client";

import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { ROUTES } from "@/frontend/constants";
import { Link } from "@/frontend/features/translation/i18n/navigation";

export const VerifyEmailView = () => {
  const t = useTranslations("auth");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("verifyEmail.title")}</CardTitle>
        <CardDescription>{t("verifyEmail.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t("verifyEmail.hint")}
        </p>
        <p className="mt-4 text-center text-sm text-muted-foreground">
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
