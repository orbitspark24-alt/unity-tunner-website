import type { Metadata } from "next";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "Marketplace — Performance Parts & Upgrades",
  description:
    "Dyno-proven performance parts: intakes, exhausts, intercoolers, brakes and more. Genuine parts with fitment checks, shipped across India.",
};

export default function ShopPage() {
  return <ShopContent />;
}
