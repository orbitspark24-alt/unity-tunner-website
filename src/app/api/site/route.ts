import { NextResponse } from "next/server";
import { getSettings, getBuilds, getServices } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Public site content: settings (hero/stats/testimonials/workshop), builds and booking services. */
export async function GET() {
  const [settings, builds, services] = await Promise.all([getSettings(), getBuilds(), getServices()]);
  return NextResponse.json({ settings, builds, services });
}
