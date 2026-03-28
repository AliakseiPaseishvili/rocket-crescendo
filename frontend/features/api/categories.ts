import type {
  CategoryCreateInput,
  CategoryFilter,
  CategoryUpdateInput,
  CategoryWithTranslations,
} from '@/backend/features/category';

import { HttpMethod, RequestApiType, RequestMap } from './types';

const CATEGORY_API_ROUTES = {
  CATEGORIES: '/api/category',
  CATEGORY: '/api/category/:id',
} as const;

export type CategoryApiTypes = {
  getCategories: RequestApiType<
    undefined,
    undefined,
    CategoryFilter | undefined,
    CategoryWithTranslations[]
  >;
  createCategory: RequestApiType<
    CategoryCreateInput,
    undefined,
    undefined,
    CategoryWithTranslations
  >;
  deleteCategory: RequestApiType<undefined, { id: number }, undefined, void>;
  updateCategory: RequestApiType<
    CategoryUpdateInput,
    { id: number },
    undefined,
    CategoryWithTranslations
  >;
};

export const CATEGORY_REQUEST_MAP: RequestMap<CategoryApiTypes> = {
  getCategories: { url: CATEGORY_API_ROUTES.CATEGORIES, method: HttpMethod.GET },
  createCategory: { url: CATEGORY_API_ROUTES.CATEGORIES, method: HttpMethod.POST },
  deleteCategory: { url: CATEGORY_API_ROUTES.CATEGORY, method: HttpMethod.DELETE },
  updateCategory: { url: CATEGORY_API_ROUTES.CATEGORY, method: HttpMethod.PATCH },
};
