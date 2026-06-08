"use client";

/* Host for the AI Copilot drawer. Owns `open` + which version is active, so the
 * single constellation FAB ("sf-open-assistant") opens whichever iteration is
 * selected, and the bottom segmented switch flips between them live (great for a
 * client meeting A/B).
 *   v1 = pipeline + history-left + Explore (kept intact — "оставь версию 1").
 *   v2 = Vsevolod's restored scope panel left + history-right.
 * Mounted once from app/layout.tsx, exported as AssistantDrawer so that import
 * stays unchanged. Only the active version is mounted; switching remounts (the
 * drawer re-slides), which also resets transient chat state — fine for a demo. */

import { useEffect, useState } from "react";

import { AssistantDrawerV1 } from "./assistant-drawer";
import { AssistantDrawerV2 } from "./assistant-drawer-v2";
import type { CopilotVersion } from "./assistant-version-switch";

const LS_KEY = "sf-pharma-360:copilot-version";

export function AssistantDrawer() {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState<CopilotVersion>(2); // v2 (his restored panel) shown first

  // restore last-used version on the client only — keep static/SSR markup
  // deterministic so there's no hydration mismatch.
  useEffect(() => {
    const v = typeof window !== "undefined" ? window.localStorage.getItem(LS_KEY) : null;
    if (v === "1" || v === "2") setVersion(Number(v) as CopilotVersion);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("sf-open-assistant", onOpen);
    return () => window.removeEventListener("sf-open-assistant", onOpen);
  }, []);

  const onClose = () => setOpen(false);
  const onVersion = (v: CopilotVersion) => {
    setVersion(v);
    try { window.localStorage.setItem(LS_KEY, String(v)); } catch { /* ignore */ }
  };

  const props = { open, onClose, version, onVersion };
  return version === 1 ? <AssistantDrawerV1 {...props} /> : <AssistantDrawerV2 {...props} />;
}
