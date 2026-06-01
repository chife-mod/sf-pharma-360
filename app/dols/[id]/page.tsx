import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconCalendar, IconDots, IconExternalLink } from "@tabler/icons-react";

import { BarList } from "@/components/bar-list";
import { Chip } from "@/components/chip";
import { EmptyLine } from "@/components/empty-line";
import { KpiStrip } from "@/components/kpi-strip";
import { Section } from "@/components/section";
import { SiteHeader } from "@/components/site-header";
import { SocialIcon } from "@/components/social-icon";
import { DOLS, fmtN, fmtPct, findDol } from "@/data/dols";

export function generateStaticParams() {
  return DOLS.map((d) => ({ id: d.slug }));
}

export default async function DolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dol = findDol(id);
  if (!dol) notFound();

  const { detail } = dol;
  const initials = dol.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const isEmpty = detail.agg.followers === 0 && detail.brands.length === 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-8">
        <Link
          href="/dols"
          className="inline-flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-primary"
        >
          <IconArrowLeft size={14} stroke={1.6} />
          Back to DOLs
        </Link>

        {/* Hero */}
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-5">
              <div className="grid size-20 shrink-0 place-items-center rounded-full border border-border bg-surface text-[18px] font-semibold text-text-primary">
                {initials}
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <Chip tone="cat-1">{dol.tier}</Chip>
                  <Chip tone="cat-2">{dol.kind}</Chip>
                  <Chip tone="cat-3">{dol.audienceType}</Chip>
                  <Chip>Group {dol.group}</Chip>
                  <Chip>{dol.gender}</Chip>
                  <Chip>{dol.city}, {dol.country}</Chip>
                </div>
                <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary">
                  {dol.name}
                </h1>
                {dol.bio ? (
                  <p className="max-w-[560px] text-[14px] leading-relaxed text-text-muted">
                    {dol.bio}
                  </p>
                ) : (
                  <EmptyLine>No biography on file</EmptyLine>
                )}
              </div>
            </div>
          </div>

          {/* Audience by channel */}
          <aside className="rounded-lg border border-border bg-surface p-5">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-faint">
              Audience &amp; engagement
            </h3>
            <ul className="mt-3 flex flex-col">
              {detail.audience.map((row) => (
                <li
                  key={row.channel}
                  className="grid grid-cols-[16px_1fr_auto_auto] items-center gap-3 border-b border-border py-2 last:border-b-0"
                >
                  <SocialIcon channel={row.channel} size={14} />
                  <span className="text-[13px] capitalize text-text-primary">{row.channel}</span>
                  <span className="tabular text-[13px] text-text-muted">{fmtN(row.followers)}</span>
                  <span className="tabular text-[12px] text-text-faint">{fmtPct(row.engagementRate)}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Channel + date selector */}
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-faint">Channel</span>
            <div className="flex flex-wrap items-center gap-3">
              {dol.channels.map((c) => (
                <button
                  key={c}
                  className={
                    "flex items-center gap-2 rounded px-2 py-1 text-[12px] capitalize " +
                    (c === dol.primary
                      ? "bg-surface-elevated text-text-primary"
                      : "text-text-muted hover:text-text-primary")
                  }
                >
                  <SocialIcon channel={c} active={c === dol.primary} size={14} />
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-[12px] text-text-muted">
              <IconCalendar size={12} stroke={1.6} />
              <span className="tabular">
                {detail.period.from} → {detail.period.to}
              </span>
            </span>
            <button className="grid size-7 place-items-center rounded text-text-muted hover:bg-surface-elevated hover:text-text-primary">
              <IconDots size={14} stroke={1.6} />
            </button>
          </div>
        </section>

        <KpiStrip agg={detail.agg} period={detail.period} />

        {/* Empty fallback for fully-empty profiles */}
        {isEmpty && (
          <section className="rounded-lg border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-[14px] text-text-muted">
              No social signal collected for {dol.name} during this period.
            </p>
            <p className="mt-1 text-[12px] text-text-faint">
              The profile is registered, but no posts, comments, or mentions
              have been captured by the crawler yet.
            </p>
          </section>
        )}

        {/* Brands / Diseases / Medicaments */}
        {!isEmpty && (
          <section className="grid gap-4 md:grid-cols-3">
            <Section title="Brands" hint={`${detail.brands.length} total`}>
              <div className="rounded-lg border border-border bg-surface p-5">
                {detail.brands.length > 0 ? (
                  <BarList
                    data={detail.brands.map((b) => ({ label: b.name, value: b.mentions }))}
                    tone="cat-4"
                    limit={6}
                  />
                ) : (
                  <EmptyLine>No brand mentions in this period</EmptyLine>
                )}
              </div>
            </Section>

            <Section title="Diseases" hint={`${detail.diseases.length} tracked`}>
              <div className="rounded-lg border border-border bg-surface p-5">
                {detail.diseases.length > 0 ? (
                  <BarList
                    data={detail.diseases.map((d) => ({ label: d.name, value: d.posts }))}
                    tone="cat-2"
                    limit={6}
                  />
                ) : (
                  <EmptyLine>No disease topics surfaced</EmptyLine>
                )}
              </div>
            </Section>

            <Section title="Medicaments" hint={`${detail.medicaments.length} mentioned`}>
              <div className="rounded-lg border border-border bg-surface p-5">
                {detail.medicaments.length > 0 ? (
                  <BarList
                    data={detail.medicaments.map((m) => ({ label: m.name, value: m.posts }))}
                    tone="cat-3"
                    limit={6}
                  />
                ) : (
                  <EmptyLine>No medications mentioned</EmptyLine>
                )}
              </div>
            </Section>
          </section>
        )}

        {/* Hashtags + Key Topics */}
        {!isEmpty && (detail.hashtags.length > 0 || detail.keyTopics.length > 0) && (
          <section className="grid gap-4 md:grid-cols-2">
            <Section title="Top hashtags">
              <div className="rounded-lg border border-border bg-surface p-5">
                {detail.hashtags.length > 0 ? (
                  <BarList
                    data={detail.hashtags.map((h) => ({ label: h.tag, value: h.count }))}
                    tone="cat-1"
                    limit={10}
                  />
                ) : (
                  <EmptyLine>No hashtag use detected</EmptyLine>
                )}
              </div>
            </Section>

            <Section title="Posts: key topics">
              <div className="rounded-lg border border-border bg-surface p-5">
                {detail.keyTopics.length > 0 ? (
                  <BarList
                    data={detail.keyTopics.map((t) => ({ label: t.topic, value: t.count }))}
                    tone="cat-2"
                    limit={10}
                  />
                ) : (
                  <EmptyLine>Not enough posts to surface topics</EmptyLine>
                )}
              </div>
            </Section>
          </section>
        )}

        {/* Per-post averages */}
        {!isEmpty && (
          <Section title="Per-post averages" hint={`vs top topic — ${detail.perPost.avgViews.topic}`}>
            <div className="grid gap-4 md:grid-cols-3">
              {(
                [
                  { k: "avgViews", label: "Avg. views" },
                  { k: "avgLikes", label: "Avg. likes" },
                  { k: "avgComments", label: "Avg. comments" },
                ] as const
              ).map(({ k, label }) => {
                const item = detail.perPost[k];
                return (
                  <div key={k} className="rounded-lg border border-border bg-surface p-5">
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-faint">
                      {label}
                    </span>
                    <div className="mt-3 flex items-baseline gap-3">
                      <span className="tabular text-[28px] font-semibold leading-none text-text-primary">
                        {fmtN(item.perPost)}
                      </span>
                      <span className="text-[12px] text-text-muted">Per post</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="tabular text-[16px] font-medium leading-none text-text-muted">
                        {fmtN(item.perTopic)}
                      </span>
                      <span
                        className={
                          "tabular rounded px-1.5 py-0.5 text-[11px] " +
                          (item.deltaPct >= 0
                            ? "bg-cat-2/15 text-cat-2"
                            : "bg-cat-4/15 text-cat-4")
                        }
                      >
                        {item.deltaPct >= 0 ? "+" : ""}{item.deltaPct}%
                      </span>
                      <span className="text-[12px] text-text-faint">on {item.topic}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Bottom row: commenters + insights */}
        {!isEmpty && detail.topCommenters.length > 0 && (
          <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Section title="Top commenters" hint={`${detail.topCommenters.length} surfaced`}>
              <div className="rounded-lg border border-border bg-surface p-5">
                <ul className="flex flex-wrap gap-2">
                  {detail.topCommenters.map((c) => (
                    <li
                      key={c.handle}
                      className="inline-flex items-center gap-2 rounded border border-border px-2 py-1 text-[12px]"
                    >
                      <span className="grid size-5 place-items-center rounded-full bg-surface-elevated text-[10px] font-semibold uppercase text-text-primary">
                        {c.handle.slice(0, 2)}
                      </span>
                      <span className="text-text-primary">{c.handle}</span>
                      <span className="tabular text-text-faint">×{c.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <Section title="Comment insights">
                <div className="rounded-lg border border-border bg-surface p-5">
                  {detail.commentInsights.length > 0 ? (
                    <BarList
                      data={detail.commentInsights.map((c) => ({ label: c.label, value: c.count }))}
                      tone="cat-1"
                      limit={6}
                    />
                  ) : (
                    <EmptyLine>No comment thread categorised</EmptyLine>
                  )}
                </div>
              </Section>
              <Section title="Commenter interests">
                <div className="rounded-lg border border-border bg-surface p-5">
                  {detail.commenterInterests.length > 0 ? (
                    <BarList
                      data={detail.commenterInterests.map((c) => ({ label: c.label, value: c.count }))}
                      tone="cat-4"
                      limit={6}
                    />
                  ) : (
                    <EmptyLine>Not enough audience signal</EmptyLine>
                  )}
                </div>
              </Section>
            </div>
          </section>
        )}

        {/* CTAs */}
        <section className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-5">
          <button className="inline-flex h-9 items-center gap-2 rounded border border-border px-3 text-[13px] text-text-muted hover:border-border-strong hover:text-text-primary">
            <IconExternalLink size={14} stroke={1.6} />
            Open source
          </button>
          <button className="inline-flex h-9 items-center rounded border border-border-strong px-3 text-[13px] font-medium text-text-primary hover:bg-surface-elevated">
            Create dashboard
          </button>
          <button className="inline-flex h-9 items-center rounded bg-primary px-3 text-[13px] font-medium text-primary-foreground hover:opacity-90">
            Create report
          </button>
        </section>
      </main>
    </>
  );
}
