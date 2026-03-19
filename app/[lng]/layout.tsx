import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { supportedLngs } from "@/frontend/features/translation";
import { I18nProvider } from "@/frontend/features/translation/components";
import { dir } from "i18next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return supportedLngs.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "Cyber Shop: Rocket Crescendo",
  description: "Buy Rocket Crescendo books and merch",
};

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}>) => {
  const { lng } = await params;
  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider lng={lng}>{children}</I18nProvider>
      </body>
    </html>
  );
};

export default RootLayout;
