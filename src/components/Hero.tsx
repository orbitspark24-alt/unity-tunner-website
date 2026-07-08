"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Tachometer from "./Tachometer";
import { useSite } from "@/lib/useSite";

const SMOKE = [
  { left: "8%", bottom: "0%", size: 130, dur: "10s", delay: "0s", dx: "140px", o: 0.12 },
  { left: "22%", bottom: "-4%", size: 180, dur: "13s", delay: "2s", dx: "-90px", o: 0.1 },
  { left: "58%", bottom: "-2%", size: 150, dur: "11s", delay: "4.5s", dx: "120px", o: 0.13 },
  { left: "76%", bottom: "0%", size: 200, dur: "14s", delay: "1s", dx: "-140px", o: 0.09 },
];

export default function Hero() {
  const { settings } = useSite();
  const { hero } = settings;
  return (
    <section className="relative flex min-h-screen min-h-[100svh] items-center justify-center overflow-hidden">
      {/*
        Background is intentionally static: scroll-transforming this layer
        (carbon texture + grid + SVG gauge + smoke) forced the GPU to
        re-composite a full-screen stack every frame and janked scrolling.
        Depth comes from the text parallax below, which is a small layer.
      */}
      <div className="absolute inset-0">
        <div className="carbon-bg absolute inset-0" />
        <div className="grid-fade absolute inset-0" />
        {/* dyno glow under the car — pure gradient, no blur filter */}
        <div
          className="absolute bottom-0 left-1/2 h-72 w-[130%] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(225,6,0,0.14), transparent 70%)" }}
        />
        {/* tachometer, faint, center — hidden on phones to save GPU/battery */}
        <div className="absolute left-1/2 top-1/2 hidden w-[560px] max-w-[95vw] -translate-x-1/2 -translate-y-[58%] opacity-25 sm:block">
          <Tachometer className="w-full" />
        </div>
        {/* drifting smoke — decorative, dropped on phones */}
        {SMOKE.map((s, i) => (
          <span
            key={i}
            className="smoke hidden sm:block"
            style={{
              left: s.left,
              bottom: s.bottom,
              width: s.size,
              height: s.size,
              ["--dur" as string]: s.dur,
              ["--delay" as string]: s.delay,
              ["--dx" as string]: s.dx,
              ["--smoke-o" as string]: s.o,
            }}
          />
        ))}
      </div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0a0a0a_95%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* content — static (no scroll-linked transform) so the hero scrolls natively at 60fps */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-24 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="display mb-4 inline-block max-w-[92vw] rounded-full border border-[#e10600]/40 bg-[#e10600]/10 px-4 py-1.5 text-[10px] tracking-[0.12em] text-[#ff2a1f] sm:text-xs sm:tracking-[0.3em]"
        >
          {hero.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="display text-5xl leading-[0.95] sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {hero.title1}
          <br />
          <span className="text-[#e10600]" style={{ textShadow: "0 0 60px rgba(225,6,0,0.5)" }}>
            {hero.title2}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/65 sm:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/booking" className="btn btn-primary w-full rounded-md px-9 py-4 text-base sm:w-auto">
            Book a Tune
          </Link>
          <Link href="/shop" className="btn btn-outline w-full rounded-md px-9 py-4 text-base sm:w-auto">
            Shop Parts
          </Link>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-[#e10600] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
