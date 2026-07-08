"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSite } from "@/lib/useSite";
import { CAR_MAKES, CAR_MODELS, type CarMake } from "@/lib/products";
import { SERVICE_ICONS, IconCheck, IconChevron } from "@/components/Icons";
import { cx } from "@/lib/utils";
import type { Booking } from "@/lib/db";

const STEPS = ["Service", "Car Details", "Date & Time", "Contact", "Confirm"];

interface SlotInfo {
  time: string;
  available: boolean;
}

const stepAnim = {
  initial: { opacity: 0, x: 60, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -60, filter: "blur(4px)" },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export default function BookingFlow() {
  const { services: BOOKING_SERVICES } = useSite();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState("");
  const [car, setCar] = useState({ make: "" as CarMake | "", model: "", year: "", fuel: "Petrol", mods: "", reg: "" });
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "", email: "", notes: "" });
  const [deposit, setDeposit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);

  const service = BOOKING_SERVICES.find((s) => s.id === serviceId);

  const canNext = [
    !!serviceId,
    !!(car.make && car.model && car.year),
    !!(date && slot),
    !!(contact.name && contact.phone.length >= 10 && contact.email.includes("@")),
    true,
  ][step];

  const submit = async () => {
    if (!service) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: service.name,
          price: service.price,
          car,
          date,
          slot,
          contact,
          deposit,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setBooking(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      if (String(e).includes("Slot")) setStep(2); // slot got taken — re-pick
    } finally {
      setSubmitting(false);
    }
  };

  if (booking && service) return <Confirmed booking={booking} durationHours={service.durationHours} />;

  return (
    <div>
      {/* progress bar */}
      <div className="mb-10">
        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={cx(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                  i < step
                    ? "border-[#e10600] bg-[#e10600] text-white"
                    : i === step
                      ? "border-[#e10600] text-[#ff2a1f] shadow-[0_0_16px_rgba(225,6,0,0.5)]"
                      : "border-white/20 text-white/40"
                )}
              >
                {i < step ? <IconCheck width={16} height={16} /> : i + 1}
              </div>
              <span className={cx("hidden text-[11px] uppercase tracking-wider sm:block", i <= step ? "text-white/80" : "text-white/35")}>
                {s}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7a0400] to-[#e10600]"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — service */}
        {step === 0 && (
          <motion.div key="s0" {...stepAnim} className="grid gap-4 sm:grid-cols-2">
            {BOOKING_SERVICES.map((s) => {
              const Icon = SERVICE_ICONS[s.icon];
              const active = serviceId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setServiceId(s.id)}
                  className={cx(
                    "card-lift rounded-xl border p-5 text-left transition-colors",
                    active ? "border-[#e10600] bg-[#e10600]/8" : "border-white/12 bg-[#101012]"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cx("rounded-lg border p-2.5", active ? "border-[#e10600]/50 bg-[#e10600]/15 text-[#ff2a1f]" : "border-white/10 bg-white/5 text-white/70")}>
                      <Icon width={22} height={22} />
                    </div>
                    <div className="text-right">
                      <div className="display text-lg text-[#ff2a1f]">{s.gain}</div>
                      <div className="text-xs text-white/45">{s.duration}</div>
                    </div>
                  </div>
                  <h3 className="display mt-3 text-xl">{s.name}</h3>
                  <p className="mt-1 text-sm text-white/55">{s.tagline}</p>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* STEP 2 — car details */}
        {step === 1 && (
          <motion.div key="s1" {...stepAnim} className="grid gap-4 sm:grid-cols-2">
            <select value={car.make} onChange={(e) => setCar({ ...car, make: e.target.value as CarMake, model: "" })} className="field" aria-label="Car make">
              <option value="">Make…</option>
              {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={car.model} onChange={(e) => setCar({ ...car, model: e.target.value })} disabled={!car.make} className="field disabled:opacity-40" aria-label="Car model">
              <option value="">Model…</option>
              {car.make && CAR_MODELS[car.make].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={car.year} onChange={(e) => setCar({ ...car, year: e.target.value })} className="field" aria-label="Year">
              <option value="">Year…</option>
              {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={car.fuel} onChange={(e) => setCar({ ...car, fuel: e.target.value })} className="field" aria-label="Fuel type">
              {["Petrol", "Diesel", "CNG", "Hybrid"].map((f) => <option key={f}>{f}</option>)}
            </select>
            <input placeholder="Registration number (e.g. KA 01 AB 1234)" value={car.reg} onChange={(e) => setCar({ ...car, reg: e.target.value.toUpperCase() })} className="field sm:col-span-2" aria-label="Registration number" />
            <textarea
              placeholder="Current mods, if any — intake, exhaust, previous tunes…"
              value={car.mods}
              onChange={(e) => setCar({ ...car, mods: e.target.value })}
              rows={3}
              className="field sm:col-span-2"
              aria-label="Current modifications"
            />
          </motion.div>
        )}

        {/* STEP 3 — date & slot */}
        {step === 2 && (
          <motion.div key="s2" {...stepAnim}>
            <SlotPicker date={date} slot={slot} onPick={(d, s) => { setDate(d); setSlot(s); }} />
          </motion.div>
        )}

        {/* STEP 4 — contact */}
        {step === 3 && (
          <motion.div key="s3" {...stepAnim} className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Full name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="field" aria-label="Name" />
            <input required placeholder="Phone (WhatsApp preferred)" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="field" aria-label="Phone" />
            <input required placeholder="Email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="field sm:col-span-2" aria-label="Email" />
            <textarea placeholder="Anything we should know? Goals, concerns, playlist requests…" rows={3} value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} className="field sm:col-span-2" aria-label="Notes" />
          </motion.div>
        )}

        {/* STEP 5 — confirm */}
        {step === 4 && service && (
          <motion.div key="s4" {...stepAnim} className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-[#101012] p-6">
              <h3 className="display mb-4 text-2xl">Review &amp; Confirm</h3>
              <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <Row k="Service" v={service.name} />
                <Row k="Est. gain" v={service.gain} />
                <Row k="Duration" v={service.duration} />
                <Row k="Car" v={`${car.make} ${car.model} (${car.year}, ${car.fuel})`} />
                <Row k="Registration" v={car.reg || "—"} />
                <Row k="Date & Time" v={`${formatDate(date)} · ${slot}`} />
                <Row k="Contact" v={`${contact.name} · ${contact.phone}`} />
                {car.mods && <Row k="Current mods" v={car.mods} />}
                {contact.notes && <Row k="Notes" v={contact.notes} />}
              </dl>
            </div>

            <label className={cx("flex cursor-pointer items-center justify-between rounded-xl border p-5 transition-colors", deposit ? "border-[#e10600] bg-[#e10600]/8" : "border-white/12 bg-[#101012]")}>
              <div>
                <div className="font-semibold">Pay ₹2,000 deposit now (optional)</div>
                <div className="mt-1 text-sm text-white/55">Locks your slot with priority. Fully adjusted against the final bill.</div>
              </div>
              <input type="checkbox" checked={deposit} onChange={(e) => setDeposit(e.target.checked)} className="h-5 w-5" />
            </label>

            {error && <p className="rounded-md bg-[#e10600]/10 px-4 py-3 text-sm text-[#ff2a1f]">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* nav buttons */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn btn-outline rounded-md px-7 py-3 text-sm disabled:invisible"
        >
          <IconChevron width={14} height={14} className="rotate-180" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className="btn btn-primary rounded-md px-8 py-3 text-sm disabled:animate-none disabled:opacity-30">
            Continue <IconChevron width={14} height={14} />
          </button>
        ) : (
          <button onClick={submit} disabled={submitting} className="btn btn-primary rounded-md px-8 py-3 text-sm disabled:opacity-60">
            {submitting ? "Confirming…" : deposit ? "Pay Deposit & Confirm" : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-white/40">{k}</dt>
      <dd className="mt-0.5 text-white/85">{v}</dd>
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/* ---------------- calendar + slots ---------------- */

function SlotPicker({ date, slot, onPick }: { date: string; slot: string; onPick: (d: string, s: string) => void }) {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [blocked, setBlocked] = useState<string[]>([]);
  const [slots, setSlots] = useState<SlotInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/blocked").then((r) => r.json()).then(setBlocked).catch(() => {});
  }, []);

  const loadSlots = useCallback(async (d: string) => {
    setLoading(true);
    setSlots(null);
    try {
      const res = await fetch(`/api/slots?date=${d}`);
      const data = await res.json();
      setSlots(data.slots);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) loadSlots(date);
  }, [date, loadSlots]);

  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const todayIso = iso(today);

  const days: (Date | null)[] = useMemo(() => {
    const first = new Date(month);
    const pad = (first.getDay() + 6) % 7; // Monday first
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: pad }, () => null),
      ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ];
  }, [month]);

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      {/* calendar */}
      <div className="rounded-2xl border border-white/10 bg-[#101012] p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)}
            className="rounded-md border border-white/15 p-2 disabled:opacity-25"
            aria-label="Previous month"
          >
            <IconChevron width={14} height={14} className="rotate-180" />
          </button>
          <span className="display text-lg tracking-wider">
            {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="rounded-md border border-white/15 p-2"
            aria-label="Next month"
          >
            <IconChevron width={14} height={14} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div key={d} className="py-1 text-[11px] font-bold uppercase text-white/35">{d}</div>
          ))}
          {days.map((d, i) => {
            if (!d) return <div key={`pad-${i}`} />;
            const dIso = iso(d);
            const isPast = dIso < todayIso;
            const isSunday = d.getDay() === 0;
            const isBlocked = blocked.includes(dIso);
            const disabled = isPast || isSunday || isBlocked;
            const selected = date === dIso;
            return (
              <button
                key={dIso}
                disabled={disabled}
                onClick={() => onPick(dIso, "")}
                aria-label={`Select ${dIso}`}
                className={cx(
                  "relative rounded-md py-2 text-sm transition-all",
                  disabled && "text-white/20 line-through",
                  !disabled && !selected && "text-white/80 hover:bg-white/8",
                  selected && "bg-[#e10600] font-bold text-white shadow-[0_0_16px_rgba(225,6,0,0.5)]",
                  dIso === todayIso && !selected && "ring-1 ring-inset ring-[#e10600]/50"
                )}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-white/35">Sundays by appointment only — WhatsApp us. Struck-out dates are unavailable.</p>
      </div>

      {/* slots */}
      <div className="rounded-2xl border border-white/10 bg-[#101012] p-5">
        <h3 className="display mb-4 text-lg tracking-wider">
          {date ? formatDate(date) : "Pick a date"}
        </h3>
        {!date && <p className="text-sm text-white/45">Select a date to see open slots.</p>}
        {loading && (
          <div className="space-y-2.5">
            {[...Array(5)].map((_, i) => <div key={i} className="h-11 animate-pulse rounded-md bg-white/5" />)}
          </div>
        )}
        {date && slots && (
          <div className="space-y-2.5">
            {slots.map((s) => (
              <button
                key={s.time}
                disabled={!s.available}
                onClick={() => onPick(date, s.time)}
                className={cx(
                  "flex w-full items-center justify-between rounded-md border px-4 py-2.5 text-sm transition-all",
                  !s.available && "border-white/8 text-white/25 line-through",
                  s.available && slot !== s.time && "border-white/15 text-white/80 hover:border-[#e10600]/60 hover:text-white",
                  slot === s.time && "border-[#e10600] bg-[#e10600]/12 font-bold text-[#ff2a1f]"
                )}
              >
                <span>{s.time}</span>
                <span className="text-xs">{s.available ? (slot === s.time ? "Selected" : "Open") : "Booked"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- confirmation ---------------- */

function Confirmed({ booking, durationHours }: { booking: Booking; durationHours: number }) {
  const start = booking.date.replace(/-/g, "") + "T" + booking.slot.replace(":", "") + "00";
  const endH = String(Math.min(parseInt(booking.slot) + durationHours, 23)).padStart(2, "0");
  const end = booking.date.replace(/-/g, "") + "T" + endH + booking.slot.slice(2).replace(":", "") + "00";
  const gcal =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`Unity Performance — ${booking.serviceName}`)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(`Booking ${booking.id}\n${booking.car.make} ${booking.car.model}\nUnity Performance`)}` +
    `&location=${encodeURIComponent("L-12, Argora Housing Colony, Argora, Ranchi, Jharkhand 834002")}`;

  return (
    <div className="text-center">
      <motion.svg viewBox="0 0 100 100" className="mx-auto h-28 w-28" initial="hidden" animate="visible">
        <motion.circle
          cx="50" cy="50" r="44" fill="none" stroke="#e10600" strokeWidth="4"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <motion.path
          d="M30 52 L44 66 L72 36" fill="none" stroke="#e10600" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        />
      </motion.svg>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <h2 className="display mt-6 text-5xl">You&apos;re Booked</h2>
        <p className="mt-3 text-white/60">
          Booking ID <span className="display text-xl text-[#ff2a1f]">{booking.id}</span>
        </p>
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-white/10 bg-[#101012] p-6 text-left text-sm">
          <div className="flex justify-between py-1.5"><span className="text-white/50">Service</span><span className="font-semibold">{booking.serviceName}</span></div>
          <div className="flex justify-between py-1.5"><span className="text-white/50">Car</span><span>{booking.car.make} {booking.car.model}</span></div>
          <div className="flex justify-between py-1.5"><span className="text-white/50">When</span><span>{formatDate(booking.date)} · {booking.slot}</span></div>
          <div className="flex justify-between py-1.5"><span className="text-white/50">Deposit</span><span>{booking.deposit ? "₹2,000 paid" : "Pay at workshop"}</span></div>
        </div>
        <p className="mx-auto mt-4 max-w-md text-xs text-white/40">
          A confirmation email and WhatsApp reminder are on their way. Arrive with a full-ish tank and your service history if you have it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={gcal} target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-md px-7 py-3 text-sm">
            Add to Google Calendar
          </a>
          <a href="/" className="btn btn-outline rounded-md px-7 py-3 text-sm">Back to Home</a>
        </div>
      </motion.div>
    </div>
  );
}
