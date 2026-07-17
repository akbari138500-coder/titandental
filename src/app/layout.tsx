import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "کیس‌کلینیک - شبیه‌ساز بالینی دندانپزشکی",
  description:
    "سامانه ارزیابی هوشمند طرح درمان و پرونده‌های بالینی OSCE برای دانشجویان دندانپزشکی بالینی",
  keywords: "دندانپزشکی، OSCE، شبیه‌ساز بالینی، کیس‌کلینیک، طرح درمان",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Restore theme from localStorage before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        style={{ fontFamily: "'Vazirmatn', system-ui, sans-serif" }}
        className="bg-clinical-light dark:bg-clinical-dark text-clinical-navy dark:text-clinical-light antialiased"
      >
        {children}
      </body>
    </html>
  );
}
