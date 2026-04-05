'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { FILES_QUERY_KEY } from '../constants';

export function useFiles() {
  return useQuery({
    queryKey: [FILES_QUERY_KEY],
    queryFn: () => api.getFiles(),
  });
}
