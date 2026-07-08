export interface Build {
  id: string;
  title: string;
  car: string;
  category: "German" | "JDM" | "Indian" | "Diesel SUV";
  stage: string;
  stockHp: number;
  tunedHp: number;
  stockNm: number;
  tunedNm: number;
  mods: string[];
  quote: string;
  hue: number;
  image?: string; // car photo URL; falls back to the hue gradient + silhouette when empty
  tall?: boolean;
}

export const BUILDS: Build[] = [
  {
    id: "b1",
    title: "Project Blitz",
    car: "BMW M340i",
    category: "German",
    stage: "Stage 2",
    stockHp: 382, tunedHp: 512, stockNm: 500, tunedNm: 680,
    mods: ["Stage 2 flash", "Catted downpipe", "ApexCharge carbon intake", "ChillCharge intercooler"],
    quote: "It pulls like it's angry at physics now.",
    hue: 210, tall: true,
  },
  {
    id: "b2",
    title: "The Daily Weapon",
    car: "VW Virtus GT 1.5 TSI",
    category: "German",
    stage: "Stage 2",
    stockHp: 150, tunedHp: 218, stockNm: 250, tunedNm: 345,
    mods: ["Stage 2 remap", "TrackLine downpipe", "Unity CAI", "FMIC kit"],
    quote: "A family sedan that embarrasses hot hatches.",
    hue: 0,
  },
  {
    id: "b3",
    title: "Redline Fortuner",
    car: "Toyota Fortuner 2.8D",
    category: "Diesel SUV",
    stage: "Stage 1",
    stockHp: 204, tunedHp: 249, stockNm: 500, tunedNm: 605,
    mods: ["Stage 1 diesel remap", "Panel filter", "Transmission adaptation"],
    quote: "Zero smoke, all shove. Tows like a train.",
    hue: 30,
  },
  {
    id: "b4",
    title: "Civic Type-Almost",
    car: "Honda Civic RS Turbo",
    category: "JDM",
    stage: "Stage 2",
    stockHp: 178, tunedHp: 241, stockNm: 240, tunedNm: 330,
    mods: ["Stage 2 flash", "Axle-back exhaust", "Cold air intake", "Street coilovers"],
    quote: "The VTEC memes write themselves.",
    hue: 350, tall: true,
  },
  {
    id: "b5",
    title: "Baby Rocket",
    car: "Hyundai i20 N Line",
    category: "Indian",
    stage: "Stage 1+",
    stockHp: 120, tunedHp: 165, stockNm: 172, tunedNm: 250,
    mods: ["Stage 1+ remap", "RaceFlow cone intake", "StopMax pads"],
    quote: "1.0L turbo, 165 horses. Nobody sees it coming.",
    hue: 200,
  },
  {
    id: "b6",
    title: "Harrier Dark Edition+",
    car: "Tata Harrier 2.0D",
    category: "Indian",
    stage: "Stage 1",
    stockHp: 170, tunedHp: 208, stockNm: 350, tunedNm: 430,
    mods: ["Stage 1 remap", "FMIC upgrade", "Gearbox tune"],
    quote: "The Kryotec finally breathes.",
    hue: 260,
  },
  {
    id: "b7",
    title: "Silver Arrow",
    car: "Mercedes-AMG C43",
    category: "German",
    stage: "Stage 1",
    stockHp: 390, tunedHp: 462, stockNm: 520, tunedNm: 640,
    mods: ["Stage 1 flash", "Valved cat-back", "TCU tune"],
    quote: "Gap-a-C63 spec. Almost.",
    hue: 180,
  },
  {
    id: "b8",
    title: "Thar on Boost",
    car: "Mahindra Thar 2.0 Petrol",
    category: "Diesel SUV",
    stage: "Stage 1",
    stockHp: 150, tunedHp: 192, stockNm: 320, tunedNm: 400,
    mods: ["Stage 1 remap", "Free-flow exhaust", "Catch can"],
    quote: "Rock crawler by day, drag toy by night.",
    hue: 120, tall: true,
  },
];

export interface Testimonial {
  name: string;
  car: string;
  text: string;
  rating: number;
  hue: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rahul Sharma",
    car: "Bangalore — ECU Remapping",
    text: "I got ECU remapping done for my car and the improvement is clearly noticeable. The pickup has increased and the driving experience feels much smoother now.",
    rating: 5, hue: 0,
  },
  {
    name: "Amit Verma",
    car: "Delhi — Performance Tuning",
    text: "Very happy with the service. The technicians really understand how performance tuning works. My car now has better acceleration and the engine feels much more responsive.",
    rating: 5, hue: 210,
  },
  {
    name: "Rohit Gupta",
    car: "Mumbai — ECU Remapping",
    text: "If you are looking to improve your car's performance, this is the right place. After the tuning, the power delivery is much stronger and the vehicle drives much better on highways.",
    rating: 5, hue: 30,
  },
  {
    name: "Ishaan Kapoor",
    car: "Hyundai i20 N Line — Stage 1+",
    text: "They spent 40 minutes explaining the map before touching the car. Zero upsell pressure. The little 1.0T is an absolute riot now.",
    rating: 5, hue: 200,
  },
  {
    name: "Sneha Patil",
    car: "Skoda Octavia vRS — Stage 2",
    text: "Full bolt-ons + Stage 2 done in one visit. The logging follow-up a week later caught a boost leak from an old clamp — they fixed it free. That's aftercare.",
    rating: 5, hue: 120,
  },
];

export const PARTNER_BRANDS = [
  "Garrett Motion", "Bosch Motorsport", "AEM", "Bilstein", "Brembo",
  "Akrapovič", "K&N", "HKS", "Öhlins", "Michelin", "Motul", "NGK",
];
