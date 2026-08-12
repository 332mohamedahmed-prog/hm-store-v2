import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CartProvider from "@/components/CartProvider";
import GlobalBackground from "@/components/GlobalBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HM — أناقة المرأة",
    template: "%s — HM",
  },
  description:
    "متجر HM الإلكتروني المتخصص في الملابس الحريمي الفاخرة — عبايات، قمصان نوم، شنط، والمزيد",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Tajawal:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-near-black text-cream antialiased">
        <GlobalBackground />
        <CartProvider>
          <Header />
          <div className="min-h-screen">{children}</div>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
