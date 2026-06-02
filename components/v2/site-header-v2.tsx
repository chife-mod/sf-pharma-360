"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Pharma Media", href: "#" },
  { label: "DOLs", href: "/concepts/v2/dols" },
  { label: "Reports", href: "#" },
];

/**
 * v2 SiteHeader — hybrid chrome.
 * - LEFT pill: v1-style — Pharma 360 multi-circle mark + Montserrat
 *   ExtraBold wordmark (PHARMA / 360 stacked) + Inter Regular nav with
 *   cyan dot under active item.
 * - RIGHT pill: v1-style glass chrome + v2 content from Figma 370:6560
 *   (search + bell-with-dot + settings + divider + Rana El-Khoury name
 *   block + RE avatar circle with teal/violet gradient).
 *
 * User direction (2026-06-02): "Так Эдер возьми как в варианте один,
 * только в правую часть вставь, что ты уже вставил."
 */
export function SiteHeaderV2() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 p-4">
      <div className="flex items-center justify-between gap-6">
        {/* LEFT PILL — Pharma 360 logo + product nav */}
        <div className="flex items-center gap-6 rounded-[12px] border border-white/10 bg-[#05071b] py-3 pl-6 pr-3 backdrop-blur-[15px]">
          <Link
            href="/concepts/v2/dols"
            className="flex shrink-0 items-center gap-2"
            aria-label="SF Pharma 360"
          >
            <PharmaMark />
            <span
              className="flex flex-col font-extrabold leading-none"
              style={{
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "13.652px",
                letterSpacing: "0.13em",
              }}
            >
              <span className="text-white">PHARMA</span>
              <span className="text-[#979797]">360</span>
            </span>
          </Link>
          <nav className="flex items-center">
            {NAV.map((item) => {
              const active =
                item.href !== "#" && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[8px] px-[18px] text-[14px] font-normal leading-none text-white transition-colors hover:bg-white/5"
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

        {/* RIGHT PILL — search + bell-dot + settings + name + avatar */}
        <div className="flex items-center gap-2 rounded-[12px] border border-white/10 bg-[#05071b] p-3 backdrop-blur-[15px]">
          <button
            type="button"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-[8px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
          >
            <SearchGlyph />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-[8px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
          >
            <BellGlyph />
            <span
              aria-hidden
              className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#F25CB0]"
              style={{
                boxShadow: "0 0 6px rgba(242, 92, 176, 0.6)",
                outline: "2px solid #05071b",
              }}
            />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="grid h-10 w-10 place-items-center rounded-[8px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
          >
            <SettingsGlyph />
          </button>

          <span aria-hidden className="mx-1 h-6 w-px bg-white/10" />

          <div className="flex flex-col pr-1 text-right leading-tight">
            <span
              className="whitespace-nowrap text-[12.5px] font-semibold text-white"
              style={{
                fontFamily:
                  "var(--font-inter), Inter, system-ui, sans-serif",
              }}
            >
              Rana El-Khoury
            </span>
            <span className="whitespace-nowrap text-[10.5px] font-medium uppercase tracking-[0.08em] text-white/45">
              Strategy Lead
            </span>
          </div>
          <div
            className="grid h-10 w-10 place-items-center rounded-full text-[12px] font-semibold tracking-[0.04em] text-white"
            style={{
              background:
                "linear-gradient(135deg, rgba(45,212,191,0.22), rgba(167,139,250,0.22)), #111A30",
              border: "1px solid rgba(160, 180, 220, 0.18)",
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
            aria-label="User avatar"
          >
            RE
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------- Pharma 360 mark (v1 inline SVG) ------------- */

function PharmaMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block shrink-0"
      aria-hidden
    >
      <path
        d="M14.8226 10.3494C6.63632 10.3494 -3.57835e-07 16.987 0 25.1748C3.57835e-07 33.3627 6.63632 40.0002 14.8226 40.0002C23.0089 40.0002 29.6453 33.3627 29.6453 25.1748C29.6453 16.987 23.0089 10.3494 14.8226 10.3494Z"
        fill="#DD45FF"
      />
      <path
        d="M5.74581 14.8257C5.74581 23.0135 12.3821 29.6511 20.5684 29.6511C28.7548 29.6511 35.3911 23.0135 35.3911 14.8257C35.3911 6.63781 28.7548 0.000242709 20.5684 0.000244141C12.3821 0.000245572 5.74581 6.63782 5.74581 14.8257Z"
        fill="#FFE627"
      />
      <path
        d="M14.8226 10.3494C23.0089 10.3494 29.6453 16.987 29.6453 25.1748C29.6453 25.6548 29.6217 26.1297 29.5771 26.5979C27.0802 28.5122 23.9575 29.6511 20.5684 29.6511C12.3821 29.6511 5.74581 23.0135 5.74581 14.8257C5.74581 14.3453 5.7693 13.8703 5.81395 13.4017C8.31079 11.4875 11.4337 10.3494 14.8226 10.3494Z"
        fill="#FF5E5E"
      />
      <path
        d="M25.1421 10.3494C33.3284 10.3494 39.9647 16.987 39.9647 25.1748C39.9647 33.3627 33.3284 40.0002 25.1421 40.0002C16.9558 40.0002 10.3194 33.3627 10.3194 25.1748C10.3194 16.987 16.9558 10.3494 25.1421 10.3494Z"
        fill="#939393"
      />
      <path
        d="M25.1421 10.3494C33.3284 10.3494 39.9647 16.987 39.9647 25.1748C39.9647 33.3627 33.3284 40.0002 25.1421 40.0002C16.9558 40.0002 10.3194 33.3627 10.3194 25.1748C10.3194 16.987 16.9558 10.3494 25.1421 10.3494Z"
        fill="#46FFE9"
      />
      <path
        d="M25.1421 10.3494C29.1162 10.3494 32.7249 11.914 35.3865 14.4605C35.3895 14.5819 35.3911 14.7036 35.3911 14.8257C35.3911 23.0135 28.7548 29.6511 20.5684 29.6511C16.5941 29.6511 12.9854 28.0864 10.3238 25.5396C10.3208 25.4185 10.3194 25.2967 10.3194 25.1748C10.3194 16.987 16.9558 10.3494 25.1421 10.3494Z"
        fill="#00B194"
      />
      <path
        d="M19.9825 11.2727C25.6249 13.3685 29.6453 18.8019 29.6453 25.1748C29.6452 31.5477 25.6248 36.9811 19.9825 39.0768C14.3401 36.9811 10.3195 31.5477 10.3194 25.1748C10.3194 18.8019 14.34 13.3684 19.9825 11.2727Z"
        fill="#5825FF"
      />
      <path
        d="M19.9825 11.2727C25.6249 13.3685 29.6453 18.8019 29.6453 25.1748C29.6453 25.6548 29.6217 26.1297 29.5771 26.5979C27.0802 28.5122 23.9575 29.6511 20.5684 29.6511C16.5941 29.6511 12.9854 28.0864 10.3238 25.5396C10.3208 25.4185 10.3194 25.2967 10.3194 25.1748C10.3194 18.8019 14.34 13.3684 19.9825 11.2727Z"
        fill="#050505"
      />
    </svg>
  );
}

/* ------------- glyphs (lucide stroke style, 24×24) ------------- */

function SearchGlyph() {
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function BellGlyph() {
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </svg>
  );
}

function SettingsGlyph() {
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005.1 15a1.65 1.65 0 00-1.51-1H3.5a2 2 0 110-4h.09A1.65 1.65 0 005.1 9a1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 117.54 4.29l.06.06A1.65 1.65 0 009.42 4.7c.6-.25 1-.84 1-1.51V3a2 2 0 114 0v.09c0 .67.4 1.26 1 1.51a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82c.25.6.84 1 1.51 1H21a2 2 0 110 4h-.09c-.67 0-1.26.4-1.51 1z" />
    </svg>
  );
}
