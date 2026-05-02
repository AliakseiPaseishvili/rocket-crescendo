"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { ROUTES } from "@/frontend/constants";
import {
  Link,
  useRouter,
} from "@/frontend/features/translation/i18n/navigation";

import { PasswordPolicyChecklist } from "./PasswordPolicyChecklist";
import { PasswordWithConfirmFields } from "./PasswordWithConfirmFields";
import { signUp } from "../auth-client";
import { useSignUpSchema } from "../hooks";
import { SignUpFormValues } from "../types";

export const SignUpForm = () => {
  const t = useTranslations("auth");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useSignUpSchema();

  const methods = useForm<SignUpFormValues>({ resolver: yupResolver(schema) });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null);
    const { error } = await signUp.email({
      name: values.firstName,
      email: values.email,
      password: values.password,
      lastName: values.lastName || undefined,
      username: values.username || undefined,
      gender: values.gender || undefined,
      birthdate: values.birthdate || undefined,
    });
    if (error) {
      setServerError(error.message ?? t("errors.signUpFailed"));
      return;
    }
    router.push(ROUTES.VERIFY_EMAIL);
  };

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("signUp.title")}</CardTitle>
          <CardDescription>{t("signUp.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <Label htmlFor="firstName">{t("fields.firstName")}</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t("fields.firstNamePlaceholder")}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <Label htmlFor="lastName">{t("fields.lastName")}</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t("fields.lastNamePlaceholder")}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">
                {t("fields.username")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t("fields.usernamePlaceholder")}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-destructive text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <Label htmlFor="gender">{t("fields.gender")}</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="gender">
                        <SelectValue
                          placeholder={t("fields.genderPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">
                          {t("fields.genderMale")}
                        </SelectItem>
                        <SelectItem value="female">
                          {t("fields.genderFemale")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-destructive text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <Label htmlFor="birthdate">{t("fields.birthdate")}</Label>
                <Input id="birthdate" type="date" {...register("birthdate")} />
                {errors.birthdate && (
                  <p className="text-destructive text-sm">
                    {errors.birthdate.message}
                  </p>
                )}
              </div>
            </div>

            <PasswordWithConfirmFields />

            <PasswordPolicyChecklist />

            {serverError && (
              <p className="text-destructive text-sm">{serverError}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("signUp.submitting") : t("signUp.submit")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("signUp.haveAccount")}{" "}
              <Link
                href={ROUTES.SIGN_IN}
                className="underline underline-offset-4 hover:text-foreground"
              >
                {t("signUp.signInLink")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
