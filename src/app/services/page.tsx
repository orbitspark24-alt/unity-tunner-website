import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services — ECU Remaps, Dyno Tuning & Installs",
  description: "Stage 1/2/3 ECU remapping, dyno sessions, turbo installs and custom tunes. Compare stages, see expected gains, book online.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
