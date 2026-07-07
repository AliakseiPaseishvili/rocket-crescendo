'use client';

import { useEffect, useRef } from 'react';

import { api } from '@/frontend/features/api';
import { useSession } from '@/frontend/features/auth';

import { useCartStore } from '../store/useCartStore';

const WRITE_THROUGH_DEBOUNCE_MS = 500;

/**
 * Keeps the Zustand cart in sync with the server for logged-in users:
 * - on login (incl. first resolve while authed): merge the local cart into the
 *   server cart (greater-quantity wins) and adopt the result;
 * - on logout: clear the local cart;
 * - while authed: debounced write-through of every change to PUT /api/cart.
 *
 * Guests are untouched — the store stays localStorage-only.
 */
export function useCartSync() {
  const { data: session, isPending } = useSession();
  const authed = !!session?.user;

  // Tracks the previous auth state so we can detect transitions.
  const prevAuthed = useRef<boolean | null>(null);
  // Suppresses the write-through that would otherwise echo a merge/hydrate result.
  const suppressWrite = useRef(false);

  // Handle auth transitions.
  useEffect(() => {
    if (isPending) return;
    const wasAuthed = prevAuthed.current;

    if (authed && wasAuthed !== true) {
      const localItems = useCartStore.getState().items;
      suppressWrite.current = true;
      api
        .mergeCart({ body: { items: localItems } })
        .then((merged) => useCartStore.getState().replaceAll(merged))
        .catch(() => {})
        .finally(() => {
          suppressWrite.current = false;
        });
    } else if (!authed && wasAuthed === true) {
      useCartStore.getState().clear();
    }

    prevAuthed.current = authed;
  }, [authed, isPending]);

  // Debounced write-through while authenticated.
  useEffect(() => {
    if (!authed) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = useCartStore.subscribe((state, prev) => {
      if (state.items === prev.items) return;
      if (suppressWrite.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        api
          .replaceCart({ body: { items: useCartStore.getState().items } })
          .catch(() => {});
      }, WRITE_THROUGH_DEBOUNCE_MS);
    });

    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [authed]);
}
