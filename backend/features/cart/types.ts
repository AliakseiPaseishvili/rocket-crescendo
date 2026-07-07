export type { CartItemModel } from "../../app/generated/prisma/models/CartItem";

export type CartItemInput = {
  productId: string;
  quantity: number;
};
