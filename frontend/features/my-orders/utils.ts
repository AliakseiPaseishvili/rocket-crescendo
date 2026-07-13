/**
 * Formats an integer minor-unit amount (cents) as a localized currency string.
 * `amountCents` and `currency` come straight from the order record.
 */
export const formatMoney = (
  amountCents: number,
  currency: string,
  locale: string,
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
