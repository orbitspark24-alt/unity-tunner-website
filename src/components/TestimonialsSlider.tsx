"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSite } from "@/lib/useSite";
import { IconStar } from "./Icons";
import { cx } from "@/lib/utils";

export default function TestimonialsSlider() {
  const { settings } = useSite();
  const TESTIMONIALS = settings.testimonials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || TESTIMONIALS.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, [paused, TESTIMONIALS.length]);

  const t = TESTIMONIALS[i % TESTIMONIALS.length];

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#101012] p-8 sm:p-10">
        <div className="absolute right-6 top-4 select-none font-serif text-[120px] leading-none text-[#e10600]/15">&rdquo;</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 60, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -60, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex gap-1">
              {Array.from({ length: t.rating }).map((_, s) => <IconStar key={s} width={16} height={16} />)}
            </div>
            <p className="text-base leading-relaxed text-white/85 sm:text-lg">{t.text}</p>
            <div className="mt-6 flex items-center gap-4">
              {/* customer car avatar */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/15"
                style={{ background: `radial-gradient(circle at 35% 30%, hsl(${t.hue} 60% 38%), hsl(${t.hue} 50% 12%))` }}
                aria-hidden
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 14l1.5-4.5A2 2 0 0 1 6.4 8h11.2a2 2 0 0 1 1.9 1.5L21 14v5h-2.5v-1.5h-13V19H3v-5z" />
                  <circle cx="7" cy="15.5" r="1" fill="#fff" /><circle cx="17" cy="15.5" r="1" fill="#fff" />
                </svg>
              </div>
              <div>
                <div className="display text-lg">{t.name}</div>
                <div className="text-sm text-[#ff2a1f]">{t.car}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((_, d) => (
          <button
            key={d}
            onClick={() => setI(d)}
            aria-label={`Show testimonial ${d + 1}`}
            className={cx("h-1.5 rounded-full transition-all duration-300", d === i ? "w-8 bg-[#e10600]" : "w-3 bg-white/20 hover:bg-white/40")}
          />
        ))}
      </div>
    </div>
  );
}
