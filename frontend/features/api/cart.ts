import type { CartItemInput, CartItemModel } from "@/backend/features/cart";

import { HttpMethod, RequestApiType, RequestMap } from "./types";

const CART_API_ROUTES = {
  CART: "/api/cart",
  CART_MERGE: "/api/cart/merge",
} as const;

export type CartApiTypes = {
  getCart: RequestApiType<undefined, undefined, undefined, CartItemModel[]>;
  replaceCart: RequestApiType<
    { items: CartItemInput[] },
    undefined,
    undefined,
    CartItemModel[]
  >;
  mergeCart: RequestApiType<
    { items: CartItemInput[] },
    undefined,
    undefined,
    CartItemModel[]
  >;
  clearCart: RequestApiType<undefined, undefined, undefined, void>;
};

export const CART_REQUEST_MAP: RequestMap<CartApiTypes> = {
  getCart: { url: CART_API_ROUTES.CART, method: HttpMethod.GET },
  replaceCart: { url: CART_API_ROUTES.CART, method: HttpMethod.PUT },
  mergeCart: { url: CART_API_ROUTES.CART_MERGE, method: HttpMethod.POST },
  clearCart: { url: CART_API_ROUTES.CART, method: HttpMethod.DELETE },
};
