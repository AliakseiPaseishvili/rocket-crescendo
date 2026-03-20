import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { supportedLngs } from "@/frontend/features/translation";
import { I18nProvider } from "@/frontend/features/translation/components";
import { initI18next } from "@/frontend/features/translation/i18n-server";
import { Header } from "@/frontend/features/header";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await initI18next(lng, "metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

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
        <I18nProvider lng={lng}>
          <Header />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
};

export default RootLayout;
