import type {
  CheckoutAddressInput,
  CheckoutItemInput,
  CheckoutResult,
} from "@/backend/features/order";

import { HttpMethod, RequestApiType, RequestMap } from "./types";

const CHECKOUT_API_ROUTES = {
  CHECKOUT: "/api/checkout",
} as const;

export type CheckoutApiTypes = {
  createCheckout: RequestApiType<
    {
      items: CheckoutItemInput[];
      lng: string;
      email: string;
      address: CheckoutAddressInput;
    },
    undefined,
    undefined,
    CheckoutResult
  >;
};

export const CHECKOUT_REQUEST_MAP: RequestMap<CheckoutApiTypes> = {
  createCheckout: { url: CHECKOUT_API_ROUTES.CHECKOUT, method: HttpMethod.POST },
};
