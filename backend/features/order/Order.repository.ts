import {
  ADMIN_ORDER_STATUSES,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from "./constants";
import type {
  CheckoutAddressInput,
  OrderFilter,
  OrderWithItems,
  OrderWithItemsAndAddress,
  PricedItem,
} from "./types";
import { OrderStatus } from "../../app/generated/prisma/enums";
import prisma from "../../prisma/prisma";
import type { PaginatedItems } from "../../types";

const ORDER_INCLUDE = { items: true } as const;
const ADMIN_ORDER_INCLUDE = { items: true, address: true } as const;

export class OrderRepository {
  async createPending(data: {
    email: string;
    language: string;
    userId?: string;
    currency: string;
    amountTotal: number;
    stripeSessionId: string;
    items: PricedItem[];
    address: CheckoutAddressInput;
  }): Promise<OrderWithItems> {
    return prisma.order.create({
      data: {
        email: data.email,
        language: data.language,
        userId: data.userId ?? null,
        currency: data.currency,
        amountTotal: data.amountTotal,
        stripeSessionId: data.stripeSessionId,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitAmount: item.unitAmount,
          })),
        },
        address: {
          create: {
            country: data.address.country,
            region: data.address.region ?? null,
            addressLine1: data.address.addressLine1,
            addressLine2: data.address.addressLine2 ?? null,
            flatNumber: data.address.flatNumber ?? null,
            city: data.address.city,
            postcode: data.address.postcode,
            additionalInfo: data.address.additionalInfo ?? null,
          },
        },
      },
      include: ORDER_INCLUDE,
    });
  }

  async findByStripeSessionId(
    stripeSessionId: string,
  ): Promise<OrderWithItems | null> {
    return prisma.order.findUnique({
      where: { stripeSessionId },
      include: ORDER_INCLUDE,
    });
  }

  async markPaid(
    orderId: string,
    stripePaymentId: string | null,
  ): Promise<OrderWithItems> {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID, stripePaymentId },
      include: ORDER_INCLUDE,
    });
  }

  /**
   * Admin dashboard listing: paginated, newest first, filtered to the fulfilment
   * statuses (PAID/PREPARED/SENT) or a single status when provided. Mirrors the
   * File.repository.findAll shape (items + count in one $transaction).
   */
  async findAllForAdmin(
    filter?: OrderFilter,
  ): Promise<PaginatedItems<OrderWithItemsAndAddress>> {
    const offset = filter?.offset ?? DEFAULT_PAGINATION_OFFSET;
    const limit = filter?.limit ?? DEFAULT_PAGINATION_LIMIT;
    const where = {
      status: filter?.status ?? { in: [...ADMIN_ORDER_STATUSES] },
    };

    const [items, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { orderNumber: "desc" },
        include: ADMIN_ORDER_INCLUDE,
      }),
      prisma.order.count({ where }),
    ]);

    return { items, total, offset, limit };
  }

  async findByIdForAdmin(
    id: string,
  ): Promise<OrderWithItemsAndAddress | null> {
    return prisma.order.findUnique({
      where: { id },
      include: ADMIN_ORDER_INCLUDE,
    });
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderWithItemsAndAddress> {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: ADMIN_ORDER_INCLUDE,
    });
  }

  /**
   * Grants access to every purchased product, keyed by email. Idempotent via the
   * unique (email, productId) constraint — re-running skips existing grants.
   */
  async createAccessGrants(order: OrderWithItems): Promise<void> {
    await prisma.$transaction(
      order.items.map((item) =>
        prisma.productAccess.upsert({
          where: {
            email_productId: { email: order.email, productId: item.productId },
          },
          update: { userId: order.userId ?? undefined },
          create: {
            email: order.email,
            userId: order.userId ?? null,
            productId: item.productId,
            orderId: order.id,
          },
        }),
      ),
    );
  }

  async findAccessByEmail(email: string) {
    return prisma.productAccess.findMany({ where: { email } });
  }

  /** Backfills userId on access grants + orders once a guest email registers. */
  async linkEmailToUser(email: string, userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.productAccess.updateMany({
        where: { email, userId: null },
        data: { userId },
      }),
      prisma.order.updateMany({
        where: { email, userId: null },
        data: { userId },
      }),
    ]);
  }
}
