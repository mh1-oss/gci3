import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { PublicNavbar, PublicFooter } from "@/components/layout/ConditionalWrappers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CurrencyProvider } from "@/context/CurrencyContext";
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
  title: "شركة أصباغ GCI | GCI Paints",
  description: "الموقع الرسمي لشركة أصباغ GCI - أحدث المنتجات والتصاميم المبتكرة في عالم الأصباغ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await db.select().from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
  const exchangeRate = settings[0]?.exchangeRate || "1500";

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <CurrencyProvider initialExchangeRate={Number(exchangeRate)}>
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

