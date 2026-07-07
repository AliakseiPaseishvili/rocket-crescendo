import type { CartItemInput, CartItemModel } from "./types";
import prisma from "../../prisma/prisma";

export class CartRepository {
  async findByUser(userId: string): Promise<CartItemModel[]> {
    return prisma.cartItem.findMany({ where: { userId } });
  }

  /** Full-replace: clears the user's cart and recreates it from the given items. */
  async replaceForUser(
    userId: string,
    items: CartItemInput[],
  ): Promise<CartItemModel[]> {
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { userId } }),
      ...(items.length
        ? [
            prisma.cartItem.createMany({
              data: items.map((item) => ({
                userId,
                productId: item.productId,
                quantity: item.quantity,
              })),
            }),
          ]
        : []),
    ]);
    return this.findByUser(userId);
  }

  async clearForUser(userId: string): Promise<void> {
    await prisma.cartItem.deleteMany({ where: { userId } });
  }
}
