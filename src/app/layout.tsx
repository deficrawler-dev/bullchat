import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BullChat",
  description: "The professional home for Web3 communities.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable}`}>
      <body className="bg-red-500 text-white p-10">{children}</body>
    </html>
  );
}