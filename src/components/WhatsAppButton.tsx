"use client";

import { usePathname } from "next/navigation";
import { IconWhatsApp } from "./Icons";
import { waLink } from "@/lib/utils";

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={waLink("Hi Unity Performance! I'd like to know more about tuning my car.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-ring group fixed bottom-5 right-5 z-[150] flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] text-white shadow-lg shadow-black/50 transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(37,211,102,0.5)]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center">
        <IconWhatsApp />
      </span>
      {/* label expands on hover (desktop); icon-only on small screens */}
      <span className="hidden max-w-0 whitespace-nowrap pr-0 text-sm font-semibold transition-all duration-300 group-hover:max-w-[160px] group-hover:pr-5 sm:inline">
        Chat with us
      </span>
    </a>
  );
}
