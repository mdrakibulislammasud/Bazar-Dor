import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import AppToaster from "@/components/Toaster";
import { getCategories, getProductFeed } from "@/lib/api";
import { getLang } from "@/lib/lang";
import { LangProvider } from "@/components/LangProvider";

export const metadata: Metadata = {
  title: { default: "বাজার দর | BazarDor — প্রয়োজনীয় পণ্যের দাম এক নজরে", template: "%s | BazarDor" },
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের বাজার দর, দামের ওঠানামা এবং বাজারভিত্তিক তুলনা এক জায়গায়।",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛒</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05893e",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, feed, lang] = await Promise.all([getCategories(), getProductFeed(), getLang()]);

  return (
    <html lang={lang} data-theme="bazardor">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <LangProvider lang={lang}>
          <Navbar categories={categories} />
          <Ticker products={feed.products} />
          {feed.isSample && (
            <p role="status" className="border-b border-warning/40 bg-warning/10 px-4 py-3 text-center text-sm">
              {lang === "bn"
                ? "লাইভ API অনুপলব্ধ। এখানে দেখানো পণ্যের দাম ও বাজারের তথ্য শুধু নমুনা, যাচাইকৃত বর্তমান বাজারদর নয়।"
                : "Live price APIs are unavailable. Shown product prices and market rows are illustrative, not verified current rates."}
            </p>
          )}
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
          <Footer />
          <AppToaster />
        </LangProvider>
      </body>
    </html>
  );
}
