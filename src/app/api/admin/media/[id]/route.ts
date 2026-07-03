import { NextRequest, NextResponse } from "next/server";
import { getMedia, saveMedia } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const media = await getMedia();
  await saveMedia(media.filter((m) => m.id !== id));
  return NextResponse.json({ ok: true });
}
