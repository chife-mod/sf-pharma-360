import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ServiceMenu } from "@/components/service-menu";
import { FloatingFabs } from "@/components/floating-fabs";
import { AssistantDrawer } from "@/components/v2/assistant-drawer";
import { AnimatedFavicon } from "@/components/animated-favicon";

/* Raw favicon URL must be basePath-aware (GH Pages serves under
 * /sf-pharma-360). A STATIC SVG icon reliably shows in every tab, local +
 * prod — the canvas-animated swap was clobbering it and Chrome throttles
 * favicon animation anyway, so the tab ended up blank. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* One typeface across the whole product: Inter. Hierarchy comes from
 * weight + size, not from font pairing. (Geist / Inter Tight /
 * Montserrat / Space Grotesk were all dropped 2026-06-03.) */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SF Pharma 360 — Preview",
  description:
    "Internal preview of the SF Pharma 360 design iterations. Live production lives at pharma.market360.ai.",
  icons: { icon: [{ url: `${BASE}/favicon.svg`, type: "image/svg+xml" }] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <AnimatedFavicon />
        <ServiceMenu />
        <FloatingFabs />
        <AssistantDrawer />
      </body>
    </html>
  );
}
