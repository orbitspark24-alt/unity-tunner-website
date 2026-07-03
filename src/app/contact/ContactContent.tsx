"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { IconWhatsApp, IconCheck } from "@/components/Icons";
import { waLink } from "@/lib/utils";

const HOURS: [string, string][] = [
  ["Monday – Friday", "9:00 AM – 7:00 PM"],
  ["Saturday", "9:00 AM – 7:00 PM"],
  ["Sunday", "By appointment"],
];

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <div className="mb-12 text-center">
        <div className="display mb-2 text-xs tracking-[0.4em] text-[#ff2a1f]">Contact</div>
        <h1 className="display text-5xl sm:text-6xl">Find The Workshop</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/55">Call, WhatsApp, or just show up. The coffee is free — the dyno isn&apos;t.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {/* map embed */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Unity Motorsports Performance location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.60%2C12.90%2C77.72%2C12.98&layer=mapnik&marker=12.94%2C77.66"
                className="h-72 w-full grayscale-[0.4] contrast-[1.05]"
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#101012] p-5">
                <div className="display mb-2 text-sm tracking-[0.25em] text-[#ff2a1f]">Address</div>
                <p className="text-sm leading-relaxed text-white/70">
                  Unit 7, Speedway Industrial Estate,<br />Outer Ring Road,<br />Bengaluru 560103
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#101012] p-5">
                <div className="display mb-2 text-sm tracking-[0.25em] text-[#ff2a1f]">Reach Us</div>
                <p className="space-y-1 text-sm text-white/70">
                  <a href="tel:+919876543210" className="block hover:text-white">+91 98765 43210</a>
                  <a href="mailto:pit@unitytuner.in" className="block hover:text-white">pit@unitytuner.in</a>
                </p>
                <a
                  href={waLink("Hi Unity Tuner! Quick question…")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#25D366]/15 px-3 py-2 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/25"
                >
                  <IconWhatsApp width={18} height={18} /> Chat on WhatsApp
                </a>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#101012] p-5 sm:col-span-2">
                <div className="display mb-3 text-sm tracking-[0.25em] text-[#ff2a1f]">Business Hours</div>
                <dl className="space-y-1.5 text-sm">
                  {HOURS.map(([d, h]) => (
                    <div key={d} className="flex justify-between">
                      <dt className="text-white/55">{d}</dt>
                      <dd className="font-semibold text-white/85">{h}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </div>

        {/* form */}
        <Reveal delay={0.15}>
          <div className="rounded-2xl border border-white/10 bg-[#101012] p-6 sm:p-8">
            <h2 className="display mb-6 text-2xl">Send A Message</h2>
            {sent ? (
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 py-16 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600/15 text-green-400">
                  <IconCheck width={30} height={30} />
                </span>
                <div className="display text-2xl">Message Received</div>
                <p className="max-w-xs text-sm text-white/55">We reply within a few working hours. If it&apos;s urgent, WhatsApp is faster.</p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "contact", ...form }),
                  }).catch(() => {});
                  setSent(true);
                }}
                className="space-y-4"
              >
                <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" aria-label="Name" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" aria-label="Email" />
                  <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" aria-label="Phone" />
                </div>
                <textarea required rows={6} placeholder="Tell us about your car and what you're after…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field" aria-label="Message" />
                <button type="submit" className="btn btn-primary w-full rounded-md px-6 py-3.5 text-sm">Send Message</button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
