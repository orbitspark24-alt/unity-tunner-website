import { NextRequest, NextResponse } from "next/server";
import { getBuilds, saveBuilds, makeId } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import type { Build } from "@/lib/builds";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getBuilds());
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<Build>;
  if (!body.title || !body.car || !body.category) {
    return NextResponse.json({ error: "title, car and category are required" }, { status: 400 });
  }
  const build: Build = {
    id: makeId("BLD"),
    title: body.title,
    car: body.car,
    category: body.category,
    stage: body.stage || "Stage 1",
    stockHp: +(body.stockHp ?? 0),
    tunedHp: +(body.tunedHp ?? 0),
    stockNm: +(body.stockNm ?? 0),
    tunedNm: +(body.tunedNm ?? 0),
    mods: Array.isArray(body.mods) ? body.mods.filter(Boolean) : [],
    quote: body.quote || "",
    hue: +(body.hue ?? 0),
    ...(body.image ? { image: body.image } : {}),
    ...(body.tall ? { tall: true } : {}),
  };
  const builds = await getBuilds();
  builds.push(build);
  await saveBuilds(builds);
  return NextResponse.json(build, { status: 201 });
}
