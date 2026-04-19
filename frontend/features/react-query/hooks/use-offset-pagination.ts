'use client';

import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';


import type { PaginatedItems } from '@/backend/types';

type UseOffsetPaginationOptions<T> = {
  queryKey: QueryKey;
  queryFn: (offset: number) => Promise<PaginatedItems<T>>;
};

export function useOffsetPagination<T>({ queryKey, queryFn }: UseOffsetPaginationOptions<T>) {
  const queryProps = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => queryFn(pageParam),
    getNextPageParam: (lastPage: PaginatedItems<T>) => {
      const nextOffset = lastPage.offset + lastPage.items.length;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });

  const { data, isFetching, hasNextPage, fetchNextPage: fetchNext } = queryProps;

  const items = useMemo(() => data?.pages.flatMap((p) => p.items), [data]);

  const fetchNextPage = useCallback(() => {
    if (!isFetching && hasNextPage) fetchNext();
  }, [isFetching, hasNextPage, fetchNext]);

  return { items, fetchNextPage, queryProps };
}
