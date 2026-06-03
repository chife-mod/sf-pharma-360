/* v2 icons — re-exported from @tabler/icons-react so the same Icons /
 * Social / channelMeta API the components depend on is now backed by a
 * single icon library. CSS rules elsewhere set width/height on `svg`
 * (Tabler defaults to 24×24 stroke 2 but the surrounding class selectors
 * override).
 */
import type { ComponentType, SVGProps } from "react";
import {
  IconActivityHeartbeat,
  IconAdjustmentsHorizontal,
  IconArrowDownRight,
  IconArrowUp,
  IconBell,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandThreads,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconCheck,
  IconChevronDown,
  IconDotsVertical,
  IconFileText,
  IconMessage,
  IconSearch,
  IconSearchOff,
  IconSortAscendingNumbers,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
  IconTrendingUp,
  IconUsers,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";

import type { Channel } from "@/data/dols";

type TablerIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  stroke?: number | string;
};
type Glyph = ComponentType<TablerIconProps>;

export const Icons = {
  chevron: IconChevronDown,
  search: IconSearch,
  sliders: IconAdjustmentsHorizontal,
  close: IconX,
  check: IconCheck,
  dots: IconDotsVertical,
  sort: IconSortAscendingNumbers,
  bell: IconBell,
  arrowUp: IconArrowUp,
  arrowDownRight: IconArrowDownRight,
  trendUp: IconTrendingUp,
  users: IconUsersGroup,
  doc: IconFileText,
  comment: IconMessage,
  commenters: IconUsers,
  pulse: IconActivityHeartbeat,
  emptyGlass: IconSearchOff,
  star: IconStar,
  starHalf: IconStarHalfFilled,
  starFull: IconStarFilled,
} satisfies Record<string, Glyph>;

/* Tier → star fill, graduated by audience size.
 * empty = smallest tier · half = mid · full = largest. */
export const tierStar = {
  empty: IconStar,
  half: IconStarHalfFilled,
  full: IconStarFilled,
} satisfies Record<string, Glyph>;

/* ---- social glyphs (Tabler brand icons — monochrome via currentColor) ---- */

export const Social: Record<Channel, Glyph> = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  x: IconBrandX,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  threads: IconBrandThreads,
};

export const channelMeta: Record<Channel, { name: string; color: string; icon: Glyph }> = {
  facebook:  { name: "Facebook",  color: "#3B82F6", icon: Social.facebook },
  instagram: { name: "Instagram", color: "#E1306C", icon: Social.instagram },
  x:         { name: "X",         color: "#E7EAF0", icon: Social.x },
  linkedin:  { name: "LinkedIn",  color: "#3B9AE0", icon: Social.linkedin },
  youtube:   { name: "YouTube",   color: "#FF5A5A", icon: Social.youtube },
  tiktok:    { name: "TikTok",    color: "#22D3EE", icon: Social.tiktok },
  threads:   { name: "Threads",   color: "#CBD2E0", icon: Social.threads },
};
