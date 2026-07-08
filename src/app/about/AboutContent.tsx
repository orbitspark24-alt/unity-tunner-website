"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { useSite } from "@/lib/useSite";
import Counter from "@/components/Counter";
import Logo from "@/components/Logo";
import { PARTNER_BRANDS } from "@/lib/builds";

const TEAM = [
  { name: "Aakash 'Torque' Nair", role: "Founder & Master Tuner", bio: "Ex-race engineer. Wrote his first map on a Palio 1.6 in 2009 and never looked back.", hue: 0 },
  { name: "Priya Venkatesh", role: "Head of Calibration", bio: "The one who says 'no' to unsafe maps. Data-logging fanatic, 400+ calibrations delivered.", hue: 210 },
  { name: "Danish Khan", role: "Fabrication Lead", bio: "If it's stainless and beautiful, Danish welded it. TIG artist, exhaust whisperer.", hue: 30 },
  { name: "Rahul Bose", role: "Workshop Manager", bio: "Keeps the dyno queue honest and every car photographed, tracked and spotless.", hue: 120 },
];

const STORY = [
  { year: "2015", text: "A rented garage, one laptop, and a stubborn belief that Indian cars deserved proper tuning." },
  { year: "2017", text: "First AWD dyno in the region. The 'proof, not promises' policy is born — every tune ships with graphs." },
  { year: "2020", text: "In-house fabrication shop opens. Downpipes and cat-backs, TIG-welded metres from the dyno." },
  { year: "2023", text: "The 20,000th vehicle rolls out. A Polo GT that started it all comes back for Stage 3." },
  { year: "2026", text: "30,000+ vehicles optimized. Same garage energy, much bigger toys." },
];

export default function AboutContent() {
  const { settings } = useSite();
  return (
    <div className="pb-24">
      {/* hero — static backgrounds; scroll-transforming full-screen layers janks scrolling */}
      <div className="relative flex h-[70vh] items-center justify-center overflow-hidden">
        <div className="carbon-bg absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.14),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        <div className="relative z-10 px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <Logo size={110} className="mx-auto mb-6" />
          </motion.div>
          <h1 className="display text-5xl sm:text-7xl">Born In A Garage.<br /><span className="text-[#e10600]">Raised On A Dyno.</span></h1>
        </div>
      </div>

      {/* story timeline */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="text-center text-lg leading-relaxed text-white/70">
            Unity Performance started with one conviction: tuning isn&apos;t magic, it&apos;s measurement.
            19+ years later we&apos;ve calibrated everything from Altos to AMGs — and every single one left with a
            dyno sheet proving the gains.
          </p>
        </Reveal>
        <div className="mt-14 space-y-0">
          {STORY.map((s, i) => (
            <Reveal key={s.year} delay={i * 0.05} x={i % 2 ? 40 : -40} y={0}>
              <div className="flex gap-6 border-l-2 border-[#e10600]/40 pb-10 pl-6 last:pb-0">
                <div>
                  <div className="display -ml-6 text-3xl text-[#ff2a1f]"><span className="mr-4 inline-block h-3 w-3 -translate-x-[7px] rounded-full bg-[#e10600]" />{s.year}</div>
                  <p className="mt-2 text-white/65">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* stats */}
      <section className="border-y border-white/10 bg-[#0d0d0f]">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-6 px-4 py-14 text-center sm:px-6">
          {settings.aboutStats.map((s) => (
            <div key={s.label}>
              <div className="display text-3xl text-white sm:text-5xl"><Counter to={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} /></div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/45 sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* team */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="mb-12 text-center">
          <div className="display mb-2 text-xs tracking-[0.4em] text-[#ff2a1f]">The Crew</div>
          <h2 className="display text-4xl sm:text-5xl">People Behind The Power</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t, i) => (
            <Reveal key={t.name} delay={(i % 4) * 0.08}>
              <div className="card-lift card-sweep h-full rounded-xl border border-white/10 bg-[#101012] p-6 text-center">
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/15 text-3xl"
                  style={{ background: `radial-gradient(circle at 35% 30%, hsl(${t.hue} 55% 32%), hsl(${t.hue} 45% 10%))` }}
                  aria-hidden
                >
                  <span className="display text-white">{t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                </div>
                <h3 className="display mt-4 text-lg leading-tight">{t.name}</h3>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-[#ff2a1f]">{t.role}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{t.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* partner marquee */}
      <section className="overflow-hidden border-y border-white/10 bg-[#0d0d0f] py-10">
        <div className="display mb-6 text-center text-xs tracking-[0.4em] text-white/40">Certified & Partnered With</div>
        <div className="marquee-track gap-14">
          {[...PARTNER_BRANDS, ...PARTNER_BRANDS].map((b, i) => (
            <span key={i} className="display whitespace-nowrap text-2xl text-white/25 transition-colors hover:text-[#ff2a1f]">
              {b}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
