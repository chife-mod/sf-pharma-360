"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  IconBell,
  IconChevronDown,
  IconLogout,
  IconMenu2,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

const NAV = [
  { label: "Pharma Media", href: "#" },
  { label: "DOLs", href: "/dols" },
  { label: "Reports", href: "#" },
];

/* Raw <img src> is NOT basePath-aware in Next (only next/image and
 * next/link are). On GH Pages the app lives under /sf-pharma-360, so
 * public assets must be prefixed manually. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const USER_PHOTO =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face&auto=format&q=85";

/**
 * SiteHeader — two glass pills with a 3-step responsive collapse
 * ("Progressive Pill", per the top-nav UX research):
 *  - ≤1100: shed the 3 utility icons (search stays) + divider + role
 *    text; Notifications/Settings move into the avatar account menu.
 *  - ≤900: inline nav folds into a hamburger menu next to the logo.
 *  - ≤600: wordmark → mark-only logo; user name hidden.
 * Logo, search, avatar + a menu trigger never collapse.
 */
export function SiteHeaderV2() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const acctRef = useRef<HTMLDivElement>(null);

  /* Auto-hide on scroll-down, reveal on the slightest scroll-up
   * ("headroom" pattern). Always shown near the top. Reads scrollY
   * straight off the passive event — React bails out of re-renders
   * when `hidden` is unchanged, so this stays cheap without an rAF. */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 80) setHidden(false);
      else if (delta > 6) {
        setHidden(true);
        setNavOpen(false);
        setAcctOpen(false);
      } else if (delta < -6) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Share the menu's shown/hidden state with sub-page sticky bars (DOL detail
   * "прилипала") via a CSS var: when the menu is gone it pins to the very top
   * (16px); when the menu slides back in, the bar slides down under it. */
  useEffect(() => {
    document.documentElement.style.setProperty("--dd-stick-top", hidden ? "16px" : "88px");
    return () => {
      document.documentElement.style.removeProperty("--dd-stick-top");
    };
  }, [hidden]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setNavOpen(false);
      if (acctRef.current && !acctRef.current.contains(e.target as Node))
        setAcctOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNavOpen(false);
        setAcctOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // base WITHOUT a display utility, so `hidden` / responsive `inline-flex`
  // toggles aren't fighting a hard-coded `inline-flex`.
  const iconBtn =
    "size-10 items-center justify-center rounded-[8px] text-[#949EB8] transition-colors hover:bg-white/[0.08] hover:text-white";

  return (
    <header
      className="sticky top-0 z-30 py-4"
      style={{
        // Drive the slide via the `transform` property explicitly:
        //  - Tailwind v4's `translate-y-*` writes the `translate` property,
        //    which `transition-transform` would NOT animate.
        //  - `will-change: transform` silently breaks `position: sticky` in
        //    Chrome, so it's deliberately omitted.
        //  - a plain translateY(0) does NOT break sticky (verified).
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.3s ease-out",
      }}
    >
      <div className="mx-auto flex max-w-[1650px] items-center justify-between gap-6 px-6">
        {/* LEFT PILL — logo + product nav (folds into a hamburger ≤900) */}
        <div
          ref={navRef}
          className="relative flex items-center gap-4 rounded-[12px] border border-white/10 bg-[#05071b] py-3 pl-6 pr-3 backdrop-blur-[15px] max-[900px]:pr-2"
        >
          <Link
            href="/dols"
            className="flex shrink-0 items-center"
            aria-label="SF Pharma 360"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/pharma-360-logo.svg`}
              alt="Pharma 360"
              width={116}
              height={32}
              className="block h-8 w-auto max-[600px]:hidden"
            />
            {/* mark-only, shown ≤600 (wordmark dropped) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/pharma-360-mark.svg`}
              alt="Pharma 360"
              width={32}
              height={32}
              className="hidden h-8 w-8 max-[600px]:block"
            />
          </Link>

          {/* inline nav — hidden ≤900 */}
          <nav className="flex items-center max-[900px]:hidden">
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

          {/* hamburger — shown ≤900 */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
            className={
              "hidden max-[900px]:inline-flex " +
              iconBtn +
              (navOpen ? " bg-white/[0.08] text-white" : "")
            }
          >
            <IconMenu2 size={20} stroke={1.6} />
          </button>

          {navOpen && (
            <div className="hdr-menu" style={{ left: 12 }}>
              {NAV.map((item) => {
                const active =
                  item.href !== "#" && pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={"hdr-menu-item" + (active ? " is-active" : "")}
                    onClick={() => setNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT PILL — utilities + name + avatar (sheds ≤1100) */}
        <div
          ref={acctRef}
          className="relative flex items-center rounded-[12px] border border-white/10 bg-[#05071b] py-3 pl-3 pr-3 backdrop-blur-[15px]"
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              className={"inline-flex " + iconBtn}
            >
              <IconSearch size={20} stroke={1.6} />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className={"relative inline-flex max-[1100px]:hidden " + iconBtn}
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
              className={"inline-flex max-[1100px]:hidden " + iconBtn}
            >
              <IconSettings size={20} stroke={1.6} />
            </button>
          </div>

          <span
            aria-hidden
            className="ml-3 h-10 w-px bg-white/[0.28] max-[1100px]:hidden"
          />

          {/* account trigger — the WHOLE name + avatar + chevron zone opens
           * the menu (chevron makes it read as a dropdown). Search stays
           * separate, pushed away by the left margin. */}
          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={acctOpen}
            onClick={() => setAcctOpen((o) => !o)}
            className={
              "ml-4 flex shrink-0 items-center gap-3 rounded-[10px] py-1 pl-3 pr-2 transition-colors hover:bg-white/[0.06] max-[1100px]:ml-5 max-[600px]:gap-2 max-[600px]:pl-1 " +
              (acctOpen ? "bg-white/[0.06]" : "")
            }
          >
            <div className="flex flex-col gap-1 text-right max-[600px]:hidden">
              <span className="whitespace-nowrap text-[14px] font-semibold leading-none text-white">
                Rana El-Khoury
              </span>
              <span className="whitespace-nowrap text-[11px] font-medium uppercase leading-none tracking-[0.08em] text-white/55 max-[1100px]:hidden">
                Strategy Lead
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={USER_PHOTO}
              alt="Rana El-Khoury"
              width={40}
              height={40}
              className="block size-10 shrink-0 rounded-full object-cover"
              style={{ border: "1px solid rgba(160, 180, 220, 0.18)" }}
            />
            <IconChevronDown
              size={16}
              stroke={1.8}
              className={
                "shrink-0 text-[#949EB8] transition-transform " +
                (acctOpen ? "rotate-180" : "")
              }
            />
          </button>

          {acctOpen && (
            <div className="hdr-menu hdr-menu-right">
              <div className="hdr-menu-head">
                <span className="hdr-menu-name">Rana El-Khoury</span>
                <span className="hdr-menu-role">Strategy Lead</span>
              </div>
              <button type="button" className="hdr-menu-item hdr-menu-item--icon">
                <IconBell size={18} stroke={1.6} />
                Notifications
                <span className="hdr-menu-dot" />
              </button>
              <button type="button" className="hdr-menu-item hdr-menu-item--icon">
                <IconSettings size={18} stroke={1.6} />
                Settings
              </button>
              <div className="hdr-menu-sep" />
              <button type="button" className="hdr-menu-item hdr-menu-item--icon">
                <IconLogout size={18} stroke={1.6} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
