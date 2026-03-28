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
  getProducts: RequestApiType<
    undefined,
    undefined,
    ProductFilter | undefined,
    ProductWithTranslations[]
  >;
  createProduct: RequestApiType<
    ProductCreateInput,
    undefined,
    undefined,
    ProductWithTranslations
  >;
  deleteProduct: RequestApiType<undefined, { id: number }, undefined, void>;
  updateProduct: RequestApiType<
    ProductUpdateInput,
    { id: number },
    undefined,
    ProductWithTranslations
  >;
};

export const PRODUCT_REQUEST_MAP: RequestMap<ProductApiTypes> = {
  getProducts: { url: PRODUCT_API_ROUTES.PRODUCTS, method: HttpMethod.GET },
  createProduct: { url: PRODUCT_API_ROUTES.PRODUCTS, method: HttpMethod.POST },
  deleteProduct: { url: PRODUCT_API_ROUTES.PRODUCT, method: HttpMethod.DELETE },
  updateProduct: { url: PRODUCT_API_ROUTES.PRODUCT, method: HttpMethod.PATCH },
};
