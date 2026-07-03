import { NextRequest, NextResponse } from "next/server";
import { getLeads } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const leads = (await getLeads()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(leads);
}
