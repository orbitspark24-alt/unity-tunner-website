import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders, getProducts, makeId, type Order } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

/** Full order list contains customer PII — admin console only. */
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await getOrders();
  return NextResponse.json(orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items, shipping, payment } = body ?? {};

  if (!Array.isArray(items) || items.length === 0 || !shipping?.name || !shipping?.address || !shipping?.phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // price server-side from the live catalogue — never trust client totals
  const catalogue = await getProducts();
  const lines = items
    .map((i: { slug: string; qty: number }) => {
      const p = catalogue.find((x) => x.slug === i.slug);
      return p ? { slug: p.slug, name: p.name, qty: Math.max(1, i.qty | 0), price: p.price } : null;
    })
    .filter(Boolean) as Order["items"];

  if (lines.length === 0) return NextResponse.json({ error: "No valid items" }, { status: 400 });

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipCost = shipping.method === "express" ? 499 : subtotal >= 10000 ? 0 : 199;

  const order: Order = {
    id: makeId("ORD"),
    items: lines,
    total: subtotal + shipCost,
    shipping,
    payment: payment ?? "razorpay",
    status: "paid",
    createdAt: new Date().toISOString(),
  };

  const orders = await getOrders();
  orders.push(order);
  await saveOrders(orders);

  return NextResponse.json(order, { status: 201 });
}
