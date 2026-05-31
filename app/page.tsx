import Link from "next/link";
import {
  IconActivityHeartbeat,
  IconArrowUpRight,
  IconChartLine,
  IconPill,
  IconStethoscope,
  IconUsersGroup,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

const KPI = [
  { label: "DOLs tracked", value: "234", icon: IconUsersGroup, hint: "across 27 markets" },
  { label: "Therapeutic areas", value: "18", icon: IconStethoscope, hint: "diabetes, obesity, cardio…" },
  { label: "Medications", value: "62", icon: IconPill, hint: "GLP-1, semaglutide…" },
  { label: "Signal volume / mo", value: "1.2M", icon: IconActivityHeartbeat, hint: "posts + comments" },
];

const MODULES = [
  {
    title: "DOLs",
    blurb: "Find, segment and benchmark digital opinion leaders across pharma verticals.",
    href: "/dols",
    accent: "from-accent-cyan/30 to-transparent",
    icon: IconUsersGroup,
  },
  {
    title: "Disease signals",
    blurb: "What patients are talking about — by therapeutic area, region and channel.",
    href: "#",
    accent: "from-accent-magenta/30 to-transparent",
    icon: IconActivityHeartbeat,
  },
  {
    title: "Brand monitoring",
    blurb: "Mention share, sentiment shifts and competitive overlap for owned brands.",
    href: "#",
    accent: "from-accent-lime/25 to-transparent",
    icon: IconChartLine,
  },
];

export default function Home() {
  return (
    <main className="bg-aurora min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-accent-cyan via-accent-magenta to-accent-orange shadow-[0_0_24px_-4px_color-mix(in_oklch,var(--accent-magenta)_60%,transparent)]" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">
              PHARMA <span className="text-accent-cyan">360</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              by Market 360
            </div>
          </div>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground" href="#">Platform</a>
          <a className="hover:text-foreground" href="#">Use cases</a>
          <a className="hover:text-foreground" href="#">About</a>
          <a className="hover:text-foreground" href="#">Contacts</a>
        </nav>
        <Button variant="default" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
          Book a demo
          <IconArrowUpRight className="size-4" />
        </Button>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-12 pb-20 lg:px-10 lg:pt-20 lg:pb-32">
        <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px] shadow-accent-cyan" />
              Pharma vertical · prototype
            </span>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Market intelligence
              <br />
              for{" "}
              <span className="bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-orange bg-clip-text text-transparent">
                pharma
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Track digital opinion leaders, disease conversations and brand
              signal across social channels — in one place, built for pharma
              teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full" size="lg">
                <Link href="/dols">
                  Explore DOLs
                  <IconArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full bg-card/40 backdrop-blur">
                See the platform
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {KPI.map((k) => (
              <div
                key={k.label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-cyan/40 hover:shadow-[0_0_40px_-12px_color-mix(in_oklch,var(--accent-cyan)_70%,transparent)]"
              >
                <div className="flex items-center justify-between">
                  <k.icon className="size-5 text-accent-cyan" stroke={1.5} />
                  <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Live
                  </span>
                </div>
                <div className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
                  {k.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{k.label}</div>
                <div className="mt-3 text-xs text-muted-foreground/80">{k.hint}</div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-12 -right-12 size-32 rounded-full bg-accent-magenta/0 blur-2xl transition group-hover:bg-accent-magenta/30"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              What you can do
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Three modules, one signal layer
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {MODULES.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-7 backdrop-blur transition hover:-translate-y-0.5 hover:border-foreground/20"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${m.accent} opacity-60 transition group-hover:opacity-100`}
              />
              <div className="relative">
                <m.icon className="size-7 text-foreground/90" stroke={1.5} />
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{m.blurb}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground/90">
                  Open
                  <IconArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 bg-background/50 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 text-xs text-muted-foreground md:flex-row md:items-center lg:px-10">
          <span>© 2026 SemanticForce · Pharma 360 prototype</span>
          <span>
            Built on Market 360 ·{" "}
            <a className="hover:text-foreground" href="https://chife-mod.github.io/sfg-dashboard/">
              SF Group dashboard
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
