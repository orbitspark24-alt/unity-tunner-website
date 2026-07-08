import { NextRequest, NextResponse } from "next/server";
import { getBookings, saveBookings, getBlockedDates, getServices, makeId, SLOT_TIMES, type Booking } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

/** Full booking list contains customer PII — admin console only. */
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookings = await getBookings();
  return NextResponse.json(bookings.sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serviceId, car, date, slot, contact, deposit } = body ?? {};

  if (!serviceId || !date || !slot || !car?.make || !car?.model || !contact?.name || !contact?.phone || !contact?.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  // name + price come from the live services catalogue — never trust client values
  const service = (await getServices()).find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }
  if (!SLOT_TIMES.includes(slot)) {
    return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
  }
  if (date < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ error: "Cannot book a past date" }, { status: 400 });
  }

  const blocked = await getBlockedDates();
  if (blocked.includes(date)) {
    return NextResponse.json({ error: "This date is unavailable" }, { status: 409 });
  }

  const bookings = await getBookings();
  const clash = bookings.some((b) => b.date === date && b.slot === slot && b.status !== "cancelled");
  if (clash) {
    return NextResponse.json({ error: "Slot already booked — pick another" }, { status: 409 });
  }

  const booking: Booking = {
    id: makeId("UT"),
    serviceId,
    serviceName: service.name,
    price: service.price,
    car,
    date,
    slot,
    contact,
    deposit: !!deposit,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  await saveBookings(bookings);

  return NextResponse.json(booking, { status: 201 });
}
