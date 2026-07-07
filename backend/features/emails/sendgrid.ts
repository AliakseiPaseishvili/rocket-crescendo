import sgMail from "@sendgrid/mail";

import {
  orderConfirmationTemplate,
  type OrderConfirmationParams,
} from "./templates/order-confirmation";
import {
  orderShippedTemplate,
  type OrderShippedParams,
} from "./templates/order-shipped";
import { passwordResetTemplate } from "./templates/password-reset";
import { subscriptionConfirmTemplate } from "./templates/subscription-confirm";
import { subscriptionWelcomeTemplate } from "./templates/subscription-welcome";
import { verifyEmailTemplate } from "./templates/verify-email";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL ?? "";

export const sendPasswordResetEmail = async (to: string, url: string) => {
  await sgMail.send({ to, from: FROM_EMAIL, ...passwordResetTemplate(url) });
};

export const sendVerificationEmail = async (to: string, url: string) => {
  await sgMail.send({ to, from: FROM_EMAIL, ...verifyEmailTemplate(url) });
};

export const sendSubscriptionConfirmEmail = async (to: string, url: string) => {
  await sgMail.send({ to, from: FROM_EMAIL, ...subscriptionConfirmTemplate(url) });
};

export const sendSubscriptionWelcomeEmail = async (to: string) => {
  await sgMail.send({ to, from: FROM_EMAIL, ...subscriptionWelcomeTemplate() });
};

export const sendOrderConfirmationEmail = async (
  to: string,
  params: OrderConfirmationParams,
) => {
  await sgMail.send({
    to,
    from: FROM_EMAIL,
    ...orderConfirmationTemplate(params),
  });
};

export const sendOrderShippedEmail = async (
  to: string,
  params: OrderShippedParams,
) => {
  await sgMail.send({
    to,
    from: FROM_EMAIL,
    ...orderShippedTemplate(params),
  });
};
