import Image from "next/image";

/**
 * Official Unity Performance logo (turbo + flames, "UNITY MOTORSPORTS PERFORMANCE").
 * Source: https://unityperformance.in — native size 1285x431 (~2.98:1).
 * `size` is the rendered height; width scales to keep the aspect ratio.
 */
const ASPECT = 1285 / 431;

export default function Logo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/unity-performance-logo.jpeg"
      alt="Unity Performance logo"
      height={size}
      width={Math.round(size * ASPECT)}
      className={`rounded-md ${className}`}
      style={{ height: size, width: "auto" }}
      priority
    />
  );
}
