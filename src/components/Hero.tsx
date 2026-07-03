"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Tachometer from "./Tachometer";

const SMOKE = [
  { left: "8%", bottom: "0%", size: 130, dur: "10s", delay: "0s", dx: "140px", o: 0.12 },
  { left: "22%", bottom: "-4%", size: 180, dur: "13s", delay: "2s", dx: "-90px", o: 0.1 },
  { left: "58%", bottom: "-2%", size: 150, dur: "11s", delay: "4.5s", dx: "120px", o: 0.13 },
  { left: "76%", bottom: "0%", size: 200, dur: "14s", delay: "1s", dx: "-140px", o: 0.09 },
  { left: "40%", bottom: "-6%", size: 160, dur: "12s", delay: "6s", dx: "100px", o: 0.11 },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* parallax background layers */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <div className="carbon-bg absolute inset-0" />
        <div className="grid-fade absolute inset-0" />
        {/* dyno glow under the car */}
        <div className="absolute bottom-0 left-1/2 h-64 w-[130%] -translate-x-1/2 rounded-[100%] bg-[#e10600]/12 blur-3xl" />
        {/* tachometer, faint, center */}
        <div className="absolute left-1/2 top-1/2 w-[560px] max-w-[95vw] -translate-x-1/2 -translate-y-[58%] opacity-25">
          <Tachometer className="w-full" />
        </div>
        {/* drifting smoke */}
        {SMOKE.map((s, i) => (
          <span
            key={i}
            className="smoke"
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
      </motion.div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0a0a0a_95%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* content */}
      <motion.div style={{ y: yText, opacity }} className="relative z-10 mx-auto max-w-5xl px-4 pt-24 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="display mb-4 inline-block rounded-full border border-[#e10600]/40 bg-[#e10600]/10 px-4 py-1.5 text-xs tracking-[0.3em] text-[#ff2a1f]"
        >
          Dyno-Proven Since 2015
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="display text-6xl leading-[0.9] sm:text-8xl lg:text-9xl"
        >
          Unleash
          <br />
          <span className="text-[#e10600]" style={{ textShadow: "0 0 60px rgba(225,6,0,0.5)" }}>
            Your Machine
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/65 sm:text-lg"
        >
          Precision ECU tuning, performance parts &amp; dyno-proven power. No guesswork — every calibration verified on our AWD dyno.
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
      </motion.div>

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
