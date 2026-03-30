'use client';
import { QueryKey, useQuery } from '@tanstack/react-query';

type UseCacheQuery = {
  queryKey: QueryKey;
};

export const useCacheQuery = <T>({ queryKey }: UseCacheQuery) => {
  return useQuery<T>({
    queryKey,
    enabled: false,
    queryFn: () => {
      throw new Error('This queryFn should never be called');
    },
    gcTime: Infinity,
  });
};