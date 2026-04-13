'use client';

import { useQuery } from '@tanstack/react-query';

import type { FileFilter } from '@/backend/features/file';
import { api } from '@/frontend/features/api';

import { FILES_QUERY_KEY } from '../constants';

export function useFiles(filter?: FileFilter) {
  return useQuery({
    queryKey: filter ? [FILES_QUERY_KEY, filter] : [FILES_QUERY_KEY],
    queryFn: () => api.getFiles(filter ? { query: filter } : undefined),
  });
}
