import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ServiceMenu } from "@/components/service-menu";
import { AiAssistant } from "@/components/ai-assistant";
import { AiAssistantDots } from "@/components/ai-assistant-dots";
import { AiAssistantSparkles } from "@/components/ai-assistant-sparkles";
import { AiAssistantTri } from "@/components/ai-assistant-tri";
import { AiAssistantRingsDots } from "@/components/ai-assistant-ringsdots";
import { AiAssistantOrbit } from "@/components/ai-assistant-orbit";

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
        <ServiceMenu />
        <AiAssistant />
        <AiAssistantDots />
        <AiAssistantSparkles />
        <AiAssistantTri />
        <AiAssistantRingsDots />
        <AiAssistantOrbit />
      </body>
    </html>
  );
}
