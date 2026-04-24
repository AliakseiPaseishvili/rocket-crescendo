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
  getProduct: RequestApiType<undefined, { id: string }, undefined, ProductWithTranslations>;
  createProduct: RequestApiType<
    ProductCreateInput,
    undefined,
    undefined,
    ProductWithTranslations
  >;
  deleteProduct: RequestApiType<undefined, { id: string }, undefined, void>;
  updateProduct: RequestApiType<
    ProductUpdateInput,
    { id: string },
    undefined,
    ProductWithTranslations
  >;
};

export const PRODUCT_REQUEST_MAP: RequestMap<ProductApiTypes> = {
  getProducts: { url: PRODUCT_API_ROUTES.PRODUCTS, method: HttpMethod.GET },
  getProduct: { url: PRODUCT_API_ROUTES.PRODUCT, method: HttpMethod.GET },
  createProduct: { url: PRODUCT_API_ROUTES.PRODUCTS, method: HttpMethod.POST },
  deleteProduct: { url: PRODUCT_API_ROUTES.PRODUCT, method: HttpMethod.DELETE },
  updateProduct: { url: PRODUCT_API_ROUTES.PRODUCT, method: HttpMethod.PATCH },
};
