'use client';

import { useCartSync } from '../hooks/use-cart-sync';

/**
 * Headless component that wires the cart↔session sync. Mount once in the main
 * layout; renders nothing.
 */
export const CartSyncProvider = () => {
  useCartSync();
  return null;
};
