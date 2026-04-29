import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL ?? "";

export const sendVerificationEmail = async (to: string, url: string) => {
  await sgMail.send({
    to,
    from: FROM_EMAIL,
    subject: "Verify your email address — Rocket Crescendo",
    text: `Click the link below to verify your email address:\n\n${url}\n\nThis link expires in 24 hours.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Verify your email address</h2>
        <p>Thanks for signing up! Click the button below to verify your email address.</p>
        <a
          href="${url}"
          style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;font-weight:600"
        >
          Verify email
        </a>
        <p style="margin-top:24px;color:#666;font-size:14px">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="color:#666;font-size:14px">This link expires in 24 hours.</p>
      </div>
    `,
  });
};
