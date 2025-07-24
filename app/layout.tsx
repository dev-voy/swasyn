import type { Metadata } from "next";

import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Swasyn - Hospital Appointment Booking App",
  description:
    "Swasyn is a hospital appointment booking app that simplifies the process of scheduling appointments with healthcare providers.",
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
