import { CartRepository } from "./Cart.repository";
import type { CartItemInput, CartItemModel } from "./types";

export class CartService {
  private readonly repository: CartRepository;

  constructor() {
    this.repository = new CartRepository();
  }

  async getCart(userId: string): Promise<CartItemModel[]> {
    return this.repository.findByUser(userId);
  }

  /** Validates + dedupes incoming items, then full-replaces the user's cart. */
  private normalize(items: CartItemInput[]): CartItemInput[] {
    const byProduct = new Map<string, number>();
    for (const item of items) {
      if (!item.productId) throw new Error("productId is required");
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Each item must have a positive integer quantity");
      }
      // Same product listed twice in one payload → keep the greater quantity.
      byProduct.set(
        item.productId,
        Math.max(byProduct.get(item.productId) ?? 0, item.quantity),
      );
    }
    return [...byProduct].map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  async replaceCart(
    userId: string,
    items: CartItemInput[],
  ): Promise<CartItemModel[]> {
    return this.repository.replaceForUser(userId, this.normalize(items));
  }

  /**
   * Merges the incoming (guest) cart with the saved server cart. For a product in
   * both, the greater quantity wins. Used on login.
   */
  async mergeCart(
    userId: string,
    incoming: CartItemInput[],
  ): Promise<CartItemModel[]> {
    const existing = await this.repository.findByUser(userId);
    const byProduct = new Map<string, number>();
    for (const item of existing) {
      byProduct.set(item.productId, item.quantity);
    }
    for (const item of this.normalize(incoming)) {
      byProduct.set(
        item.productId,
        Math.max(byProduct.get(item.productId) ?? 0, item.quantity),
      );
    }
    const merged = [...byProduct].map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
    return this.repository.replaceForUser(userId, merged);
  }

  async clearCart(userId: string): Promise<void> {
    return this.repository.clearForUser(userId);
  }
}
