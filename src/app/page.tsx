"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import DynoChart from "@/components/DynoChart";
import PowerEstimator from "@/components/PowerEstimator";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import ProductCard from "@/components/ProductCard";
import { SERVICE_ICONS, IconChevron } from "@/components/Icons";
import { PRODUCTS, type Product } from "@/lib/products";
import { BUILDS } from "@/lib/builds";
import { cx } from "@/lib/utils";

const STATS = [
  { to: 1200, suffix: "+", label: "Cars Tuned" },
  { to: 180, prefix: "+", suffix: "", label: "Avg HP Gained" },
  { to: 10, suffix: "+", label: "Years Experience" },
  { to: 4.9, suffix: "★", decimals: 1, label: "Customer Rating" },
];

const SERVICES_PREVIEW = [
  { icon: "ecu", name: "ECU Remapping", desc: "Stage 1 / 2 / 3 custom calibrations, written in-house on our dyno.", href: "/services" },
  { icon: "dyno", name: "Dyno Tuning", desc: "AWD dyno pulls with printed HP/torque graphs and AFR logging.", href: "/services" },
  { icon: "turbo", name: "Turbo Upgrades", desc: "Hybrid and big-frame turbo installs with full supporting hardware.", href: "/services" },
  { icon: "exhaust", name: "Exhaust Systems", desc: "Valved cat-backs and downpipes, TIG-welded in our fab shop.", href: "/services" },
  { icon: "intake", name: "Intake & Filters", desc: "Cold air intakes and high-flow filters that actually flow.", href: "/services" },
  { icon: "fab", name: "Custom Fabrication", desc: "One-off piping, mounts and manifolds. If it fits, we build it.", href: "/services" },
] as const;

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-12 text-center">
      <div className="display mb-3 text-xs tracking-[0.4em] text-[#ff2a1f]">{kicker}</div>
      <h2 className="display text-4xl sm:text-5xl">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-sm text-white/55 sm:text-base">{sub}</p>}
    </Reveal>
  );
}

