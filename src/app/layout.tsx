import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CustomCursor from "@/components/CustomCursor";
import PageLoader from "@/components/PageLoader";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-rajdhani", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Unity Tuner — Unity Motorsports Performance | ECU Tuning, Dyno & Performance Parts",
    template: "%s | Unity Tuner",
  },
  description:
    "Precision ECU remapping, dyno tuning, turbo upgrades and performance parts. Dyno-proven power for BMW, Audi, VW, Toyota, Hyundai, Tata, Mahindra & more. Bengaluru.",
  keywords: ["car tuning", "ECU remap", "dyno tuning", "stage 1", "performance parts", "turbo upgrade", "Bengaluru"],
  openGraph: {
    title: "Unity Tuner — Unleash Your Machine",
    description: "Precision ECU tuning, performance parts & dyno-proven power.",
    type: "website",
    locale: "en_IN",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Unity Motorsports Performance",
  alternateName: "Unity Tuner",
  description: "Professional ECU tuning, dyno calibration and performance parts.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 7, Speedway Industrial Estate, Outer Ring Road",
    addressLocality: "Bengaluru",
    postalCode: "560103",
    addressCountry: "IN",
  },
  telephone: "+91-98765-43210",
  openingHours: "Mo-Sa 09:00-19:00",
  priceRange: "₹₹₹",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "870" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${rajdhani.variable}`}>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <PageLoader />
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
