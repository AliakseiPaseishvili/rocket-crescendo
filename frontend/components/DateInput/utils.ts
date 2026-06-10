import { enUS, fr, ru, type Locale } from 'react-day-picker/locale';

import { SUPPORTED_LANGUAGE } from '@/frontend/features/translation';

const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const calendarLocales: Record<SUPPORTED_LANGUAGE, Locale> = {
  [SUPPORTED_LANGUAGE.EN]: enUS,
  [SUPPORTED_LANGUAGE.FR]: fr,
  [SUPPORTED_LANGUAGE.RU]: ru,
};

export const getCalendarLocale = (locale: string): Locale =>
  calendarLocales[locale as SUPPORTED_LANGUAGE] ?? enUS;

export const maskDateValue = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  let masked = day;
  if (month) masked += `/${month}`;
  if (year) masked += `/${year}`;
  return masked;
};

export const parseDisplayDate = (value: string): Date | undefined => {
  const match = DISPLAY_DATE_PATTERN.exec(value);
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return isRealDate ? date : undefined;
};

export const formatDisplayDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export const isValidDisplayDate = (value: string): boolean =>
  parseDisplayDate(value) !== undefined;

export const displayDateToIso = (value: string): string | undefined => {
  const date = parseDisplayDate(value);
  if (!date) return undefined;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};
