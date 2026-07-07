type OrderConfirmationItem = {
  name: string;
  quantity: number;
  unitAmount: number;
};

export type OrderConfirmationParams = {
  items: OrderConfirmationItem[];
  amountTotal: number;
  currency: string;
  language: string;
};

type Copy = {
  subject: string;
  heading: string;
  intro: string;
  itemLabel: string;
  qtyLabel: string;
  totalLabel: string;
};

const COPY: Record<string, Copy> = {
  en: {
    subject: "Your order confirmation — Rocket Crescendo",
    heading: "Thank you for your order",
    intro: "We've received your payment. Here's what you purchased:",
    itemLabel: "Item",
    qtyLabel: "Qty",
    totalLabel: "Total",
  },
  fr: {
    subject: "Confirmation de votre commande — Rocket Crescendo",
    heading: "Merci pour votre commande",
    intro: "Nous avons bien reçu votre paiement. Voici votre achat :",
    itemLabel: "Article",
    qtyLabel: "Qté",
    totalLabel: "Total",
  },
  ru: {
    subject: "Подтверждение вашего заказа — Rocket Crescendo",
    heading: "Спасибо за ваш заказ",
    intro: "Мы получили ваш платёж. Вот что вы приобрели:",
    itemLabel: "Товар",
    qtyLabel: "Кол-во",
    totalLabel: "Итого",
  },
};

const formatAmount = (cents: number, currency: string): string => {
  const value = (cents / 100).toFixed(2);
  return `${value} ${currency.toUpperCase()}`;
};

export const orderConfirmationTemplate = (params: OrderConfirmationParams) => {
  const { items, amountTotal, currency, language } = params;
  const copy = COPY[language] ?? COPY.en;

  const textLines = items.map(
    (item) =>
      `- ${item.name} × ${item.quantity} — ${formatAmount(
        item.unitAmount * item.quantity,
        currency,
      )}`,
  );
  const text = `${copy.heading}\n\n${copy.intro}\n\n${textLines.join(
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

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>${copy.heading}</h2>
      <p>${copy.intro}</p>
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

  return { subject: copy.subject, text, html };
};
