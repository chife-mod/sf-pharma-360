import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function DolsPage() {
  return (
    <main className="bg-aurora min-h-screen px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-4" />
          Back to home
        </Link>
        <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-6xl">
          DOLs <span className="text-accent-cyan">·</span> coming next
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          The redesigned DOL grid lives here. Sidebar filters → top bar,
          card grid with animated KPI strip, hover-to-expand interactions.
          See <code className="rounded bg-card/70 px-1.5 py-0.5 text-sm">CLAUDE.md</code> in the repo root for the plan.
        </p>
      </div>
    </main>
  );
}
