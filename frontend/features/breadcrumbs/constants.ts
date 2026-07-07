import { ROUTES } from '@/frontend/constants';

import type { BreadcrumbItem } from './types';

export const BREADCRUMBS_ADMIN: BreadcrumbItem[] = [
  { labelKey: 'admin', href: ROUTES.ADMIN },
];

export const BREADCRUMBS_ADMIN_PRODUCTS: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN,
  { labelKey: 'products', href: ROUTES.ADMIN_PRODUCTS },
];

export const BREADCRUMBS_ADMIN_PRODUCTS_CREATE: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN_PRODUCTS,
  { labelKey: 'create' },
];

export const BREADCRUMBS_ADMIN_PRODUCTS_EDIT: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN_PRODUCTS,
  { labelKey: 'edit' },
];

export const BREADCRUMBS_ADMIN_FILES: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN,
  { labelKey: 'files' },
];

export const BREADCRUMBS_ADMIN_CATEGORIES: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN,
  { labelKey: 'categories', href: ROUTES.ADMIN_CATEGORIES },
];

export const BREADCRUMBS_ADMIN_CATEGORIES_CREATE: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN_CATEGORIES,
  { labelKey: 'create' },
];


export const BREADCRUMBS_ADMIN_USERS: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN,
  { labelKey: 'users' },
];

export const BREADCRUMBS_ADMIN_ORDERS: BreadcrumbItem[] = [
  ...BREADCRUMBS_ADMIN,
  { labelKey: 'orders' },
];
