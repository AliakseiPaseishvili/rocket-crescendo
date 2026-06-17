export const subscriptionConfirmTemplate = (url: string) => ({
  subject: "Confirm your news subscription — Rocket Crescendo",
  text: `Do you want to subscribe to the news?\n\nClick the link below to confirm your subscription:\n\n${url}\n\nThis link expires in 24 hours. You can ignore this email if you haven't requested this.`,
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Do you want to subscribe to the news?</h2>
      <p>Click the button below to confirm your subscription to Rocket Crescendo news.</p>
      <a
        href="${url}"
        style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;font-weight:600"
      >
        Confirm subscription
      </a>
      <p style="margin-top:24px;color:#666;font-size:14px">
        You can ignore this email if you haven't requested this.
      </p>
      <p style="color:#666;font-size:14px">This link expires in 24 hours.</p>
    </div>
  `,
});
