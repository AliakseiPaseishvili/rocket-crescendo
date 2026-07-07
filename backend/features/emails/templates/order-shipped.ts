import type { OrderAddressModel } from "../../../app/generated/prisma/models/OrderAddress";

type OrderShippedItem = {
  name: string;
  quantity: number;
  unitAmount: number;
};

export type OrderShippedParams = {
  orderNumber: number;
  items: OrderShippedItem[];
  amountTotal: number;
  currency: string;
  language: string;
  address: OrderAddressModel;
};

type Copy = {
  subject: (orderNumber: number) => string;
  heading: (orderNumber: number) => string;
  intro: string;
  itemLabel: string;
  qtyLabel: string;
  totalLabel: string;
  addressLabel: string;
};

const COPY: Record<string, Copy> = {
  en: {
    subject: (n) => `Your order #${n} is on its way — Rocket Crescendo`,
    heading: (n) => `Order #${n} has been shipped`,
    intro: "Great news — your order is on its way. It will be delivered to:",
    itemLabel: "Item",
    qtyLabel: "Qty",
    totalLabel: "Total",
    addressLabel: "Delivery address",
  },
  fr: {
    subject: (n) => `Votre commande #${n} est en route — Rocket Crescendo`,
    heading: (n) => `La commande #${n} a été expédiée`,
    intro: "Bonne nouvelle — votre commande est en route. Elle sera livrée à :",
    itemLabel: "Article",
    qtyLabel: "Qté",
    totalLabel: "Total",
    addressLabel: "Adresse de livraison",
  },
  ru: {
    subject: (n) => `Ваш заказ #${n} в пути — Rocket Crescendo`,
    heading: (n) => `Заказ #${n} отправлен`,
    intro: "Хорошие новости — ваш заказ уже в пути. Он будет доставлен по адресу:",
    itemLabel: "Товар",
    qtyLabel: "Кол-во",
    totalLabel: "Итого",
    addressLabel: "Адрес доставки",
  },
};

const formatAmount = (cents: number, currency: string): string => {
  const value = (cents / 100).toFixed(2);
  return `${value} ${currency.toUpperCase()}`;
};

/** Builds the address into an ordered list of non-empty lines. */
const addressLines = (address: OrderAddressModel): string[] => {
  const line1 = [address.flatNumber, address.addressLine1]
    .filter(Boolean)
    .join(", ");
  return [
    line1,
    address.addressLine2,
    address.city,
    address.postcode,
    address.region,
    address.country,
    address.additionalInfo,
  ].filter((line): line is string => Boolean(line && line.trim()));
};

export const orderShippedTemplate = (params: OrderShippedParams) => {
  const { orderNumber, items, amountTotal, currency, language, address } =
    params;
  const copy = COPY[language] ?? COPY.en;
  const lines = addressLines(address);

  const textItems = items.map(
    (item) =>
      `- ${item.name} × ${item.quantity} — ${formatAmount(
        item.unitAmount * item.quantity,
        currency,
      )}`,
  );
  const text = `${copy.heading(orderNumber)}\n\n${copy.intro}\n\n${
    copy.addressLabel
  }:\n${lines.join("\n")}\n\n${textItems.join(
    "\n",
  )}\n\n${copy.totalLabel}: ${formatAmount(amountTotal, currency)}`;

  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatAmount(
            item.unitAmount * item.quantity,
            currency,
          )}</td>
        </tr>`,
    )
    .join("");

  const addressHtml = lines
    .map((line) => `<div>${line}</div>`)
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>${copy.heading(orderNumber)}</h2>
      <p>${copy.intro}</p>
      <div style="margin:16px 0;padding:12px 16px;background:#f6f6f6;border-radius:8px">
        <div style="font-weight:600;margin-bottom:8px">${copy.addressLabel}</div>
        ${addressHtml}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #000">${copy.itemLabel}</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #000">${copy.qtyLabel}</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #000">${copy.totalLabel}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:16px;text-align:right;font-weight:600">
        ${copy.totalLabel}: ${formatAmount(amountTotal, currency)}
      </p>
    </div>
  `;

  return { subject: copy.subject(orderNumber), text, html };
};
