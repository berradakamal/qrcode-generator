import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRCode Generator - Create Free QR Codes with Analytics",
  description: "Generate beautiful QR codes for free. Track scans, retention, and conversions. Create Websites, Menus, Stores, vCards, WiFi codes and more. Free up to 5k scans.",
  keywords: ["QR code generator", "free QR code", "QR code maker", "dynamic QR codes", "QR code analytics", "QR code tracking"],
  openGraph: {
    title: "QRCode Generator - Create Free QR Codes with Analytics",
    description: "Generate beautiful QR codes for free. Track scans, retention, and conversions. 21 QR types included.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRCode Generator - Create Free QR Codes with Analytics",
    description: "Generate beautiful QR codes for free. Track scans, retention, and conversions. 21 QR types included.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