export default function HomePage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => Array.isArray(data) && setProducts(data))
      .catch(() => {});
  }, []);

  const featured = products.filter((p) => p.badge).slice(0, 8);

  const scrollCarousel = (dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <>
      <Hero />

      {/* stats bar */}
      <section className="relative border-y border-white/10 bg-[#0d0d0f]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center">
              <div className="display text-4xl text-white sm:text-5xl">
                <Counter to={s.to} prefix={s.prefix ?? ""} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/45">{s.label}</div>
            </Reveal>
          ))}
        </div>
        <div className="metal-line absolute inset-x-0 top-0" />
      </section>

      {/* services preview */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionTitle
          kicker="What We Do"
          title="Built For Speed"
          sub="Six disciplines, one obsession: verified, repeatable, reliable power."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_PREVIEW.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <Reveal key={s.name} delay={(i % 3) * 0.1}>
                <Link
                  href={s.href}
                  className="card-lift card-sweep group block h-full rounded-xl border border-white/10 bg-[#101012] p-6"
                >
                  <div className="mb-4 inline-flex rounded-lg border border-[#e10600]/30 bg-[#e10600]/10 p-3 text-[#ff2a1f] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon width={26} height={26} />
                  </div>
                  <h3 className="display text-xl">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#ff2a1f] opacity-0 transition-opacity group-hover:opacity-100">
                    Explore <IconChevron width={12} height={12} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* featured products carousel */}
      <section className="border-y border-white/10 bg-[#0d0d0f] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <Reveal>
              <div className="display mb-3 text-xs tracking-[0.4em] text-[#ff2a1f]">The Marketplace</div>
              <h2 className="display text-4xl sm:text-5xl">Featured Hardware</h2>
            </Reveal>
            <div className="hidden gap-2 sm:flex">
              <button onClick={() => scrollCarousel(-1)} aria-label="Scroll products left" className="rounded-md border border-white/15 p-3 text-white/70 hover:border-[#e10600] hover:text-[#ff2a1f]">
                <IconChevron width={16} height={16} className="rotate-180" />
              </button>
              <button onClick={() => scrollCarousel(1)} aria-label="Scroll products right" className="rounded-md border border-white/15 p-3 text-white/70 hover:border-[#e10600] hover:text-[#ff2a1f]">
                <IconChevron width={16} height={16} />
              </button>
            </div>
          </div>
          <div ref={carouselRef} className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
            {featured.map((p, i) => (
              <div key={p.slug} className="w-[280px] shrink-0 snap-start">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/shop" className="btn btn-outline rounded-md px-8 py-3 text-sm">
              Browse All Parts
            </Link>
          </Reveal>
        </div>
      </section>

      {/* dyno graph */}
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <SectionTitle
          kicker="Proof, Not Promises"
          title="Stock vs Unity Tuned"
          sub="Every tune leaves with a before/after dyno sheet. Here's a typical Stage 2 result."
        />
        <Reveal>
          <DynoChart />
        </Reveal>
      </section>

      {/* power estimator — interactive customer tool */}
      <section className="border-t border-white/10 bg-[#0d0d0f]">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
          <SectionTitle
            kicker="Try It Yourself"
            title="What Will Your Car Make?"
            sub="Pick your car and a stage. See the power waiting under the hood — then book it in."
          />
          <Reveal>
            <PowerEstimator />
          </Reveal>
        </div>
      </section>

      {/* testimonials */}
      <section className="border-y border-white/10 bg-[#0d0d0f] px-4 py-24 sm:px-6">
        <SectionTitle kicker="Word On The Street" title="Drivers Talk" />
        <TestimonialsSlider />
      </section>

      {/* builds gallery grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionTitle kicker="Recent Builds" title="From The Workshop" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {BUILDS.slice(0, 8).map((b, i) => (
            <Reveal key={b.id} delay={(i % 4) * 0.08}>
              <Link
                href="/gallery"
                className="group relative block aspect-square overflow-hidden rounded-lg border border-white/10"
              >
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                  style={{ background: `radial-gradient(circle at 30% 25%, hsl(${b.hue} 55% 26%), #0c0c0e 75%)` }}
                />
                <CarSilhouette className="absolute inset-x-0 bottom-6 mx-auto w-3/4 text-white/85 transition-transform duration-500 group-hover:-translate-x-1 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <div className="display text-sm sm:text-base">{b.title}</div>
                  <div className="text-[11px] text-white/55">{b.car}</div>
                  <div className="mt-1 text-[11px] font-bold text-[#ff2a1f]">
                    {b.stockHp} → {b.tunedHp} HP
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="carbon-bg absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.16),transparent_65%)]" />
        <motion.div
          aria-hidden
          initial={{ x: "-110%" }}
          whileInView={{ x: "110%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute top-1/2 h-0.5 w-full bg-gradient-to-r from-transparent via-[#e10600] to-transparent"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6">
          <Reveal>
            <h2 className="display text-5xl sm:text-6xl">
              Ready For <span className="text-[#e10600]">More Power?</span>
            </h2>
            <p className="mt-4 text-base text-white/60">
              Dyno slots fill up fast. Lock yours in — the machine you drive home won&apos;t be the one you drove in.
            </p>
            <Link href="/booking" className="btn btn-primary mt-8 inline-flex rounded-md px-10 py-4 text-base">
              Book Your Slot Today
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function CarSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 80" className={cx("h-auto", className)} fill="currentColor" aria-hidden>
      <path d="M14 58c-4 0-6-3-6-7 0-5 3-8 8-9 6-1 14-2 22-7 10-6 20-13 34-15 16-2 38-2 52 2 10 3 16 9 24 12 12 2 30 3 42 7 8 3 12 7 12 12 0 3-2 5-5 5h-9a17 17 0 0 0-33 0h-80a17 17 0 0 0-33 0H14z" />
      <circle cx="59" cy="58" r="12" fill="#0a0a0a" stroke="currentColor" strokeWidth="5" />
      <circle cx="187" cy="58" r="12" fill="#0a0a0a" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}
