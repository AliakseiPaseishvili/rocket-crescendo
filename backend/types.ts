export type PaginationFilter = {
  offset?: number;
  limit?: number;
};

export type PaginatedItems<T> = {
  items: T[];
  total: number;
  offset: number;
  limit: number;
};
