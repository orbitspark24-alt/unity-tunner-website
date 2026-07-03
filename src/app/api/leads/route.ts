import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLeads, makeId, type Lead } from "@/lib/db";

export const dynamic = "force-dynamic";

// Public lead capture — contact form & newsletter signups.
export async function POST(req: NextRequest) {
  const { type, name, email, phone, message } = await req.json();
  if (!email || !String(email).includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  const lead: Lead = {
    id: makeId("LEAD"),
    type: type === "newsletter" ? "newsletter" : "contact",
    name: (name ?? "").slice(0, 80),
    email: String(email).slice(0, 120),
    phone: (phone ?? "").slice(0, 20),
    message: (message ?? "").slice(0, 1000),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const leads = await getLeads();
  leads.push(lead);
  await saveLeads(leads);
  return NextResponse.json(lead, { status: 201 });
}
