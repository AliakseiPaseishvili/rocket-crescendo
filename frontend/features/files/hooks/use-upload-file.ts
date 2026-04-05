'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { FILES_QUERY_KEY } from '../constants';

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, name }: { file: File; name: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      return api.uploadFile({ body: formData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY] });
    },
  });
}
