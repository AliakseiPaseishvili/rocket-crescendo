import type {
  ProductSectionCreateInput,
  ProductSectionFilter,
  ProductSectionUpdateInput,
  ProductSectionWithTranslations,
} from '@/backend/features/product-section';

import { HttpMethod, RequestApiType, RequestMap } from './types';

const PRODUCT_SECTION_API_ROUTES = {
  PRODUCT_SECTIONS: '/api/product-sections',
  PRODUCT_SECTION: '/api/product-sections/:id',
} as const;

export type ProductSectionApiTypes = {
  getProductSections: RequestApiType<
    undefined,
    undefined,
    ProductSectionFilter | undefined,
    ProductSectionWithTranslations[]
  >;
  getProductSection: RequestApiType<
    undefined,
    { id: string },
    undefined,
    ProductSectionWithTranslations
  >;
  createProductSection: RequestApiType<
    ProductSectionCreateInput,
    undefined,
    undefined,
    ProductSectionWithTranslations
  >;
  updateProductSection: RequestApiType<
    ProductSectionUpdateInput,
    { id: string },
    undefined,
    ProductSectionWithTranslations
  >;
  deleteProductSection: RequestApiType<undefined, { id: string }, undefined, void>;
};

export const PRODUCT_SECTION_REQUEST_MAP: RequestMap<ProductSectionApiTypes> = {
  getProductSections: { url: PRODUCT_SECTION_API_ROUTES.PRODUCT_SECTIONS, method: HttpMethod.GET },
  getProductSection: { url: PRODUCT_SECTION_API_ROUTES.PRODUCT_SECTION, method: HttpMethod.GET },
  createProductSection: { url: PRODUCT_SECTION_API_ROUTES.PRODUCT_SECTIONS, method: HttpMethod.POST },
  updateProductSection: { url: PRODUCT_SECTION_API_ROUTES.PRODUCT_SECTION, method: HttpMethod.PATCH },
  deleteProductSection: { url: PRODUCT_SECTION_API_ROUTES.PRODUCT_SECTION, method: HttpMethod.DELETE },
};
