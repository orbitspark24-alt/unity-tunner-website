/** Looping animated RPM gauge used as hero background art. Pure SVG + CSS. */
export default function Tachometer({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 9 }, (_, i) => i); // 0..8 x1000 rpm
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden>
      <defs>
        <radialGradient id="tach-face" cx="50%" cy="85%" r="80%">
          <stop offset="0%" stopColor="#17171b" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </radialGradient>
      </defs>
      <path d="M40 240 A 160 160 0 0 1 360 240" fill="url(#tach-face)" stroke="#26262c" strokeWidth="2" />
      {/* redline arc 6-8k */}
      <path d="M 313 116 A 160 160 0 0 1 360 240" fill="none" stroke="#e10600" strokeWidth="10" opacity="0.85"
        strokeLinecap="round" transform="rotate(0 200 240)" />
      {ticks.map((t) => {
        const a = -180 + (t / 8) * 180;
        const rad = (a * Math.PI) / 180;
        const x1 = 200 + 150 * Math.cos(rad);
        const y1 = 240 + 150 * Math.sin(rad);
        const x2 = 200 + 130 * Math.cos(rad);
        const y2 = 240 + 130 * Math.sin(rad);
        const tx = 200 + 112 * Math.cos(rad);
        const ty = 240 + 112 * Math.sin(rad);
        return (
          <g key={t}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={t >= 6 ? "#e10600" : "#8f8f9a"} strokeWidth="3" />
            <text x={tx} y={ty + 4} textAnchor="middle" fontSize="16" fontWeight="700" fill={t >= 6 ? "#ff2a1f" : "#b9b9c4"} fontFamily="var(--font-display)">
              {t}
            </text>
          </g>
        );
      })}
      {/* needle — CSS keyframes rev it */}
      <g className="tach-needle" style={{ transformBox: "view-box", transformOrigin: "200px 240px" }}>
        <path d="M200 240 L 196 232 L 200 100 L 204 232 Z" fill="#e10600" />
      </g>
      <circle cx="200" cy="240" r="14" fill="#17171b" stroke="#e10600" strokeWidth="3" />
      <text x="200" y="205" textAnchor="middle" fontSize="12" letterSpacing="3" fill="#55555f" fontFamily="var(--font-display)">RPM ×1000</text>
    </svg>
  );
}
