import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLeads } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();
  if (!["new", "contacted", "closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const leads = await getLeads();
  const l = leads.find((x) => x.id === id);
  if (!l) return NextResponse.json({ error: "Not found" }, { status: 404 });
  l.status = status;
  await saveLeads(leads);
  return NextResponse.json(l);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const leads = await getLeads();
  await saveLeads(leads.filter((x) => x.id !== id));
  return NextResponse.json({ ok: true });
}
