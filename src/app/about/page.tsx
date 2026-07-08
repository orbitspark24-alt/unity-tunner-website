import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us — The Crew Behind The Power",
  description: "Unity Performance: 19+ years, 30,000+ vehicles optimized, and a crew that calibrates with data — Ranchi.",
};

export default function AboutPage() {
  return <AboutContent />;
}
