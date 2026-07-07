'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Auto-fetch-on-scroll helper for offset-paginated lists. Returns a `ref`
 * callback to attach to a sentinel element at the bottom of a scroll container;
 * `onReachEnd` fires whenever the sentinel scrolls into view. Pair with
 * `useOffsetPagination`'s guarded `fetchNextPage` as `onReachEnd`.
 */
export function useInfiniteScroll(onReachEnd: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(onReachEnd);

  useEffect(() => {
    callbackRef.current = onReachEnd;
  }, [onReachEnd]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    if (!node) return;
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) callbackRef.current();
    });
    observerRef.current.observe(node);
  }, []);
}
