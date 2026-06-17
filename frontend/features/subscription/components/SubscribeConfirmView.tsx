"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { ROUTES } from "@/frontend/constants";
import { api } from "@/frontend/features/api";
import { Link } from "@/frontend/features/translation/i18n/navigation";

export const SubscribeConfirmView = () => {
  const t = useTranslations("subscription");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const startedRef = useRef(false);

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Missing token");
      await api.confirmSubscription({ body: { token } });
    },
  });

  useEffect(() => {
    if (token && !startedRef.current) {
      startedRef.current = true;
      mutate();
    }
  }, [token, mutate]);

  const isLoading = isPending || (!!token && !isSuccess && !isError);
  const failed = !token || isError;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isSuccess
            ? t("confirm.successTitle")
            : failed
              ? t("confirm.errorTitle")
              : t("confirm.loadingTitle")}
        </CardTitle>
        <CardDescription>
          {isSuccess
            ? t("confirm.successDescription")
            : failed
              ? t("confirm.errorDescription")
              : t("confirm.loadingDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">{t("confirm.loadingHint")}</p>
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href={ROUTES.BASE}>{t("confirm.backToHome")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
