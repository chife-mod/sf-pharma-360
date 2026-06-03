"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBell, IconSearch, IconSettings } from "@tabler/icons-react";

const NAV = [
  { label: "Pharma Media", href: "#" },
  { label: "DOLs", href: "/dols" },
  { label: "Reports", href: "#" },
];

/* Raw <img src> is NOT basePath-aware in Next (only next/image and
 * next/link are). On GH Pages the app lives under /sf-pharma-360, so
 * public assets must be prefixed manually. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* Source at 2x display (40px display × 2 = 80; bumped to 160 for 4× safety
 * on hi-DPI / future zoom). Unsplash auto-serves correct resolution. */
const USER_PHOTO =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face&auto=format&q=85";

/**
 * SiteHeader — two-pill chrome.
 * - LEFT pill: Pharma 360 logo (atomic SVG) + Inter nav with a cyan dot
 *   under the active item.
 * - RIGHT pill: glass chrome — search + bell-with-dot + settings +
 *   divider + Rana El-Khoury name block + avatar photo.
 */
export function SiteHeaderV2() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 py-4">
      <div className="mx-auto flex max-w-[1650px] items-center justify-between gap-6 px-6">
        {/* LEFT PILL — Pharma 360 logo + product nav */}
        <div className="flex items-center gap-6 rounded-[12px] border border-white/10 bg-[#05071b] py-3 pl-6 pr-3 backdrop-blur-[15px]">
          <Link
            href="/dols"
            className="flex shrink-0 items-center"
            aria-label="SF Pharma 360"
          >
            {/* Atomic logo SVG (mark + wordmark, fully vector). Replaces
             * the old inline mark + live-text wordmark — no font
             * dependency, pixel-locked.
             * eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/pharma-360-logo.svg`}
              alt="Pharma 360"
              width={116}
              height={32}
              className="block h-8 w-auto"
            />
          </Link>
          <nav className="flex items-center">
            {NAV.map((item) => {
              const active =
                item.href !== "#" && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    "relative inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[8px] px-[18px] text-[14px] font-normal leading-none transition-colors hover:bg-white/[0.08] hover:text-white " +
                    (active ? "text-white" : "text-[#949EB8]")
                  }
                  aria-current={active ? "page" : undefined}
                  style={{
                    fontFamily:
                      "var(--font-inter), Inter, system-ui, sans-serif",
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#46CAFF]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT PILL — Tabler icons (24×24 buttons) + dashline + name + photo
         * Spacing (8-px grid): pl-24 pr-12 py-12, icons gap 4, icons→dashline 24,
         * dashline→name 16, name→photo 16. */}
        <div className="flex items-center rounded-[12px] border border-white/10 bg-[#05071b] py-3 pl-3 pr-3 backdrop-blur-[15px]">
          {/* icons cluster — Tabler 16×16 centered in 32×32 button (8px ring) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              className="inline-flex size-10 items-center justify-center rounded-[8px] text-[#949EB8] transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <IconSearch size={20} stroke={1.6} />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex size-10 items-center justify-center rounded-[8px] text-[#949EB8] transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <IconBell size={20} stroke={1.6} />
              <span
                aria-hidden
                className="absolute right-[3px] top-[3px] size-1.5 rounded-full bg-[#F25CB0]"
                style={{
                  boxShadow: "0 0 4px rgba(242, 92, 176, 0.7)",
                  outline: "1.5px solid #05071b",
                }}
              />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="inline-flex size-10 items-center justify-center rounded-[8px] text-[#949EB8] transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <IconSettings size={20} stroke={1.6} />
            </button>
          </div>

          {/* 12 → dashline (h-40 = photo, half-contrast vs role) → 24 → name+role
           * Role lifted from white/45 (4.48 — marginal fail) → white/55 (6.2,
           * passes AA). Divider tracks at white/28 to keep ~2:1 vs role. */}
          <span aria-hidden className="ml-3 h-10 w-px bg-white/[0.28]" />
          <div className="ml-6 flex flex-col gap-1 text-right">
            <span
              className="whitespace-nowrap text-[14px] font-semibold leading-none text-white"
              style={{
                fontFamily:
                  "var(--font-inter), Inter, system-ui, sans-serif",
              }}
            >
              Rana El-Khoury
            </span>
            <span className="whitespace-nowrap text-[11px] font-medium uppercase leading-none tracking-[0.08em] text-white/55">
              Strategy Lead
            </span>
          </div>

          {/* 16 → photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={USER_PHOTO}
            alt="Rana El-Khoury"
            width={40}
            height={40}
            className="ml-4 size-10 shrink-0 rounded-full object-cover"
            style={{ border: "1px solid rgba(160, 180, 220, 0.18)" }}
          />
        </div>
      </div>
    </header>
  );
}

