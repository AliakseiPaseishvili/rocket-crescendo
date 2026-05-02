export const passwordResetTemplate = (url: string) => ({
  subject: "Reset your password — Rocket Crescendo",
  text: `Click the link below to reset your password:\n\n${url}\n\nThis link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.`,
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Reset your password</h2>
      <p>We received a request to reset the password for your account. Click the button below to choose a new password.</p>
      <a
        href="${url}"
        style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;font-weight:600"
      >
        Reset password
      </a>
      <p style="margin-top:24px;color:#666;font-size:14px">
        If you didn't request a password reset, you can safely ignore this email.
      </p>
      <p style="color:#666;font-size:14px">This link expires in 1 hour.</p>
    </div>
  `,
});
