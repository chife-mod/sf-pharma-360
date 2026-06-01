import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { SiteHeader } from "@/components/site-header";

const STATS = [
  { label: "DOLs tracked", value: "234" },
  { label: "Markets", value: "27" },
  { label: "Therapeutic areas", value: "18" },
  { label: "Medications", value: "62" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-12 lg:py-20">
        <section className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-faint">
              Market 360 · Pharma vertical
            </span>
            <h1 className="mt-4 text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary md:text-[56px]">
              Market intelligence
              <br />
              for pharma.
            </h1>
            <p className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-text-muted">
              Track digital opinion leaders, disease conversations and brand
              signal across social channels — in one quiet place, built for
              pharma teams.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dols"
                className="inline-flex h-10 items-center gap-2 rounded bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:opacity-90"
              >
                Explore DOLs
                <IconArrowRight size={15} stroke={1.7} />
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center rounded border border-border px-4 text-[13px] text-text-muted hover:border-border-strong hover:text-text-primary"
              >
                See the platform
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-2 bg-surface px-5 py-5">
                <dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-faint">
                  {s.label}
                </dt>
                <dd className="tabular text-[28px] font-semibold leading-none text-text-primary">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-border pt-10 text-[12px] text-text-faint">
          <p>
            Prototype for the upcoming demo. Not the live portal — see{" "}
            <Link href="https://pharma.market360.ai/" className="text-text-muted hover:text-text-primary">
              pharma.market360.ai
            </Link>
            {" "}for current production.
          </p>
        </section>
      </main>
    </>
  );
}
