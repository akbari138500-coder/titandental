import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "کیس‌کلینیک - شبیه‌ساز بالینی دندانپزشکی",
  description: "سامانه ارزیابی هوشمند طرح درمان و پرونده‌های بالینی OSCE برای دانشجویان دندانپزشکی بالینی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light antialiased">
        {children}
      </body>
    </html>
  );
}
