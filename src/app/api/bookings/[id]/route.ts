import { NextRequest, NextResponse } from "next/server";
import { getBookings, saveBookings } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  if (!["confirmed", "completed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const bookings = await getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  booking.status = status;
  await saveBookings(bookings);
  return NextResponse.json(booking);
}
