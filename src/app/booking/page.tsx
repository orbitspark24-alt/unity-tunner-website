import type { Metadata } from "next";
import BookingFlow from "./BookingFlow";

export const metadata: Metadata = {
  title: "Book a Tune",
  description: "Book your ECU remap, dyno session or performance install. Pick a service, choose a slot, done.",
};

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
      <div className="mb-10 text-center">
        <div className="display mb-2 text-xs tracking-[0.4em] text-[#ff2a1f]">Booking</div>
        <h1 className="display text-5xl sm:text-6xl">Reserve Your Slot</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
          Five steps, two minutes. Your car&apos;s best day starts here.
        </p>
      </div>
      <BookingFlow />
    </div>
  );
}
