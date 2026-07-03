import { NextRequest, NextResponse } from "next/server";
import { getMedia, saveMedia, makeId, type Media } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const media = (await getMedia()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, url } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
  // guard against runaway data-URL payloads (~4MB)
  if (url.length > 5_500_000) return NextResponse.json({ error: "Image too large (max ~4MB)" }, { status: 413 });

  const item: Media = { id: makeId("IMG"), name: name || "image", url, createdAt: new Date().toISOString() };
  const media = await getMedia();
  media.push(item);
  await saveMedia(media);
  return NextResponse.json(item, { status: 201 });
}
