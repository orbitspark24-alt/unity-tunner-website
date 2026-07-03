"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { type CarMake } from "@/lib/products";
import {
  ESTIMATOR_MAKES,
  modelsFor,
  estimate,
  STAGE_LABELS,
  ENGINE_LABEL,
  ENGINE_NOTE,
} from "@/lib/estimator";
import { IconGauge } from "./Icons";
import { cx } from "@/lib/utils";

/** Tweens a number whenever `value` changes. */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) return;
    let raf = 0;
    const start = performance.now();
    const dur = 650;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display.toLocaleString("en-IN")}</>;
}

function Bar({ label, stock, tuned, unit }: { label: string; stock: number; tuned: number; unit: string }) {
  const max = Math.max(tuned, 1);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="display text-sm tracking-wider text-white/70">{label}</span>
        <span className="text-xs text-white/40">
          <span className="text-white/60">
            <AnimatedNumber value={stock} />
          </span>
          <span className="mx-1.5 text-[#e10600]">→</span>
          <span className="display text-base text-[#ff2a1f]">
            <AnimatedNumber value={tuned} />
          </span>{" "}
          {unit}
        </span>
      </div>
      <div className="relative h-7 overflow-hidden rounded-md bg-[#17171b]">
        {/* stock bar */}
        <div
          className="absolute inset-y-0 left-0 rounded-md bg-white/15"
          style={{ width: `${(stock / max) * 100}%` }}
        />
        {/* tuned bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-r from-[#7a0400] to-[#e10600]"
          initial={false}
          animate={{ width: `${(tuned / max) * 100}%` }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ boxShadow: "0 0 18px rgba(225,6,0,0.45)" }}
        />
      </div>
    </div>
  );
}

export default function PowerEstimator() {
  const [make, setMake] = useState<CarMake>("Volkswagen");
  const [model, setModel] = useState("Virtus GT");
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  const models = useMemo(() => modelsFor(make), [make]);
  const result = useMemo(() => estimate(model, stage), [model, stage]);

  const onMakeChange = (m: CarMake) => {
    setMake(m);
    setModel(modelsFor(m)[0] ?? "");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101012]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* controls */}
        <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center gap-2 text-[#ff2a1f]">
            <IconGauge width={20} height={20} />
            <span className="display text-sm tracking-[0.25em]">Configure</span>
          </div>

          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/45">Make</label>
          <select
            value={make}
            onChange={(e) => onMakeChange(e.target.value as CarMake)}
            className="field mb-4"
            aria-label="Select car make"
          >
            {ESTIMATOR_MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/45">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="field mb-5"
            aria-label="Select car model"
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label className="mb-2 block text-xs uppercase tracking-wider text-white/45">Tuning Stage</label>
          <div className="grid grid-cols-3 gap-2">
            {STAGE_LABELS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStage(i as 0 | 1 | 2)}
                className={cx(
                  "display rounded-md border py-2.5 text-sm tracking-wider transition-all",
                  stage === i
                    ? "border-[#e10600] bg-[#e10600] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                    : "border-white/15 text-white/60 hover:border-[#e10600]/50 hover:text-white"
                )}
              >
                {s.replace("Stage ", "S")}
              </button>
            ))}
          </div>

          {result && (
            <p className="mt-5 rounded-md border border-white/8 bg-white/[0.03] px-3.5 py-3 text-xs leading-relaxed text-white/50">
              <span className="font-semibold text-white/70">{ENGINE_LABEL[result.spec.engine]}.</span>{" "}
              {ENGINE_NOTE[result.spec.engine]}
            </p>
          )}
        </div>

        {/* results */}
        <div className="p-6 sm:p-8">
          {result ? (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/40">Projected on {STAGE_LABELS[stage]}</div>
                  <div className="display text-2xl">
                    {make} {model}
                  </div>
                </div>
                <div className="rounded-lg border border-[#e10600]/40 bg-[#e10600]/10 px-4 py-2 text-center">
                  <div className="display text-3xl leading-none text-[#ff2a1f]">
                    +<AnimatedNumber value={result.hpPct} />%
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">Power</div>
                </div>
              </div>

              <div className="space-y-5">
                <Bar label="Horsepower" stock={result.stockHp} tuned={result.tunedHp} unit="HP" />
                <Bar label="Torque" stock={result.stockNm} tuned={result.tunedNm} unit="Nm" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#17171b] p-3 text-center">
                  <div className="display text-2xl text-[#ff2a1f]">
                    +<AnimatedNumber value={result.hpGain} />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/45">Horsepower</div>
                </div>
                <div className="rounded-lg bg-[#17171b] p-3 text-center">
                  <div className="display text-2xl text-[#ff2a1f]">
                    +<AnimatedNumber value={result.nmGain} />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/45">Newton-metres</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/booking" className="btn btn-primary flex-1 rounded-md px-6 py-3 text-sm">
                  Book This Tune
                </Link>
                <Link href="/services" className="btn btn-outline rounded-md px-6 py-3 text-sm">
                  See Stages
                </Link>
              </div>
              <p className="mt-3 text-center text-[11px] text-white/35">
                Estimates from stock figures &amp; typical Unity results. Your exact numbers are confirmed on our dyno.
              </p>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/45">
              Pick a car to see the numbers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
