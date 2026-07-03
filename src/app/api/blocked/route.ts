import { NextRequest, NextResponse } from "next/server";
import { getBlockedDates, saveBlockedDates } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await getBlockedDates());
}

/** Toggle a date's blocked status (admin). */
export async function POST(req: NextRequest) {
  const { date } = await req.json();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date=YYYY-MM-DD required" }, { status: 400 });
  }
  let blocked = await getBlockedDates();
  blocked = blocked.includes(date) ? blocked.filter((d) => d !== date) : [...blocked, date];
  await saveBlockedDates(blocked.sort());
  return NextResponse.json(blocked);
}
