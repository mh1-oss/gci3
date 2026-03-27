import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { PublicNavbar, PublicFooter } from "@/components/layout/ConditionalWrappers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CurrencyProvider } from "@/context/CurrencyContext";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | مجموعة الوليد للتجارة العامة",
    default: "مجموعة الوليد للتجارة العامة | AGT Group",
  },
  description: "مجموعة الوليد للتجارة العامة (AGT) - الوكيل الحصري لأجود أنواع الأصباغ والمنتجات الإنشائية في العراق. جودة عالية وحلول مبتكرة.",
  keywords: ["أصباغ", "دهانات", "ديكور", "مجموعة الوليد", "AGT Group", "العراق", "بغداد", "National Paints", "GCI Paints"],
  authors: [{ name: "AGT Group" }],
  metadataBase: new URL("https://agt-group.com"), // Update to real production URL when ready
  openGraph: {
    title: "مجموعة الوليد للتجارة العامة | AGT Group",
    description: "الوكيل الحصري لأجود أنواع الأصباغ والمنتجات الإنشائية في العراق.",
    url: "https://agt-group.com",
    siteName: "مجموعة الوليد للتجارة العامة",
    locale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مجموعة الوليد للتجارة العامة | AGT Group",
    description: "الوكيل الحصري لأجود أنواع الأصباغ والمنتجات الإنشائية في العراق.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.svg?v=1",
    apple: "/logo.svg?v=1",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await db.select().from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
  const exchangeRate = settings[0]?.exchangeRate || "1500";
  const showPrice = settings[0]?.showPrice === "true";

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden transition-colors duration-300">
        <NextTopLoader color="#E31837" showSpinner={false} height={3} shadow="0 0 10px #E31837,0 0 5px #E31837" />
        <CurrencyProvider initialExchangeRate={Number(exchangeRate)} showPrice={showPrice}>
          <PublicNavbar>
            <Navbar />
          </PublicNavbar>
          <main className="flex-grow">
            {children}
          </main>
          <PublicFooter>
            <Footer />
          </PublicFooter>
        </CurrencyProvider>
      </body>
    </html>
  );
}
