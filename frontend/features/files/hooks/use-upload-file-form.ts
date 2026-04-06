'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useUploadFile } from './use-upload-file';

export function useUploadFileForm(onSuccess?: () => void) {
  const t = useTranslations('file');

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(t('nameRequired')).trim().min(1, t('nameRequired')),
        file: yup
          .mixed<File>()
          .required(t('fileRequired'))
          .test('is-file', t('fileRequired'), (v) => v instanceof File),
      }),
    [t],
  );

  const form = useForm({
    defaultValues: { name: '' },
    resolver: yupResolver(schema),
  });

  const { handleSubmit, register, setValue, control, reset, formState: { errors } } = form;
  const { mutate, isPending, error: mutationError } = useUploadFile();

  const onSubmit = handleSubmit(({ name, file }) => {
    mutate(
      { file: file!, name: name.trim() },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      },
    );
  });

  return { register, setValue, control, errors, onSubmit, isPending, reset, mutationError };
}
