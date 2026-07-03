import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact — Find The Workshop",
  description: "Unity Motorsports Performance, Bengaluru. Call, WhatsApp or drop by — the coffee is free, the dyno isn't.",
};

export default function ContactPage() {
  return <ContactContent />;
}
