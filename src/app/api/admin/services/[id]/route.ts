import { NextRequest, NextResponse } from "next/server";
import { getServices, saveServices } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import type { TuneService } from "@/lib/services";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json()) as Partial<TuneService>;
  const services = await getServices();
  const i = services.findIndex((s) => s.id === id);
  if (i === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated: TuneService = { ...services[i], ...body, id };
  if (Array.isArray(body.bullets)) updated.bullets = body.bullets.filter(Boolean);
  services[i] = updated;
  await saveServices(services);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const services = await getServices();
  const next = services.filter((s) => s.id !== id);
  if (next.length === services.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await saveServices(next);
  return NextResponse.json({ ok: true });
}
