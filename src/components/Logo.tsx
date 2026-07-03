export default function Logo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Unity Motorsports Performance logo"
    >
      <defs>
        <linearGradient id="lg-flame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6a00" />
          <stop offset="55%" stopColor="#e10600" />
          <stop offset="100%" stopColor="#7a0400" />
        </linearGradient>
        <radialGradient id="lg-badge" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#1b1b1f" />
          <stop offset="100%" stopColor="#060607" />
        </radialGradient>
        <pattern id="lg-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill="#0a0a0a" />
          <line x1="0" y1="0" x2="0" y2="4" stroke="#3a3a42" strokeWidth="1.4" />
        </pattern>
      </defs>

      {/* badge */}
      <circle cx="100" cy="100" r="97" fill="url(#lg-badge)" />
      <circle cx="100" cy="100" r="97" fill="none" stroke="#e10600" strokeWidth="3" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#3a3a42" strokeWidth="1.5" />

      {/* flames sweeping from turbo */}
      <path
        d="M100 62 C 130 50, 158 58, 168 78 C 150 72, 140 76, 132 84 C 148 84, 158 92, 162 102 C 148 96, 138 98, 130 104 C 118 92, 106 80, 100 62 Z"
        fill="url(#lg-flame)"
        opacity="0.95"
      />
      <path
        d="M100 62 C 70 50, 42 58, 32 78 C 50 72, 60 76, 68 84 C 52 84, 42 92, 38 102 C 52 96, 62 98, 70 104 C 82 92, 94 80, 100 62 Z"
        fill="url(#lg-flame)"
        opacity="0.75"
      />

      {/* turbocharger */}
      <g>
        <circle cx="100" cy="62" r="21" fill="#101013" stroke="#8a8a94" strokeWidth="2.5" />
        <circle cx="100" cy="62" r="14" fill="#060607" stroke="#55555f" strokeWidth="1.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path
            key={a}
            d="M100 62 L100 50.5 A 11.5 11.5 0 0 1 108 54.5 Z"
            fill="#b9b9c4"
            transform={`rotate(${a} 100 62)`}
          />
        ))}
        <circle cx="100" cy="62" r="3.5" fill="#e10600" />
      </g>

      {/* UNITY — hatched shadow then white face */}
      <text
        x="103" y="126"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="900"
        fontSize="40"
        letterSpacing="2"
        fill="url(#lg-hatch)"
      >
        UNITY
      </text>
      <text
        x="100" y="123"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="900"
        fontSize="40"
        letterSpacing="2"
        fill="#ffffff"
      >
        UNITY
      </text>

      {/* red MOTORSPORTS band */}
      <path d="M22 134 L178 134 L172 152 L28 152 Z" fill="#e10600" />
      <text
        x="100" y="147.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="14.5"
        letterSpacing="3"
        fill="#ffffff"
      >
        MOTORSPORTS
      </text>

      <text
        x="100" y="170"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fontStyle="italic"
        fontSize="11"
        letterSpacing="4"
        fill="#ffffff"
        opacity="0.92"
      >
        PERFORMANCE
      </text>
    </svg>
  );
}
