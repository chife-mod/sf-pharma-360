import {
  IconPill,
  IconStethoscope,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";
import type { ComponentType, SVGProps } from "react";

/**
 * KPI hero strip — pixel-perfect mirror of the Figma 365:5008 "Verticals row"
 * card pattern (3 cards in a row, dark navy surface, cyan label, large display
 * heading), with content swapped for the four DOL coverage KPIs.
 *
 * Per Figma node 370:9620 row + 365:6358 card:
 *  - card: bg #22253e, rounded 12px, padding 32px, flex-col gap 32px
 *  - head: flex-col gap 16px (icon+label inline → display heading)
 *  - icon: 24px, label color #46FFE9, Inter 14px
 *  - value: Inter SemiBold 29px, leading 1.05, white
 *  - sub : Inter 14px, leading 1.4, white at 80% opacity
 *  - row : flex gap 16px, w-full (cards use flex-1 / equal width)
 *
 * Container wraps to max-w-[1440px] (Figma hero width) at px-6 so it sits
 * wider than the 1280-bounded main content beneath it, matching the hero
 * proportions on the Figma frame.
 */

type TablerIcon = ComponentType<
  Omit<SVGProps<SVGSVGElement>, "stroke"> & { size?: number; stroke?: number }
>;

interface Kpi {
  Icon: TablerIcon;
  label: string;
  value: string;
  sub: string;
}

const KPIS: Kpi[] = [
  { Icon: IconUsersGroup, label: "Total DOLs", value: "234", sub: "tracked" },
  { Icon: IconWorld, label: "Markets", value: "27", sub: "active" },
  { Icon: IconStethoscope, label: "Therapeutic Areas", value: "18", sub: "mapped" },
  { Icon: IconPill, label: "Medications", value: "62", sub: "in scope" },
];

export function KpiHero() {
  return (
    <section
      aria-label="DOL coverage overview"
      className="mx-auto mt-4 mb-8 w-full max-w-[1650px] px-6"
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ Icon, label, value, sub }) => (
          <li
            key={label}
            className="flex flex-col gap-4 rounded-[12px] border border-white/10 bg-surface-elevated p-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                <Icon
                  size={24}
                  stroke={1.6}
                  className="block shrink-0 text-[#46CAFF]"
                  aria-hidden
                />
                <span className="text-[14px] leading-[1.4] text-[#46CAFF]">
                  {label}
                </span>
              </div>
              <p className="tabular text-[29px] font-semibold leading-[1.05] text-white">
                {value}
              </p>
            </div>
            <p className="text-[14px] leading-[1.4] text-white/80">{sub}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
