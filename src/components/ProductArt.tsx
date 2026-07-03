import type { Category } from "@/lib/products";
import { cx } from "@/lib/utils";

export interface ArtShape {
  slug: string;
  category: Category;
  hue: number;
  imageUrl?: string;
  name?: string;
}

/**
 * Product visual. If the product has a real `imageUrl` (set via the admin media
 * library) it's shown; otherwise a code-generated "studio shot" of a stylised
 * part per category, tinted by the product's hue. `variant` renders a second
 * angle for the hover image swap.
 */
export default function ProductArt({
  product,
  variant = 0,
  className = "",
}: {
  product: ArtShape;
  variant?: 0 | 1;
  className?: string;
}) {
  if (product.imageUrl) {
    return (
      <div className={cx("relative h-full w-full overflow-hidden bg-[#0c0c0e]", className)} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name ?? ""}
          className="h-full w-full object-cover"
          style={variant === 1 ? { transform: "scale(1.08)" } : undefined}
        />
      </div>
    );
  }
  const h = (product.hue + variant * 25) % 360;
  const id = `pa-${product.slug}-${variant}`;
  return (
    <div className={cx("relative h-full w-full overflow-hidden", className)} aria-hidden>
      <svg viewBox="0 0 400 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`${id}-bg`} cx="50%" cy="32%" r="80%">
            <stop offset="0%" stopColor={`hsl(${h} 30% 16%)`} />
            <stop offset="55%" stopColor="#131316" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </radialGradient>
          <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8e8ee" />
            <stop offset="45%" stopColor="#8f8f9a" />
            <stop offset="100%" stopColor="#3c3c44" />
          </linearGradient>
          <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${h} 90% 58%)`} />
            <stop offset="100%" stopColor={`hsl(${h} 90% 32%)`} />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill={`url(#${id}-bg)`} />
        <ellipse cx="200" cy="330" rx="150" ry="26" fill="black" opacity="0.5" />
        <g transform={variant === 1 ? "rotate(-8 200 210) scale(0.94) translate(14 16)" : ""}>
          <CategoryShape category={product.category} id={id} />
        </g>
        {/* studio light streak */}
        <rect x="-80" y="0" width="90" height="400" fill="white" opacity="0.05" transform="skewX(-18)" />
      </svg>
    </div>
  );
}

