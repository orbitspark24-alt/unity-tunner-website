import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const STATUSES = ["paid", "packed", "shipped", "delivered", "refunded"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const orders = await getOrders();
  const o = orders.find((x) => x.id === id);
  if (!o) return NextResponse.json({ error: "Not found" }, { status: 404 });
  o.status = status;
  await saveOrders(orders);
  return NextResponse.json(o);
}
