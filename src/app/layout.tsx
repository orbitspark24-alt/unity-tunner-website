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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unityperformance.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Unity Performance — ECU Remapping, Chiptuning & EGR Solutions | Ranchi",
    template: "%s | Unity Performance",
  },
  description:
    "Bespoke ECU remapping, chiptuning, EGR and transmission optimization. Motorsport-grade engineering for your daily drive — 19+ years, 30,000+ vehicles optimized. Ranchi, Jharkhand.",
  keywords: ["ECU remapping", "chiptuning", "EGR solution", "transmission optimization", "car tuning", "performance tuning", "Ranchi"],
  icons: { icon: "/favicon.png" },
  alternates: { canonical: "./" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Unity Performance — Unlock Your Vehicle's True Performance",
    description: "Bespoke ECU calibration that bridges stock performance and racing-grade efficiency.",
    type: "website",
    locale: "en_IN",
    siteName: "Unity Performance",
    images: [{ url: "/unity-performance-logo.jpeg", width: 1285, height: 431, alt: "Unity Performance logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unity Performance — Unlock Your Vehicle's True Performance",
    description: "Bespoke ECU calibration that bridges stock performance and racing-grade efficiency.",
    images: ["/unity-performance-logo.jpeg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Unity Performance",
  description: "Professional ECU remapping, chiptuning, EGR and transmission optimization.",
  email: "support@unityperformance.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "L-12, Argora Housing Colony, Argora",
    addressLocality: "Ranchi",
    addressRegion: "Jharkhand",
    postalCode: "834002",
    addressCountry: "IN",
  },
  telephone: "+91-87096-47229",
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
