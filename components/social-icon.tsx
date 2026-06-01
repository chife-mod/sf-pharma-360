import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandThreads,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";

import type { SocialChannel } from "@/data/dols";

const MAP = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  x: IconBrandX,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  threads: IconBrandThreads,
} as const;

export function SocialIcon({
  channel,
  active = false,
  size = 16,
}: {
  channel: SocialChannel;
  active?: boolean;
  size?: number;
}) {
  const Icon = MAP[channel];
  return (
    <Icon
      size={size}
      stroke={1.5}
      className={active ? "text-text-primary" : "text-text-muted"}
    />
  );
}
