'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useSubscribe } from './use-subscribe';

type SubscribeFormValues = {
  email: string;
};

export function useSubscribeForm() {
  const t = useTranslations('subscription');

  const schema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .required(t('form.emailRequired'))
          .email(t('form.emailInvalid')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeFormValues>({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
  });

  const { subscribe, isPending, status, error } = useSubscribe();

  const onSubmit = handleSubmit(({ email }) => {
    subscribe(email);
  });

  return { register, errors, onSubmit, isPending, status, error };
}
