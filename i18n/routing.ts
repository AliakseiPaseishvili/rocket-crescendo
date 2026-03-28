import { defineRouting } from 'next-intl/routing';

import { fallbackLng, supportedLngs } from '@/frontend/features/translation';

export const routing = defineRouting({
  locales: supportedLngs,
  defaultLocale: fallbackLng as (typeof supportedLngs)[number],
});