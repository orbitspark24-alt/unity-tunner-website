"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { IconSearch, IconX } from "@/components/Icons";
import { PRODUCTS, CATEGORIES, CAR_MAKES, type Product } from "@/lib/products";
import { inr, cx } from "@/lib/utils";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => Array.isArray(data) && setProducts(data))
      .catch(() => {});
  }, []);

  const BRANDS = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const MAX_PRICE = useMemo(() => Math.max(...products.map((p) => p.price), 1000), [products]);

  const [q, setQ] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [make, setMake] = useState("");
  const [makeQuery, setMakeQuery] = useState("");
  const [makeOpen, setMakeOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const searchRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (q.trim().length < 2) return [];
    const t = q.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)).slice(0, 5);
  }, [q, products]);

  const makes = useMemo(
    () => CAR_MAKES.filter((m) => m.toLowerCase().includes(makeQuery.toLowerCase())),
    [makeQuery]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (q.trim().length >= 2) {
        const t = q.toLowerCase();
        if (!p.name.toLowerCase().includes(t) && !p.brand.toLowerCase().includes(t) && !p.category.toLowerCase().includes(t)) return false;
      }
      if (category && p.category !== category) return false;
      if (make && !p.fitment.includes(make) && !p.fitment.includes("Universal")) return false;
      if (brand && p.brand !== brand) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [products, q, category, make, brand, maxPrice, inStockOnly, sort]);

  const activeFilters = [category, make, brand, inStockOnly ? "In stock" : "", maxPrice < MAX_PRICE ? `Under ${inr(maxPrice)}` : ""].filter(Boolean);

  const reset = () => {
    setCategory(""); setMake(""); setMakeQuery(""); setBrand(""); setMaxPrice(MAX_PRICE); setInStockOnly(false); setQ("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <div className="mb-10 text-center">
        <div className="display mb-2 text-xs tracking-[0.4em] text-[#ff2a1f]">The Marketplace</div>
        <h1 className="display text-5xl sm:text-6xl">Performance Parts</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/55">
          Every part here has been on our dyno or on our own cars. If it doesn&apos;t make power, we don&apos;t sell it.
        </p>
      </div>

      {/* search with instant suggestions */}
      <div className="relative mx-auto mb-8 max-w-xl">
        <IconSearch width={18} height={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          ref={searchRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setShowSuggest(true); }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          placeholder="Search parts, brands, categories…"
          className="field pl-11"
          aria-label="Search products"
        />
        <AnimatePresence>
          {showSuggest && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-white/12 bg-[#131316] shadow-xl shadow-black/60"
            >
              {suggestions.map((p) => (
                <li key={p.slug}>
                  <Link href={`/shop/${p.slug}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-[#e10600]/10">
                    <span className="truncate">{p.name}</span>
                    <span className="display shrink-0 text-[#ff2a1f]">{inr(p.price)}</span>
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* filters */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h3 className="display mb-3 text-sm tracking-[0.2em] text-white/80">Category</h3>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {["", ...CATEGORIES].map((c) => (
                <button
                  key={c || "all"}
                  onClick={() => setCategory(c)}
                  className={cx(
                    "rounded-md px-3 py-1.5 text-left text-sm transition-colors lg:w-full",
                    category === c ? "bg-[#e10600]/15 font-semibold text-[#ff2a1f]" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {c || "All Parts"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <h3 className="display mb-3 text-sm tracking-[0.2em] text-white/80">Your Car</h3>
            <input
              value={make || makeQuery}
              onChange={(e) => { setMake(""); setMakeQuery(e.target.value); setMakeOpen(true); }}
              onFocus={() => setMakeOpen(true)}
              onBlur={() => setTimeout(() => setMakeOpen(false), 150)}
              placeholder="Search make — BMW, Tata…"
              className="field text-sm"
              aria-label="Filter by car make"
            />
            {makeOpen && makes.length > 0 && !make && (
              <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-white/12 bg-[#131316] shadow-xl">
                {makes.map((m) => (
                  <li key={m}>
                    <button
                      className="w-full px-3.5 py-2.5 text-left text-sm hover:bg-[#e10600]/10"
                      onMouseDown={() => { setMake(m); setMakeQuery(""); setMakeOpen(false); }}
                    >
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {make && (
              <button onClick={() => setMake("")} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e10600]/15 px-3 py-1 text-xs font-semibold text-[#ff2a1f]">
                {make} <IconX width={12} height={12} />
              </button>
            )}
          </div>

          <div>
            <h3 className="display mb-3 text-sm tracking-[0.2em] text-white/80">Brand</h3>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="field text-sm" aria-label="Filter by brand">
              <option value="">All brands</option>
              {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <h3 className="display mb-3 text-sm tracking-[0.2em] text-white/80">
              Max Price <span className="text-[#ff2a1f]">{inr(maxPrice)}</span>
            </h3>
            <input
              type="range"
              min={500}
              max={MAX_PRICE}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              className="w-full"
              aria-label="Maximum price"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-white/70">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            In stock only
          </label>

          {activeFilters.length > 0 && (
            <button onClick={reset} className="text-xs font-semibold uppercase tracking-widest text-[#ff2a1f] hover:underline">
              Clear all filters ({activeFilters.length})
            </button>
          )}
        </aside>

        {/* grid */}
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-sm text-white/50">{filtered.length} part{filtered.length === 1 ? "" : "s"}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="field w-auto text-sm" aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#101012] py-20 text-center text-white/50">
              <p className="display text-2xl text-white/70">No parts match</p>
              <p className="mt-2 text-sm">Loosen the filters — or ask us, we source almost anything.</p>
              <button onClick={reset} className="btn btn-outline mt-6 rounded-md px-6 py-2.5 text-sm">Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
              {filtered.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
