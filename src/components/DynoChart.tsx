"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const W = 720;
const H = 380;
const PAD = { l: 52, r: 52, t: 24, b: 42 };
const RPM_MIN = 1000;
const RPM_MAX = 7000;
const HP_MAX = 320;
const NM_MAX = 480;

// simple torque model: rise, plateau, tail-off — hp derived from torque
function torqueAt(rpm: number, peak: number, plateauStart: number, plateauEnd: number): number {
  if (rpm < plateauStart) {
    const t = (rpm - RPM_MIN) / (plateauStart - RPM_MIN);
    return peak * (0.45 + 0.55 * Math.pow(Math.max(t, 0), 1.4));
  }
  if (rpm <= plateauEnd) return peak;
  const t = (rpm - plateauEnd) / (RPM_MAX - plateauEnd);
  return peak * (1 - 0.38 * Math.pow(t, 1.5));
}

const hpFrom = (nm: number, rpm: number) => (nm * rpm) / 7127;

interface Curve {
  label: string;
  color: string;
  peakNm: number;
  ps: number;
  pe: number;
}

const CURVES: { stock: Curve; tuned: Curve } = {
  stock: { label: "Stock", color: "#8f8f9a", peakNm: 250, ps: 1800, pe: 3800 },
  tuned: { label: "Unity Stage 2", color: "#e10600", peakNm: 345, ps: 1900, pe: 4600 },
};

function useCurvePoints(c: Curve) {
  return useMemo(() => {
    const pts: { rpm: number; nm: number; hp: number }[] = [];
    for (let rpm = RPM_MIN; rpm <= RPM_MAX; rpm += 100) {
      const nm = torqueAt(rpm, c.peakNm, c.ps, c.pe);
      pts.push({ rpm, nm, hp: hpFrom(nm, rpm) });
    }
    return pts;
  }, [c]);
}

const x = (rpm: number) => PAD.l + ((rpm - RPM_MIN) / (RPM_MAX - RPM_MIN)) * (W - PAD.l - PAD.r);
const yHp = (hp: number) => H - PAD.b - (hp / HP_MAX) * (H - PAD.t - PAD.b);
const yNm = (nm: number) => H - PAD.b - (nm / NM_MAX) * (H - PAD.t - PAD.b);

