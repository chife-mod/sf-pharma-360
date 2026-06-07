/* Tiny SVG sparkline — area + line, no endpoint dot (removed 2026-06-07).
 * `gid` is derived from data so SSR + client agree (no Math.random
 * in the original would produce hydration mismatch).
 */
type Props = {
  data: number[];
  color: string;
  w?: number;
  h?: number;
  fill?: boolean;
  /** Stable id seed — keeps gradient id consistent across SSR/CSR. */
  seed: string;
};

export function Sparkline({ data, color, w = 100, h = 16, fill = true, seed }: Props) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / span) * (h - 2) - 1] as const);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  const gid = "sg-" + seed;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height: h, display: "block" }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0" stopColor={color} stopOpacity={0.32} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
