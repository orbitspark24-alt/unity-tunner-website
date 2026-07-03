import { NextRequest, NextResponse } from "next/server";
import { getReviews, saveReviews } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { approved } = await req.json();
  const reviews = await getReviews();
  const r = reviews.find((x) => x.id === id);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  r.approved = !!approved;
  await saveReviews(reviews);
  return NextResponse.json(r);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const reviews = await getReviews();
  const next = reviews.filter((x) => x.id !== id);
  await saveReviews(next);
  return NextResponse.json({ ok: true });
}
