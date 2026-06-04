"use client";

import { usePathname } from "next/navigation";

import { AiAssistantConstellation } from "@/components/ai-assistant-constellation";

/**
 * The single AI-assistant FAB (constellation — orbit × sparkles) mounted
 * bottom-right on the dashboard from the root layout. Hidden on the showcase
 * routes (/sandbox shows every variant inline; /uikit shows it in the catalog).
 * (usePathname is basePath-stripped, so the check works locally and on Pages.)
 */
export function FloatingFabs() {
  const pathname = usePathname();
  if (pathname?.startsWith("/sandbox") || pathname?.startsWith("/uikit")) {
    return null;
  }
  return <AiAssistantConstellation />;
}
