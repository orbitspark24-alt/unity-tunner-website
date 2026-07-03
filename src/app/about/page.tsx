import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us — The Crew Behind The Power",
  description: "Unity Motorsports Performance: 10+ years, 1,200+ cars, one AWD dyno and a crew that tunes with data.",
};

export default function AboutPage() {
  return <AboutContent />;
}
