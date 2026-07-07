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
