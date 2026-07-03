"use client";

import { usePathname } from "next/navigation";
import { IconWhatsApp } from "./Icons";
import { waLink } from "@/lib/utils";

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={waLink("Hi Unity Tuner! I'd like to know more about tuning my car.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="wa-ring fixed bottom-5 right-5 z-[150] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/50 transition-transform hover:scale-110"
    >
      <IconWhatsApp />
    </a>
  );
}
