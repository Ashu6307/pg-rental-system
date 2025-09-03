
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutContent from "@/components/LayoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | PG & Room Rental',
    default: 'PG & Room Rental - Best Accommodation & Room Services',
  },
  description: 'Find the best PG accommodations and room rental services. Verified properties, secure payments, and excellent customer support for students and professionals.',
  keywords: ['PG', 'paying guest', 'room rental', 'accommodation', 'rooms', 'student housing', 'flat', 'rental', 'hostel'],
  authors: [{ name: 'PG & Room Rental Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
