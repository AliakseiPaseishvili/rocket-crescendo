'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { VIDEO_LESSONS_QUERY_KEY } from '../constants';

export function useCreateVideoLesson(sectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createVideoLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VIDEO_LESSONS_QUERY_KEY, sectionId] });
    },
  });
}
