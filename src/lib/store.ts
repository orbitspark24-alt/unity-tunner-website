"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, Product } from "./products";

/** A cart line snapshots the product at add-time, so the cart stays valid even
 *  if the admin later edits or removes the product from the catalogue. */
export interface CartLine {
  slug: string;
  qty: number;
  name: string;
  price: number;
  brand: string;
  category: Category;
  hue: number;
  imageUrl?: string;
}

export type CartSnapshot = Omit<CartLine, "qty">;

export function toSnapshot(p: Product): CartSnapshot {
  return { slug: p.slug, name: p.name, price: p.price, brand: p.brand, category: p.category, hue: p.hue, imageUrl: p.imageUrl };
}

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  drawerOpen: boolean;
  addToCart: (item: CartSnapshot, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      drawerOpen: false,
      addToCart: (item, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((l) => l.slug === item.slug);
          const cart = existing
            ? s.cart.map((l) => (l.slug === item.slug ? { ...l, ...item, qty: l.qty + qty } : l))
            : [...s.cart, { ...item, qty }];
          return { cart };
        }),
      removeFromCart: (slug) => set((s) => ({ cart: s.cart.filter((l) => l.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((l) => l.slug !== slug) : s.cart.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((w) => w !== slug) : [...s.wishlist, slug],
        })),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "unity-shop",
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist }),
    }
  )
);

export function cartCount(cart: CartLine[]) {
  return cart.reduce((n, l) => n + l.qty, 0);
}

export function cartTotal(cart: CartLine[]) {
  return cart.reduce((sum, l) => sum + l.price * l.qty, 0);
}
