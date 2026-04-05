import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./frontend/features/translation/i18n/request.ts');

const r2PublicUrl = process.env.R2_PUBLIC_URL ?? '';
const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : '';

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: r2Hostname
      ? [{ protocol: 'https', hostname: r2Hostname }]
      : [],
  },
};

export default withNextIntl(nextConfig);
