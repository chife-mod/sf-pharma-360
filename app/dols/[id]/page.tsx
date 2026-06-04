import { notFound } from "next/navigation";

import { DOLS } from "@/data/dols";
import { DETAIL_BY_ID } from "@/data/dol-detail";
import { DolDetail } from "@/components/v2/dol-detail";
import "./detail.css";

/* static-export: pre-render a page per DOL id */
export function generateStaticParams() {
  return DOLS.map((d) => ({ id: d.id }));
}

export default async function DolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dol = DOLS.find((d) => d.id === id);
  if (!dol) notFound();
  return <DolDetail dol={dol} detail={DETAIL_BY_ID[id]} />;
}
