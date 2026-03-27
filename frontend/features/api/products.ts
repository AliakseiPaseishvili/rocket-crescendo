import type {
  ProductCreateInput,
  ProductFilter,
  ProductUpdateInput,
  ProductWithTranslations,
} from "@/backend/features/product";

import { HttpMethod, RequestApiType, RequestMap } from "./types";

const PRODUCT_API_ROUTES = {
  PRODUCTS: "/api/products",
  PRODUCT: "/api/products/:id",
} as const;

export type ProductApiTypes = {
  getAll: RequestApiType<
    undefined,
    undefined,
    ProductFilter | undefined,
    ProductWithTranslations[]
  >;
  create: RequestApiType<
    ProductCreateInput,
    undefined,
    undefined,
    ProductWithTranslations
  >;
  delete: RequestApiType<undefined, { id: number }, undefined, void>;
  update: RequestApiType<
    ProductUpdateInput,
    { id: number },
    undefined,
    ProductWithTranslations
  >;
};

export const PRODUCT_REQUEST_MAP: RequestMap<ProductApiTypes> = {
  getAll: { url: PRODUCT_API_ROUTES.PRODUCTS, method: HttpMethod.GET },
  create: { url: PRODUCT_API_ROUTES.PRODUCTS, method: HttpMethod.POST },
  delete: { url: PRODUCT_API_ROUTES.PRODUCT, method: HttpMethod.DELETE },
  update: { url: PRODUCT_API_ROUTES.PRODUCT, method: HttpMethod.PATCH },
};
