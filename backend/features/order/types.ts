import type { OrderStatus } from "../../app/generated/prisma/enums";
import type { OrderGetPayload } from "../../app/generated/prisma/models";
import type { PaginatedItems, PaginationFilter } from "../../types";

export type { OrderModel } from "../../app/generated/prisma/models/Order";
export type { OrderItemModel } from "../../app/generated/prisma/models/OrderItem";
export type { OrderAddressModel } from "../../app/generated/prisma/models/OrderAddress";
export type { ProductAccessModel } from "../../app/generated/prisma/models/ProductAccess";

export type OrderWithItems = OrderGetPayload<{
  include: { items: true };
}>;

export type OrderWithItemsAndAddress = OrderGetPayload<{
  include: { items: true; address: true };
}>;

export type OrderFilter = PaginationFilter & {
  status?: OrderStatus;
};

export type AdminOrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitAmount: number;
};

export type AdminOrder = Omit<OrderWithItemsAndAddress, "items"> & {
  items: AdminOrderItem[];
};

export type PaginatedAdminOrders = PaginatedItems<AdminOrder>;

export type UserOrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitAmount: number;
  imageUrl: string | null;
};

/**
 * Customer-facing order shape. Deliberately omits status, email, address, and
 * Stripe identifiers — the "My Orders" page must not leak fulfilment internals.
 */
export type UserOrder = {
  id: string;
  orderNumber: number;
  amountTotal: number;
  currency: string;
  createdAt: Date;
  itemCount: number;
  items: UserOrderItem[];
};

export type PaginatedUserOrders = PaginatedItems<UserOrder>;

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutAddressInput = {
  country: string;
  region?: string;
  addressLine1: string;
  addressLine2?: string;
  flatNumber?: string;
  city: string;
  postcode: string;
  additionalInfo?: string;
};

export type CreateCheckoutParams = {
  items: CheckoutItemInput[];
  lng: string;
  email: string;
  address: CheckoutAddressInput;
  userId?: string;
};

export type CheckoutResult = {
  url: string;
};

export type PricedItem = {
  productId: string;
  name: string;
  quantity: number;
  unitAmount: number;
};
