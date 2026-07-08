/**
 * Site-wide editable content: hero copy, stats, testimonials, FAQ and workshop
 * contact details. Defaults mirror what was previously hardcoded across the
 * components; the admin console edits a settings.json overlay via /admin/site.
 */
import { SERVICE_FAQ } from "./services";

export interface SiteStat {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
  label: string;
}

export interface SiteTestimonial {
  name: string;
  car: string;
  text: string;
  rating: number;
  hue: number;
}

export interface SiteFaq {
  q: string;
  a: string;
}

export interface SiteSettings {
  hero: {
    badge: string;
    title1: string;
    title2: string; // rendered in red
    subtitle: string;
  };
  stats: SiteStat[]; // home stats bar
  aboutStats: SiteStat[]; // about page stats band
  testimonials: SiteTestimonial[];
  faq: SiteFaq[];
  workshop: {
    address1: string;
    address2: string;
    phone: string;
    email: string;
    hours: { days: string; time: string }[];
  };
}

export const DEFAULT_SITE: SiteSettings = {
  hero: {
    badge: "19+ Years · 30,000+ Vehicles Optimized",
    title1: "Unlock Your Vehicle's",
    title2: "True Performance",
    subtitle:
      "Experience high-level motorsport engineering for your daily drive. Our custom ECU calibrations unlock hidden potential safely and precisely.",
  },
  stats: [
    { value: 30000, prefix: "", suffix: "+", decimals: 0, label: "Vehicles Optimized" },
    { value: 30, prefix: "+", suffix: "%", decimals: 0, label: "Avg HP Increase" },
    { value: 19, prefix: "", suffix: "+", decimals: 0, label: "Years Experience" },
    { value: 4.9, prefix: "", suffix: "★", decimals: 1, label: "Customer Rating" },
  ],
  aboutStats: [
    { value: 30000, prefix: "", suffix: "+", decimals: 0, label: "Vehicles Optimized" },
    { value: 19, prefix: "", suffix: "+", decimals: 0, label: "Years Experience" },
    { value: 30, prefix: "", suffix: "%", decimals: 0, label: "Avg HP Increase" },
  ],
  testimonials: [
    {
      name: "Rahul Sharma",
      car: "Bangalore — ECU Remapping",
      text: "I got ECU remapping done for my car and the improvement is clearly noticeable. The pickup has increased and the driving experience feels much smoother now.",
      rating: 5,
      hue: 0,
    },
    {
      name: "Amit Verma",
      car: "Delhi — Performance Tuning",
      text: "Very happy with the service. The technicians really understand how performance tuning works. My car now has better acceleration and the engine feels much more responsive.",
      rating: 5,
      hue: 210,
    },
    {
      name: "Rohit Gupta",
      car: "Mumbai — ECU Remapping",
      text: "If you are looking to improve your car's performance, this is the right place. After the tuning, the power delivery is much stronger and the vehicle drives much better on highways.",
      rating: 5,
      hue: 30,
    },
    {
      name: "Ishaan Kapoor",
      car: "Hyundai i20 N Line — Stage 1+",
      text: "They spent 40 minutes explaining the map before touching the car. Zero upsell pressure. The little 1.0T is an absolute riot now.",
      rating: 5,
      hue: 200,
    },
    {
      name: "Sneha Patil",
      car: "Skoda Octavia vRS — Stage 2",
      text: "Full bolt-ons + Stage 2 done in one visit. The logging follow-up a week later caught a boost leak from an old clamp — they fixed it free. That's aftercare.",
      rating: 5,
      hue: 120,
    },
  ],
  workshop: {
    address1: "L-12, Argora Housing Colony,",
    address2: "Argora, Ranchi, Jharkhand 834002",
    phone: "+91 87096 47229",
    email: "support@unityperformance.in",
    hours: [
      { days: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
      { days: "Saturday", time: "9:00 AM – 7:00 PM" },
      { days: "Sunday", time: "By appointment" },
    ],
  },
  faq: SERVICE_FAQ.map(([q, a]) => ({ q, a })),
};
