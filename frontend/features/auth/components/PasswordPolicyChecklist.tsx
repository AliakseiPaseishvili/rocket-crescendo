'use client';

import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';

import { SignUpFormValues } from '../types';
import { PolicyItem } from './PolicyItem';

type PolicyRule = {
  label: string;
  test: (value: string) => boolean;
};

export const PasswordPolicyChecklist = () => {
  const { control } = useFormContext<SignUpFormValues>();
  const t = useTranslations('auth');
  const password = useWatch({ control, name: 'password' }) ?? '';

  const policies: PolicyRule[] = [
    { label: t('passwordPolicy.minLength'), test: (v) => v.length >= 8 },
    { label: t('passwordPolicy.uppercase'), test: (v) => /[A-Z]/.test(v) },
    { label: t('passwordPolicy.lowercase'), test: (v) => /[a-z]/.test(v) },
    { label: t('passwordPolicy.number'), test: (v) => /[0-9]/.test(v) },
    { label: t('passwordPolicy.special'), test: (v) => /[^A-Za-z0-9]/.test(v) },
  ];

  return (
    <ul className="flex flex-col gap-1 rounded-md border px-3 py-2">
      {policies.map((rule) => (
        <PolicyItem key={rule.label} label={rule.label} met={rule.test(password)} />
      ))}
    </ul>
  );
};
