export interface BreadcrumbItem {
  labelKey?: "admin" | "products" | "categories" | "files" | "users" | "orders" | "create" | "edit" | "videoLessons";
  label?: string;
  href?: string;
  isLoading?: boolean;
}