function CategoryShape({ category, id }: { category: Category; id: string }) {
  const metal = `url(#${id}-metal)`;
  const accent = `url(#${id}-accent)`;

  switch (category) {
    case "Air Filters":
      return (
        <g>
          <ellipse cx="200" cy="150" rx="95" ry="30" fill={metal} />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={112 + i * 13} y={150} width={7} height={130} fill={i % 2 ? "#c8c8d2" : "#77777f"} />
          ))}
          <ellipse cx="200" cy="282" rx="95" ry="30" fill={accent} />
          <ellipse cx="200" cy="150" rx="60" ry="18" fill="#1a1a1e" />
        </g>
      );
    case "Intakes":
      return (
        <g>
          <path d="M90 300 Q 90 190 170 165 T 310 120" stroke={metal} strokeWidth="44" fill="none" strokeLinecap="round" />
          <path d="M90 300 Q 90 190 170 165 T 310 120" stroke={accent} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
          <ellipse cx="313" cy="118" rx="34" ry="42" fill={accent} transform="rotate(28 313 118)" />
          <ellipse cx="90" cy="302" rx="26" ry="24" fill="#26262c" />
        </g>
      );
    case "Exhausts":
      return (
        <g>
          <rect x="70" y="180" width="200" height="70" rx="35" fill={metal} />
          <rect x="250" y="188" width="90" height="54" rx="27" fill="#55555f" />
          <circle cx="340" cy="215" r="34" fill="#1a1a1e" stroke={accent} strokeWidth="7" />
          <circle cx="340" cy="215" r="18" fill="#060607" />
          <path d="M70 215 H 30" stroke={metal} strokeWidth="26" strokeLinecap="round" />
        </g>
      );
    case "Turbochargers":
      return (
        <g>
          <circle cx="170" cy="210" r="88" fill={metal} />
          <circle cx="170" cy="210" r="58" fill="#111114" />
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M170 210 L170 158 A 52 52 0 0 1 202 172 Z`} fill="#c8c8d2" transform={`rotate(${i * 40} 170 210)`} />
          ))}
          <circle cx="170" cy="210" r="12" fill={accent} />
          <path d="M245 160 Q 300 130 330 170 Q 340 210 300 235 L 252 235" fill={accent} opacity="0.9" />
        </g>
      );
    case "Intercoolers":
      return (
        <g>
          <rect x="70" y="140" width="260" height="140" rx="12" fill={metal} />
          {Array.from({ length: 17 }).map((_, i) => (
            <rect key={i} x={80 + i * 14.5} y={150} width={7} height={120} fill="#33333b" />
          ))}
          <path d="M70 165 L 34 140 L 34 175 Z" fill={accent} />
          <path d="M330 255 L 366 280 L 366 245 Z" fill={accent} />
        </g>
      );
    case "ECU / Tuning Boxes":
      return (
        <g>
          <rect x="100" y="140" width="200" height="140" rx="14" fill={metal} />
          <rect x="118" y="158" width="164" height="104" rx="8" fill="#0c0c0e" />
          <path d="M130 232 L160 232 L172 196 L188 250 L200 214 L212 232 L270 232" stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={122 + i * 30} y={280} width={14} height={22} rx={3} fill="#55555f" />
          ))}
        </g>
      );
    case "Suspension":
      return (
        <g transform="rotate(12 200 210)">
          <rect x="186" y="90" width="28" height="70" rx="6" fill="#55555f" />
          <rect x="170" y="150" width="60" height="150" rx="10" fill={accent} />
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse key={i} cx="200" cy={165 + i * 26} rx="52" ry="10" fill="none" stroke="#e8e8ee" strokeWidth="9" />
          ))}
          <rect x="182" y="295" width="36" height="42" rx="6" fill={metal} />
        </g>
      );
    case "Brakes":
      return (
        <g>
          <circle cx="200" cy="210" r="105" fill={metal} />
          <circle cx="200" cy="210" r="60" fill="#131316" />
          <circle cx="200" cy="210" r="26" fill="#3c3c44" />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx={200 + 82 * Math.cos((i * Math.PI) / 6)} cy={210 + 82 * Math.sin((i * Math.PI) / 6)} r="5" fill="#26262c" />
          ))}
          <path d="M 200 210 m -118 -44 a 126 126 0 0 1 96 -62 l 8 40 a 86 86 0 0 0 -66 42 Z" fill={accent} />
        </g>
      );
    case "Wheels":
      return (
        <g>
          <circle cx="200" cy="210" r="110" fill="#131316" stroke={metal} strokeWidth="16" />
          <circle cx="200" cy="210" r="24" fill={metal} />
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} d="M200 210 L188 118 L212 118 Z" fill={i % 2 ? "#c8c8d2" : "#8f8f9a"} transform={`rotate(${i * 36} 200 210)`} />
          ))}
          <circle cx="200" cy="210" r="9" fill={accent} />
        </g>
      );
    case "Merchandise":
      return (
        <g>
          <path d="M140 130 L110 160 L130 190 L145 178 L145 300 L255 300 L255 178 L270 190 L290 160 L260 130 L232 118 Q 200 140 168 118 Z" fill="#1c1c21" stroke="#3c3c44" strokeWidth="4" />
          <circle cx="200" cy="215" r="38" fill="none" stroke={accent} strokeWidth="5" />
          <path d="M182 228 L200 196 L218 228 Z" fill={accent} />
        </g>
      );
  }
}
