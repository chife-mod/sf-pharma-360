import Link from "next/link";
import { IconBell, IconSearch } from "@tabler/icons-react";

const NAV = [
  { label: "Pharma Media", href: "#" },
  { label: "DOLs", href: "/dols", active: true },
  { label: "Reports", href: "#" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-accent-foreground/60 via-primary/70 to-cat-1/60">
              <span className="size-2.5 rounded-full bg-background" />
            </span>
            <span className="text-[13px] font-semibold leading-none tracking-[0.02em]">
              MARKET<span className="text-text-muted">360</span>
              <span className="ml-1.5 rounded bg-surface-elevated px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                Pharma
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  "text-[13px] tracking-[0.01em] transition " +
                  (item.active
                    ? "text-text-primary"
                    : "text-text-muted hover:text-text-primary")
                }
              >
                {item.label}
                {item.active && (
                  <span className="ml-2 inline-block size-1 -translate-y-0.5 rounded-full bg-primary align-middle" />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Search"
            className="grid size-8 place-items-center rounded-md text-text-muted hover:bg-surface-elevated hover:text-text-primary"
          >
            <IconSearch size={16} stroke={1.6} />
          </button>
          <button
            aria-label="Notifications"
            className="grid size-8 place-items-center rounded-md text-text-muted hover:bg-surface-elevated hover:text-text-primary"
          >
            <IconBell size={16} stroke={1.6} />
          </button>
          <div className="ml-1 grid size-8 place-items-center rounded-full border border-border bg-surface text-[11px] font-semibold text-text-primary">
            RE
          </div>
        </div>
      </div>
    </header>
  );
}
