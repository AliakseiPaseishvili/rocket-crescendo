'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { VIDEO_LESSONS_QUERY_KEY } from '../constants';

export function useVideoLessons(sectionId: string) {
  return useQuery({
    queryKey: [VIDEO_LESSONS_QUERY_KEY, sectionId],
    queryFn: () => api.getVideoLessons({ query: { sectionId } }),
    enabled: !!sectionId,
  });
}
