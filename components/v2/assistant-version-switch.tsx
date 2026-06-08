"use client";

/* Shared version switch for the AI Copilot drawer.
 * Bottom segmented control `Copilot v1 · Copilot v2` — lets us show both
 * iterations live (v1 = pipeline + history-left + Explore; v2 = Vsevolod's
 * restored scope panel left + history-right). Rendered by BOTH drawers so the
 * control sits in the same spot whichever version is active. */

import "./assistant-version-switch.css";

export type CopilotVersion = 1 | 2;

/** Props every versioned drawer receives from the host. */
export type DrawerVersionProps = {
  open: boolean;
  onClose: () => void;
  version: CopilotVersion;
  onVersion: (v: CopilotVersion) => void;
};

export function VersionSwitch({ version, onVersion }: { version: CopilotVersion; onVersion: (v: CopilotVersion) => void }) {
  return (
    <div className="asd-vsw">
      <span className="asd-vsw-eyebrow">Prototype iteration</span>
      <div className="asd-vsw-seg" role="tablist" aria-label="Copilot version">
        <span className="asd-vsw-ind" data-v={version} aria-hidden />
        <button
          type="button"
          role="tab"
          aria-selected={version === 1}
          className={"asd-vsw-btn" + (version === 1 ? " is-active" : "")}
          onClick={() => onVersion(1)}
        >
          Copilot v1
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={version === 2}
          className={"asd-vsw-btn" + (version === 2 ? " is-active" : "")}
          onClick={() => onVersion(2)}
        >
          Copilot v2
        </button>
      </div>
    </div>
  );
}
