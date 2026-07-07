'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/frontend/components/ui/select';

import { COUNTRIES } from '../constants';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountrySelect: FC<CountrySelectProps> = ({ value, onChange }) => {
  const t = useTranslations('checkout');

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="checkout-country" className="w-full">
        <SelectValue placeholder={t('countryPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
