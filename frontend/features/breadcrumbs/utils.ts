import { BREADCRUMBS_ADMIN_PRODUCTS } from './constants';
import type { BreadcrumbItem } from './types';

export const createBreadcrumbsAdminProductsVideoLessons = (
  id: string,
  productName?: string,
  isLoading?: boolean,
): BreadcrumbItem[] => [
  ...BREADCRUMBS_ADMIN_PRODUCTS,
  {
    label: productName,
    href: `/admin/products/${id}/edit`,
    isLoading,
  },
  { labelKey: 'videoLessons' },
];
