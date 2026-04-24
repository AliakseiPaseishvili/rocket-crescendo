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
  CATEGORIES_BY_IDS: '/api/category/by-ids',
} as const;

export type CategoryApiTypes = {
  getCategories: RequestApiType<
    undefined,
    undefined,
    CategoryFilter | undefined,
    CategoryWithTranslations[]
  >;
  getCategoriesByIds: RequestApiType<
    { ids: string[] },
    undefined,
    undefined,
    CategoryWithTranslations[]
  >;
  createCategory: RequestApiType<
    CategoryCreateInput,
    undefined,
    undefined,
    CategoryWithTranslations
  >;
  deleteCategory: RequestApiType<undefined, { id: string }, undefined, void>;
  updateCategory: RequestApiType<
    CategoryUpdateInput,
    { id: string },
    undefined,
    CategoryWithTranslations
  >;
};

export const CATEGORY_REQUEST_MAP: RequestMap<CategoryApiTypes> = {
  getCategories: { url: CATEGORY_API_ROUTES.CATEGORIES, method: HttpMethod.GET },
  getCategoriesByIds: { url: CATEGORY_API_ROUTES.CATEGORIES_BY_IDS, method: HttpMethod.POST },
  createCategory: { url: CATEGORY_API_ROUTES.CATEGORIES, method: HttpMethod.POST },
  deleteCategory: { url: CATEGORY_API_ROUTES.CATEGORY, method: HttpMethod.DELETE },
  updateCategory: { url: CATEGORY_API_ROUTES.CATEGORY, method: HttpMethod.PATCH },
};
