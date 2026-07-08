import { NextRequest, NextResponse } from "next/server";
import { getBuilds, saveBuilds } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import type { Build } from "@/lib/builds";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json()) as Partial<Build>;
  const builds = await getBuilds();
  const i = builds.findIndex((b) => b.id === id);
  if (i === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated: Build = { ...builds[i], ...body, id };
  if (!body.tall) delete updated.tall;
  if (!body.image) delete updated.image;
  if (Array.isArray(body.mods)) updated.mods = body.mods.filter(Boolean);
  builds[i] = updated;
  await saveBuilds(builds);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const builds = await getBuilds();
  const next = builds.filter((b) => b.id !== id);
  if (next.length === builds.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await saveBuilds(next);
  return NextResponse.json({ ok: true });
}
