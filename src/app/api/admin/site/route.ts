import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import type { SiteSettings } from "@/lib/site";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as SiteSettings;
  if (!body?.hero?.title1 || !Array.isArray(body.stats) || !body.workshop?.phone) {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }
  // drop empty rows the form may leave behind
  body.stats = body.stats.filter((s) => s.label);
  body.aboutStats = (body.aboutStats ?? []).filter((s) => s.label);
  body.testimonials = (body.testimonials ?? []).filter((t) => t.name && t.text);
  body.faq = (body.faq ?? []).filter((f) => f.q && f.a);
  body.workshop.hours = (body.workshop.hours ?? []).filter((h) => h.days && h.time);
  await saveSettings(body);
  return NextResponse.json(await getSettings());
}
