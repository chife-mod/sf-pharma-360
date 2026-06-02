import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Inter_Tight,
  Montserrat,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

import { ServiceMenu } from "@/components/service-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["800"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SF Pharma 360 — Preview",
  description:
    "Internal preview of the SF Pharma 360 design iterations. Live production lives at pharma.market360.ai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${interTight.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <ServiceMenu />
      </body>
    </html>
  );
}
