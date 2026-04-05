'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { FILES_QUERY_KEY } from '../constants';

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY] });
    },
  });
}
