import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "@fontsource/vazirmatn/900.css";
import "@fontsource/lalezar/400.css";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/lib/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "هنربازار | بازارچه آنلاین هنر و صنایع‌دستی ایران — خرید مستقیم از هنرمند",
    template: "%s | هنربازار",
  },
  description:
    "خرید مستقیم آثار دست‌ساز اصیل ایرانی از هنرمندان سراسر کشور؛ سفال لالجین، گلیم کردستان، فیروزه‌کوبی نیشابور، سوزن‌دوزی بلوچ، خاتم اصفهان و هزاران اثر هنری با ضمانت اصالت و ارسال مطمئن.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#b4532a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-digi-bg font-sans text-digi-text antialiased">
        <ToastProvider>
          <CartProvider>
            <Header />
            <main className="min-h-[60vh] pb-20 md:pb-0">{children}</main>
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
