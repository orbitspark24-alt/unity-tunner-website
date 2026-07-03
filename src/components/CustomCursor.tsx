"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("uc-cursor");

    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    let hovering = false;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      hovering = !!t?.closest("a, button, input, select, textarea, label, [role='button'], [data-cursor]");
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) {
        const s = hovering ? 2.1 : 1;
        ring.current.style.transform = `translate(${rx}px, ${ry}px) scale(${s})`;
        ring.current.style.borderColor = hovering ? "rgba(255,42,31,0.9)" : "rgba(225,6,0,0.75)";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("uc-cursor");
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block" aria-hidden>
      <div
        ref={ring}
        className="absolute -top-4 -left-4 h-8 w-8 rounded-full border-2 transition-[border-color] duration-200 will-change-transform"
        style={{ borderColor: "rgba(225,6,0,0.75)" }}
      />
      <div ref={dot} className="absolute -top-0.5 -left-0.5 h-1 w-1 rounded-full bg-white/90 will-change-transform" />
    </div>
  );
}
