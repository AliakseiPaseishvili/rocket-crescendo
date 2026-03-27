import type { ProductApiTypes } from './products';
import { PRODUCT_REQUEST_MAP } from './products';
import { executeRequest } from './utils';


export const api = Object.fromEntries(
    Object.entries(PRODUCT_REQUEST_MAP).map(([key, { url, method }]) => [
      key,
      (options: Parameters<ProductApiTypes[keyof ProductApiTypes]>[0]) =>
        executeRequest({
          url,
          method,
          options,
        }),
    ]),
  ) as ProductApiTypes;