'use client';

import { useQuery } from '@tanstack/react-query';

import type { FileFilter } from '@/backend/features/file';
import { api } from '@/frontend/features/api';
import { useDebounce } from '@/frontend/features/hooks';

import { FILES_QUERY_KEY } from '../constants';

export function useFiles(filter?: FileFilter) {
  const debouncedFilter = useDebounce(filter);

  return useQuery({
    queryKey: [FILES_QUERY_KEY, debouncedFilter],
    queryFn: () => api.getFiles(debouncedFilter ? { query: debouncedFilter } : undefined),
  });
}
