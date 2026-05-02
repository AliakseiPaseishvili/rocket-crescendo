import sgMail from "@sendgrid/mail";

import { passwordResetTemplate } from "./templates/password-reset";
import { verifyEmailTemplate } from "./templates/verify-email";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL ?? "";

export const sendPasswordResetEmail = async (to: string, url: string) => {
  await sgMail.send({ to, from: FROM_EMAIL, ...passwordResetTemplate(url) });
};

export const sendVerificationEmail = async (to: string, url: string) => {
  await sgMail.send({ to, from: FROM_EMAIL, ...verifyEmailTemplate(url) });
};