function path(pts: { rpm: number; v: number }[], yFn: (v: number) => number) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.rpm).toFixed(1)},${yFn(p.v).toFixed(1)}`).join(" ");
}

export default function DynoChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoverRpm, setHoverRpm] = useState<number | null>(null);
  const [showTorque, setShowTorque] = useState(true);

  const stock = useCurvePoints(CURVES.stock);
  const tuned = useCurvePoints(CURVES.tuned);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const rpm = RPM_MIN + ((px - PAD.l) / (W - PAD.l - PAD.r)) * (RPM_MAX - RPM_MIN);
    setHoverRpm(rpm >= RPM_MIN && rpm <= RPM_MAX ? Math.round(rpm / 100) * 100 : null);
  };

  const hi = hoverRpm ? (hoverRpm - RPM_MIN) / 100 : null;
  const hs = hi !== null ? stock[hi] : null;
  const ht = hi !== null ? tuned[hi] : null;

  const peakStockHp = Math.round(Math.max(...stock.map((p) => p.hp)));
  const peakTunedHp = Math.round(Math.max(...tuned.map((p) => p.hp)));

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101012] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-5 text-sm">
          {(["stock", "tuned"] as const).map((k) => (
            <span key={k} className="flex items-center gap-2">
              <span className="h-1 w-6 rounded" style={{ background: CURVES[k].color }} />
              <span className={k === "tuned" ? "font-semibold text-white" : "text-white/60"}>{CURVES[k].label}</span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-white/60">
            <input type="checkbox" checked={showTorque} onChange={(e) => setShowTorque(e.target.checked)} />
            Show torque
          </label>
          <div className="display text-sm">
            <span className="text-white/50">{peakStockHp} HP</span>
            <span className="mx-2 text-[#e10600]">→</span>
            <span className="text-[#ff2a1f]">{peakTunedHp} HP</span>
          </div>
        </div>
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverRpm(null)}
        role="img"
        aria-label={`Dyno chart: stock ${peakStockHp} horsepower versus Unity Stage 2 ${peakTunedHp} horsepower`}
      >
        {/* grid */}
        {[0, 80, 160, 240, 320].map((hp) => (
          <g key={hp}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yHp(hp)} y2={yHp(hp)} stroke="#ffffff" strokeOpacity="0.07" />
            <text x={PAD.l - 8} y={yHp(hp) + 4} textAnchor="end" fontSize="11" fill="#8f8f9a">{hp}</text>
          </g>
        ))}
        {[100, 200, 300, 400].map((nm) => (
          <text key={nm} x={W - PAD.r + 8} y={yNm(nm) + 4} fontSize="11" fill="#55555f">{nm}</text>
        ))}
        {[1000, 2000, 3000, 4000, 5000, 6000, 7000].map((rpm) => (
          <g key={rpm}>
            <line x1={x(rpm)} x2={x(rpm)} y1={PAD.t} y2={H - PAD.b} stroke="#ffffff" strokeOpacity="0.05" />
            <text x={x(rpm)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fill="#8f8f9a">{rpm / 1000}k</text>
          </g>
        ))}
        <text x={PAD.l - 8} y={12} textAnchor="end" fontSize="10" fill="#8f8f9a">HP</text>
        <text x={W - PAD.r + 8} y={12} fontSize="10" fill="#55555f">Nm</text>
        <text x={(W) / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#55555f">RPM</text>

        {/* torque (dashed) */}
        {showTorque && (
          <>
            <motion.path
              d={path(stock.map((p) => ({ rpm: p.rpm, v: p.nm })), yNm)}
              fill="none" stroke={CURVES.stock.color} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, delay: 0.2 }}
            />
            <motion.path
              d={path(tuned.map((p) => ({ rpm: p.rpm, v: p.nm })), yNm)}
              fill="none" stroke={CURVES.tuned.color} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, delay: 0.5 }}
            />
          </>
        )}

        {/* hp curves */}
        <motion.path
          d={path(stock.map((p) => ({ rpm: p.rpm, v: p.hp })), yHp)}
          fill="none" stroke={CURVES.stock.color} strokeWidth="2.5"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, delay: 0.2 }}
        />
        <motion.path
          d={path(tuned.map((p) => ({ rpm: p.rpm, v: p.hp })), yHp)}
          fill="none" stroke={CURVES.tuned.color} strokeWidth="3" style={{ filter: "drop-shadow(0 0 6px rgba(225,6,0,0.6))" }}
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.8, delay: 0.5 }}
        />

        {/* hover crosshair */}
        {hoverRpm && hs && ht && (
          <g>
            <line x1={x(hoverRpm)} x2={x(hoverRpm)} y1={PAD.t} y2={H - PAD.b} stroke="#ffffff" strokeOpacity="0.25" strokeDasharray="3 3" />
            <circle cx={x(hoverRpm)} cy={yHp(hs.hp)} r="4" fill={CURVES.stock.color} />
            <circle cx={x(hoverRpm)} cy={yHp(ht.hp)} r="5" fill={CURVES.tuned.color} />
            <g transform={`translate(${Math.min(x(hoverRpm) + 12, W - 190)}, ${PAD.t + 8})`}>
              <rect width="172" height="74" rx="8" fill="#060607" stroke="#26262c" />
              <text x="12" y="20" fontSize="12" fontWeight="700" fill="#fff">{hoverRpm.toLocaleString()} RPM</text>
              <text x="12" y="40" fontSize="12" fill="#8f8f9a">Stock: {Math.round(hs.hp)} HP · {Math.round(hs.nm)} Nm</text>
              <text x="12" y="60" fontSize="12" fill="#ff2a1f">Tuned: {Math.round(ht.hp)} HP · {Math.round(ht.nm)} Nm</text>
            </g>
          </g>
        )}
      </svg>

      <p className="mt-2 text-center text-xs text-white/35">
        Real customer car: VW Virtus GT 1.5 TSI — Stage 2 with downpipe & intake. Hover the graph to compare.
      </p>
    </div>
  );
}
