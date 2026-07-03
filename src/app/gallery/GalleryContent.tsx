"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BUILDS, type Build } from "@/lib/builds";
import { IconX } from "@/components/Icons";
import { cx } from "@/lib/utils";

const FILTERS = ["All", "German", "JDM", "Indian", "Diesel SUV"] as const;

function BuildArt({ b, big = false }: { b: Build; big?: boolean }) {
  return (
    <div className="relative h-full w-full" style={{ background: `radial-gradient(circle at 30% 25%, hsl(${b.hue} 55% 24%), #0b0b0d 78%)` }}>
      <svg viewBox="0 0 240 80" className={cx("absolute inset-x-0 mx-auto w-4/5 text-white/85", big ? "bottom-16" : "bottom-10")} fill="currentColor" aria-hidden>
        <path d="M14 58c-4 0-6-3-6-7 0-5 3-8 8-9 6-1 14-2 22-7 10-6 20-13 34-15 16-2 38-2 52 2 10 3 16 9 24 12 12 2 30 3 42 7 8 3 12 7 12 12 0 3-2 5-5 5h-9a17 17 0 0 0-33 0h-80a17 17 0 0 0-33 0H14z" />
        <circle cx="59" cy="58" r="12" fill="#0a0a0a" stroke="currentColor" strokeWidth="5" />
        <circle cx="187" cy="58" r="12" fill="#0a0a0a" stroke="currentColor" strokeWidth="5" />
      </svg>
      {/* headlight glow */}
      <div className="absolute bottom-1/3 left-[12%] h-2 w-10 rounded-full bg-white/50 blur-md" />
    </div>
  );
}

export default function GalleryContent() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selected, setSelected] = useState<Build | null>(null);

  const shown = BUILDS.filter((b) => filter === "All" || b.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <div className="mb-10 text-center">
        <div className="display mb-2 text-xs tracking-[0.4em] text-[#ff2a1f]">The Gallery</div>
        <h1 className="display text-5xl sm:text-6xl">Builds That Bite</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/55">Every build here rolled off our dyno with receipts. Click one for the full spec.</p>
      </div>

      {/* filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cx(
              "display rounded-full border px-5 py-2 text-sm tracking-wider transition-all",
              filter === f
                ? "border-[#e10600] bg-[#e10600] text-white shadow-[0_0_18px_rgba(225,6,0,0.4)]"
                : "border-white/15 text-white/60 hover:border-[#e10600]/50 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* masonry-ish grid */}
      <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" style={{ gridAutoRows: "150px" }}>
        <AnimatePresence mode="popLayout">
          {shown.map((b) => (
            <motion.button
              layout
              key={b.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              onClick={() => setSelected(b)}
              className={cx(
                "group relative overflow-hidden rounded-xl border border-white/10 text-left",
                b.tall ? "row-span-3" : "row-span-2"
              )}
              aria-label={`Open ${b.title} details`}
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                <BuildArt b={b} big={b.tall} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="display text-lg leading-tight sm:text-xl">{b.title}</div>
                <div className="text-xs text-white/55">{b.car} · {b.stage}</div>
                <div className="mt-1.5 flex items-center gap-2 text-xs font-bold">
                  <span className="text-white/45">{b.stockHp} HP</span>
                  <span className="h-px w-4 bg-[#e10600]" />
                  <span className="text-[#ff2a1f]">{b.tunedHp} HP</span>
                </div>
              </div>
              <span className="display absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] tracking-widest text-white/70">{b.category}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#101012]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label={`${selected.title} details`}
            >
              <button onClick={() => setSelected(null)} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-md bg-black/50 p-2 text-white/80 hover:text-[#ff2a1f]">
                <IconX width={18} height={18} />
              </button>
              <div className="h-56 sm:h-64"><BuildArt b={selected} big /></div>
              <div className="p-6">
                <div className="display text-3xl">{selected.title}</div>
                <div className="mt-1 text-sm text-white/55">{selected.car} · {selected.stage}</div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-[#17171b] p-4 text-center">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Before</div>
                    <div className="display mt-1 text-3xl text-white/70">{selected.stockHp} <span className="text-base">HP</span></div>
                    <div className="text-xs text-white/45">{selected.stockNm} Nm</div>
                  </div>
                  <div className="rounded-xl border border-[#e10600]/40 bg-[#e10600]/8 p-4 text-center">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#ff2a1f]">After</div>
                    <div className="display mt-1 text-3xl text-[#ff2a1f]">{selected.tunedHp} <span className="text-base">HP</span></div>
                    <div className="text-xs text-white/55">{selected.tunedNm} Nm</div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="display mb-2 text-xs tracking-[0.25em] text-white/50">Mods</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.mods.map((m) => (
                      <span key={m} className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/70">{m}</span>
                    ))}
                  </div>
                </div>
                <p className="mt-5 border-l-2 border-[#e10600] pl-4 text-sm italic text-white/60">&ldquo;{selected.quote}&rdquo;</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
