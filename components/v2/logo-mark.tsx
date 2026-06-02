/**
 * Market360 logo mark for v2 — three overlapping color discs (teal,
 * magenta, amber) blended with `screen`, with a dark dot punched in
 * the center. Verbatim port of LogoMark from the v2 source bundle
 * (project/app/icons.jsx).
 */
export function LogoMarkV2({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="v2-lg-teal" cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#5DEBD3" />
          <stop offset="1" stopColor="#13A89A" />
        </radialGradient>
        <radialGradient id="v2-lg-mag" cx="0.6" cy="0.4">
          <stop offset="0" stopColor="#F472B6" />
          <stop offset="1" stopColor="#A855E8" />
        </radialGradient>
        <radialGradient id="v2-lg-amber" cx="0.5" cy="0.4">
          <stop offset="0" stopColor="#FBD24B" />
          <stop offset="1" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      <g style={{ mixBlendMode: "screen" }}>
        <circle cx={18} cy={17} r={13} fill="url(#v2-lg-teal)" opacity={0.92} />
        <circle cx={30} cy={17} r={13} fill="url(#v2-lg-mag)" opacity={0.9} />
        <circle cx={24} cy={28} r={13} fill="url(#v2-lg-amber)" opacity={0.88} />
      </g>
      <circle cx={24} cy={21} r={5.5} fill="#080C18" />
    </svg>
  );
}
