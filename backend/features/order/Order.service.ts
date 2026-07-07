import type Stripe from "stripe";

import { OrderRepository } from "./Order.repository";
import type {
  AdminOrder,
  AdminOrderItem,
  CheckoutResult,
  CreateCheckoutParams,
  OrderFilter,
  OrderWithItems,
  OrderWithItemsAndAddress,
  PaginatedAdminOrders,
  PricedItem,
} from "./types";
import { OrderStatus } from "../../app/generated/prisma/enums";
import { sendOrderConfirmationEmail, sendOrderShippedEmail } from "../emails";
import { ProductRepository } from "../product/Product.repository";
import type { ProductWithTranslations } from "../product/types";
import { isStripeConfigured, stripe } from "../stripe";

const DEFAULT_CURRENCY = "usd";

export class OrderService {
  private readonly repository: OrderRepository;
  private readonly products: ProductRepository;

  constructor() {
    this.repository = new OrderRepository();
    this.products = new ProductRepository();
  }

  private pickName(product: ProductWithTranslations, lng: string): string {
    const match =
      product.translations.find((t) => t.language === lng) ??
      product.translations.find((t) => t.language === "en") ??
      product.translations[0];
    return match?.name ?? "Product";
  }

  /**
   * Re-prices the cart server-side (never trusts client prices), creates a Stripe
   * Checkout Session in payment mode, records a PENDING order, and returns the URL.
   */
  async createCheckoutSession(
    params: CreateCheckoutParams,
  ): Promise<CheckoutResult> {
    const { items, lng, email, address, userId } = params;

    if (!items?.length) throw new Error("Cart is empty");
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Each item must have a positive integer quantity");
      }
    }

    if (!email?.trim()) throw new Error("Email is required");
    const requiredAddress: Array<[keyof typeof address, string]> = [
      ["country", "Country is required"],
      ["addressLine1", "Address line 1 is required"],
      ["city", "City is required"],
      ["postcode", "Postcode is required"],
    ];
    for (const [field, message] of requiredAddress) {
      if (!address?.[field]?.trim()) throw new Error(message);
    }

    const ids = [...new Set(items.map((i) => i.productId))];
    const products = await this.products.findByIds(ids);
    const productById = new Map(products.map((p) => [p.id, p]));

    const priced: PricedItem[] = items.map((item) => {
      const product = productById.get(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      const unitAmount = Math.round(product.price * 100);
      if (unitAmount <= 0) {
        throw new Error(`Product ${item.productId} has an invalid price`);
      }
      return {
        productId: product.id,
        name: this.pickName(product, lng),
        quantity: item.quantity,
        unitAmount,
      };
    });

    const amountTotal = priced.reduce(
      (sum, item) => sum + item.unitAmount * item.quantity,
      0,
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Mock payment fallback: when Stripe is not configured, skip Stripe entirely,
    // create the order, fulfil it inline (no webhook will ever fire), and redirect
    // straight to the success page.
    if (!isStripeConfigured()) {
      const mockSessionId = `mock_${crypto.randomUUID()}`;
      const order = await this.repository.createPending({
        email,
        language: lng,
        userId,
        currency: DEFAULT_CURRENCY,
        amountTotal,
        stripeSessionId: mockSessionId,
        items: priced,
        address,
      });
      await this.completeOrder(order, email, null);
      return {
        url: `${appUrl}/${lng}/checkout/success?session_id=${mockSessionId}`,
      };
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.map(
      (item) => ({
        quantity: item.quantity,
        price_data: {
          currency: DEFAULT_CURRENCY,
          unit_amount: item.unitAmount,
          product_data: { name: item.name },
        },
      }),
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      success_url: `${appUrl}/${lng}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${lng}/checkout/cancel`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    await this.repository.createPending({
      email,
      language: lng,
      userId,
      currency: DEFAULT_CURRENCY,
      amountTotal,
      stripeSessionId: session.id,
      items: priced,
      address,
    });

    return { url: session.url };
  }

  /**
   * Called by the Stripe webhook on checkout.session.completed. Idempotent: a second
   * delivery of the same event is a no-op once the order is already PAID.
   */
  async fulfillCheckout(
    session: Stripe.Checkout.Session,
  ): Promise<OrderWithItems | null> {
    const order = await this.repository.findByStripeSessionId(session.id);
    if (!order) return null;
    if (order.status === "PAID") return order;

    // Prefer the email Stripe collected (covers guest checkout without a session).
    const email = session.customer_details?.email ?? order.email;
    const paymentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);

    return this.completeOrder(order, email, paymentId);
  }

  /**
   * Flips a PENDING order to PAID, grants product access, and sends the confirmation
   * email. Shared by the Stripe webhook (`fulfillCheckout`) and the mock-payment path
   * (`createCheckoutSession` when Stripe is not configured).
   */
  private async completeOrder(
    order: OrderWithItems,
    email: string,
    paymentId: string | null,
  ): Promise<OrderWithItems> {
    const paid = await this.repository.markPaid(order.id, paymentId);
    await this.repository.createAccessGrants({ ...paid, email });

    // Email failures must not throw: the order is already PAID, and a 500 here
    // would make Stripe retry a completed order. Swallow and move on.
    try {
      const ids = [...new Set(paid.items.map((i) => i.productId))];
      const products = await this.products.findByIds(ids);
      const productById = new Map(products.map((p) => [p.id, p]));
      const items = paid.items.map((item) => {
        const product = productById.get(item.productId);
        return {
          name: product ? this.pickName(product, paid.language) : "Product",
          quantity: item.quantity,
          unitAmount: item.unitAmount,
        };
      });
      await sendOrderConfirmationEmail(email, {
        items,
        amountTotal: paid.amountTotal,
        currency: paid.currency,
        language: paid.language,
      });
    } catch {
      // Intentionally ignored — the purchase is complete regardless of email delivery.
    }

    return paid;
  }

  /**
   * Resolves each order's items to display names once, batching the product
   * lookup across all orders. Uses the same localized `pickName` fallback as the
   * confirmation email (order.language, then en, then any translation).
   */
  private async withResolvedNames(
    orders: OrderWithItemsAndAddress[],
  ): Promise<AdminOrder[]> {
    const ids = [
      ...new Set(orders.flatMap((order) => order.items.map((i) => i.productId))),
    ];
    const products = await this.products.findByIds(ids);
    const productById = new Map(products.map((p) => [p.id, p]));

    return orders.map((order) => ({
      ...order,
      items: order.items.map<AdminOrderItem>((item) => {
        const product = productById.get(item.productId);
        return {
          productId: item.productId,
          name: product ? this.pickName(product, order.language) : "Product",
          quantity: item.quantity,
          unitAmount: item.unitAmount,
        };
      }),
    }));
  }

  /** Admin dashboard listing — paginated, filtered to fulfilment statuses. */
  async getOrdersForAdmin(
    filter?: OrderFilter,
  ): Promise<PaginatedAdminOrders> {
    const { items, total, offset, limit } =
      await this.repository.findAllForAdmin(filter);
    return {
      items: await this.withResolvedNames(items),
      total,
      offset,
      limit,
    };
  }

  /**
   * Advances an order's fulfilment status. Only PAID → PREPARED and
   * PREPARED → SENT are allowed. When an order is marked SENT, the customer is
   * emailed a shipping notification that duplicates the delivery address; the
   * send is best-effort (swallowed on failure) so the status change still
   * succeeds — matching the confirmation-email convention.
   */
  async updateOrderStatus(
    id: string,
    target: OrderStatus,
  ): Promise<AdminOrder> {
    const order = await this.repository.findByIdForAdmin(id);
    if (!order) throw new Error("Order not found");

    const allowed =
      (order.status === OrderStatus.PAID &&
        target === OrderStatus.PREPARED) ||
      (order.status === OrderStatus.PREPARED && target === OrderStatus.SENT);
    if (!allowed) throw new Error("Invalid status transition");

    const updated = await this.repository.updateStatus(id, target);
    const [adminOrder] = await this.withResolvedNames([updated]);

    if (target === OrderStatus.SENT && updated.address) {
      try {
        await sendOrderShippedEmail(updated.email, {
          orderNumber: updated.orderNumber,
          items: adminOrder.items,
          amountTotal: updated.amountTotal,
          currency: updated.currency,
          language: updated.language,
          address: updated.address,
        });
      } catch {
        // Intentionally ignored — the order is already SENT regardless of email delivery.
      }
    }

    return adminOrder;
  }

  async getAccessForEmail(email: string) {
    return this.repository.findAccessByEmail(email);
  }

  async linkEmailToUser(email: string, userId: string): Promise<void> {
    await this.repository.linkEmailToUser(email, userId);
  }
}
