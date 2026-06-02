import Link from "next/link";
import { IconBell, IconSearch } from "@tabler/icons-react";

const NAV = [
  { label: "Pharma Media", href: "#" },
  { label: "DOLs", href: "/dols", active: true },
  { label: "Reports", href: "#" },
];

/**
 * Pixel-perfect mirror of Figma node 365:5013 (Main Menu inside Pharma-360 365:5008).
 * Two floating glass pills, padding 16 around. Content adapted to product:
 * - Left pill: Pharma 360 logo (inline icon SVG + Montserrat ExtraBold wordmark) + product nav
 * - Right pill: search + bell + RE avatar
 *
 * Wordmark rendered as TEXT (not SVG paths) so it scales 1:1 with Figma's
 * Montserrat ExtraBold 13.652px / +0.13em tracking spec.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 p-4">
      <div className="flex items-center justify-between gap-6">
        {/* LEFT PILL — logo + product nav */}
        <div className="flex items-center gap-6 rounded-[12px] border border-white/10 bg-[#05071b] py-3 pl-6 pr-3 backdrop-blur-[15px]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="SF Pharma 360"
          >
            <PharmaMark />
            <span
              className="font-display flex flex-col font-extrabold leading-none"
              style={{
                fontSize: "13.652px",
                letterSpacing: "0.13em",
              }}
            >
              <span className="text-white">PHARMA</span>
              <span className="text-[#979797]">360</span>
            </span>
          </Link>
          <nav className="flex items-center">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[8px] px-[18px] text-[14px] font-normal leading-none text-white transition-colors hover:bg-white/5"
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
                {item.active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#46CAFF]"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT PILL — search + bell + avatar */}
        <div className="flex items-center gap-2 rounded-[12px] border border-white/10 bg-[#05071b] p-3 backdrop-blur-[15px]">
          <button
            type="button"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-[8px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
          >
            <IconSearch size={18} stroke={1.6} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-[8px] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
          >
            <IconBell size={18} stroke={1.6} />
          </button>
          <div
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[12px] font-semibold tracking-[0.04em] text-white"
            aria-label="User avatar"
          >
            RE
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Pharma 360 mark — 8 overlapping circles, viewBox 40×40.
 * Paths extracted from public/pharma-360-logo.svg (icon portion only —
 * wordmark is rendered separately as Montserrat ExtraBold text).
 */
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
