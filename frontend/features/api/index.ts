import type { CategoryApiTypes } from './categories';
import { CATEGORY_REQUEST_MAP } from './categories';
import type { ProductApiTypes } from './products';
import { PRODUCT_REQUEST_MAP } from './products';
import { executeRequest } from './utils';

type ApiTypes = ProductApiTypes & CategoryApiTypes;

const REQUEST_MAP = { ...PRODUCT_REQUEST_MAP, ...CATEGORY_REQUEST_MAP };

export const api = Object.fromEntries(
  Object.entries(REQUEST_MAP).map(([key, { url, method }]) => [
    key,
    (options: Parameters<ApiTypes[keyof ApiTypes]>[0]) =>
      executeRequest({
        url,
        method,
        options,
      }),
  ]),
) as ApiTypes;
