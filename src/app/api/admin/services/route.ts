import { NextRequest, NextResponse } from "next/server";
import { getServices, saveServices } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import type { TuneService } from "@/lib/services";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "service";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getServices());
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<TuneService>;
  if (!body.name || body.price == null) {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 });
  }
  const services = await getServices();
  let id = slugify(body.name);
  while (services.some((s) => s.id === id)) id += "-2";
  const service: TuneService = {
    id,
    name: body.name,
    tagline: body.tagline || "",
    price: +body.price,
    duration: body.duration || "1–2 hrs",
    durationHours: +(body.durationHours ?? 2),
    gain: body.gain || "",
    icon: body.icon || "ecu",
    bullets: Array.isArray(body.bullets) ? body.bullets.filter(Boolean) : [],
  };
  services.push(service);
  await saveServices(services);
  return NextResponse.json(service, { status: 201 });
}
