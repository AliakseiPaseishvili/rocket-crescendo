'use client';

import type { FileFilter } from '@/backend/features/file';
import { api } from '@/frontend/features/api';
import { useDebounce } from '@/frontend/features/hooks';
import { useOffsetPagination } from '@/frontend/features/react-query';

import { FILES_QUERY_KEY } from '../constants';

export function useFiles(filter?: Omit<FileFilter, 'offset'>) {
  const debouncedFilter = useDebounce(filter);

  return useOffsetPagination({
    queryKey: [FILES_QUERY_KEY, debouncedFilter],
    queryFn: (offset) => api.getFiles({ query: { ...debouncedFilter, offset } }),
  });
}
