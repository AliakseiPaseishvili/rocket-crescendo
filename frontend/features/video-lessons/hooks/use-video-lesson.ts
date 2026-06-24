'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { VIDEO_LESSONS_QUERY_KEY } from '../constants';

export function useVideoLesson(id: string) {
  return useQuery({
    queryKey: [VIDEO_LESSONS_QUERY_KEY, id],
    queryFn: () => api.getVideoLesson({ params: { id } }),
    enabled: !!id,
  });
}
