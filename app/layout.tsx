import type { Metadata } from "next";

import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Swasyn - Hospital Appointment Booking App",
  description:
    "Swasyn is a hospital appointment booking app that simplifies the process of scheduling appointments with healthcare providers.",
  keywords: [
    "hospital appointment booking",
    "healthcare appointments",
    "doctor appointments",
    "medical appointments",
    "appointment scheduling",
    "healthcare management",
    "patient management",
    "healthcare technology",
    "healthcare app",
  ],
  authors: [{ name: "Ashutosh Gaurav", url: "ashutosh.devvoy.com" }],
  creator: "Ashutosh Gaurav",
  openGraph: {
    title: "Swasyn - Hospital Appointment Booking App",
    description:
      "Swasyn is a hospital appointment booking app that simplifies the process of scheduling appointments with healthcare providers.",
    url: "https://swasyn.tech",
    siteName: "Swasyn",
    images: [
      {
        url: "https://swasyn.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Swasyn - Hospital Appointment Booking App",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
  },
  alternates: {
    canonical: "https://swasyn.tech",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/atom+xml": "/atom.xml",
      "application/json": "/api/og",
    },
  },
};

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
export default RootLayout;
