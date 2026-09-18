import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "Future Calc — ZAR Investment Calculator",
  description:
    "Project the future value of monthly investments in South African Rand, with inflation, tax, dividend, and withdrawal modeling.",
  openGraph: {
    title: "Future Calc — ZAR Investment Calculator",
    description:
      "Project the future value of monthly investments in South African Rand.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow focus:ring-2 focus:ring-ring print:hidden"
        >
          Skip to main content
        </a>
        {children}
        <div className="print:hidden">
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
