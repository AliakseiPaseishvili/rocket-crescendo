'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';

import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Textarea } from '@/frontend/components/ui/textarea';

import { CountrySelect } from './CountrySelect';
import type { CheckoutFormValues } from '../types';

interface CheckoutFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  control: Control<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  emailDisabled: boolean;
}

export const CheckoutForm: FC<CheckoutFormProps> = ({
  register,
  control,
  errors,
  emailDisabled,
}) => {
  const t = useTranslations('checkout');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-email">{t('email')}</Label>
        <Input
          id="checkout-email"
          type="email"
          disabled={emailDisabled}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-country">{t('country')}</Label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountrySelect value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.country && (
          <p className="text-sm text-destructive">{errors.country.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-region">{t('region')}</Label>
        <Input id="checkout-region" {...register('region')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-address-line-1">{t('addressLine1')}</Label>
        <Input id="checkout-address-line-1" {...register('addressLine1')} />
        {errors.addressLine1 && (
          <p className="text-sm text-destructive">
            {errors.addressLine1.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-address-line-2">{t('addressLine2')}</Label>
        <Input id="checkout-address-line-2" {...register('addressLine2')} />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="checkout-flat-number">{t('flatNumber')}</Label>
          <Input id="checkout-flat-number" {...register('flatNumber')} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="checkout-city">{t('city')}</Label>
          <Input id="checkout-city" {...register('city')} />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-postcode">{t('postcode')}</Label>
        <Input id="checkout-postcode" {...register('postcode')} />
        {errors.postcode && (
          <p className="text-sm text-destructive">{errors.postcode.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-additional-info">{t('additionalInfo')}</Label>
        <Textarea
          id="checkout-additional-info"
          rows={3}
          {...register('additionalInfo')}
        />
      </div>
    </div>
  );
};
