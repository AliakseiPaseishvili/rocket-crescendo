export const ROUTES = {
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_CREATE: '/admin/products/create',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORIES_CREATE: '/admin/categories/create',
  ADMIN_FILES: '/admin/files',
  BASE: '/',
} as const;

export const BREADCRUMBS_ADMIN = [
  { label: 'Admin', href: ROUTES.ADMIN },
];

export const BREADCRUMBS_ADMIN_PRODUCTS = [
  ...BREADCRUMBS_ADMIN,
  { label: 'Products', href: ROUTES.ADMIN_PRODUCTS },
];

export const BREADCRUMBS_ADMIN_PRODUCTS_CREATE = [
  ...BREADCRUMBS_ADMIN_PRODUCTS,
  { label: 'Create' },
];

export const BREADCRUMBS_ADMIN_FILES = [
  ...BREADCRUMBS_ADMIN,
  { label: 'Files' },
];

export const BREADCRUMBS_ADMIN_CATEGORIES = [
  ...BREADCRUMBS_ADMIN,
  { label: 'Categories', href: ROUTES.ADMIN_CATEGORIES },
];

export const BREADCRUMBS_ADMIN_CATEGORIES_CREATE = [
  ...BREADCRUMBS_ADMIN_CATEGORIES,
  { label: 'Create' },
];
