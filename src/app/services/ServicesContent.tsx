"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { BOOKING_SERVICES, STAGE_COMPARISON, SERVICE_FAQ } from "@/lib/services";
import { SERVICE_ICONS, IconChevron } from "@/components/Icons";
import { inr, cx } from "@/lib/utils";

export default function ServicesContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <div className="mb-14 text-center">
        <div className="display mb-2 text-xs tracking-[0.4em] text-[#ff2a1f]">Services</div>
        <h1 className="display text-5xl sm:text-6xl">More Power.<br /><span className="text-[#e10600]">Zero Compromise.</span></h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/55 sm:text-base">
          Every calibration is written in-house, on our AWD dyno, for your exact car and fuel. No downloaded files, no generic maps, no guesswork.
        </p>
      </div>

      {/* service cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {BOOKING_SERVICES.map((s, i) => {
          const Icon = SERVICE_ICONS[s.icon];
          return (
            <Reveal key={s.id} delay={(i % 2) * 0.1}>
              <div className="card-lift card-sweep flex h-full flex-col rounded-xl border border-white/10 bg-[#101012] p-6">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg border border-[#e10600]/30 bg-[#e10600]/10 p-3 text-[#ff2a1f]">
                    <Icon width={24} height={24} />
                  </div>
                  <div className="text-right">
                    <div className="display text-2xl text-[#ff2a1f]">{inr(s.price)}</div>
                    <div className="text-xs text-white/45">{s.duration} · {s.gain}</div>
                  </div>
                </div>
                <h2 className="display mt-4 text-2xl">{s.name}</h2>
                <p className="mt-1 text-sm text-white/55">{s.tagline}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-white/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e10600]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href="/booking" className="btn btn-primary mt-6 w-full rounded-md px-6 py-3 text-sm">
                  Book This Service
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* stage comparison */}
      <Reveal className="mt-24">
        <div className="mb-8 text-center">
          <h2 className="display text-4xl">Stage 1 vs 2 vs 3</h2>
          <p className="mt-3 text-sm text-white/55">Where does your build stop? (Trick question — it never does.)</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-[#17171b] text-left">
                <th className="px-5 py-4 font-semibold text-white/60"></th>
                <th className="display px-5 py-4 text-lg tracking-wider">Stage 1</th>
                <th className="display px-5 py-4 text-lg tracking-wider text-[#ff2a1f]">Stage 2</th>
                <th className="display px-5 py-4 text-lg tracking-wider">Stage 3</th>
              </tr>
            </thead>
            <tbody>
              {STAGE_COMPARISON.map((row, i) => (
                <tr key={row.label} className={i % 2 ? "bg-[#101012]" : "bg-[#141417]"}>
                  <td className="px-5 py-3.5 font-semibold text-white/60">{row.label}</td>
                  <td className="px-5 py-3.5">{row.s1}</td>
                  <td className="border-x border-[#e10600]/20 bg-[#e10600]/5 px-5 py-3.5 font-semibold">{row.s2}</td>
                  <td className="px-5 py-3.5">{row.s3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal className="mx-auto mt-24 max-w-3xl">
        <h2 className="display mb-8 text-center text-4xl">Straight Answers</h2>
        <div className="space-y-3">
          {SERVICE_FAQ.map(([q, a], i) => (
            <div key={q} className="overflow-hidden rounded-xl border border-white/10 bg-[#101012]">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="font-semibold">{q}</span>
                <IconChevron
                  width={16}
                  height={16}
                  className={cx("shrink-0 text-[#ff2a1f] transition-transform duration-300", openFaq === i ? "-rotate-90" : "rotate-90")}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/booking" className="btn btn-primary rounded-md px-10 py-4 text-base">
            Book a Tune
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
