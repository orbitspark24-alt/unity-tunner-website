import { NextRequest, NextResponse } from "next/server";
import { getBookings, getBlockedDates, SLOT_TIMES } from "@/lib/db";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date=YYYY-MM-DD required" }, { status: 400 });
  }

  const [bookings, blocked] = await Promise.all([getBookings(), getBlockedDates()]);
  const today = new Date().toISOString().slice(0, 10);
  const nowHm = new Date().toTimeString().slice(0, 5);
  const dateBlocked = blocked.includes(date) || date < today;

  const taken = new Set(
    bookings.filter((b) => b.date === date && b.status !== "cancelled").map((b) => b.slot)
  );

  const slots = SLOT_TIMES.map((time) => ({
    time,
    available: !dateBlocked && !taken.has(time) && !(date === today && time <= nowHm),
  }));

  return NextResponse.json({ date, blocked: dateBlocked, slots });
}
