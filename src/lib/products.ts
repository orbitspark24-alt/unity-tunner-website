export type Category =
  | "Air Filters"
  | "Intakes"
  | "Exhausts"
  | "Turbochargers"
  | "Intercoolers"
  | "ECU / Tuning Boxes"
  | "Suspension"
  | "Brakes"
  | "Wheels"
  | "Merchandise";

export const CATEGORIES: Category[] = [
  "Air Filters",
  "Intakes",
  "Exhausts",
  "Turbochargers",
  "Intercoolers",
  "ECU / Tuning Boxes",
  "Suspension",
  "Brakes",
  "Wheels",
  "Merchandise",
];

export const CAR_MAKES = [
  "BMW",
  "Audi",
  "Volkswagen",
  "Mercedes-Benz",
  "Skoda",
  "Toyota",
  "Honda",
  "Hyundai",
  "Kia",
  "Maruti Suzuki",
  "Tata",
  "Mahindra",
] as const;

export type CarMake = (typeof CAR_MAKES)[number];

export const CAR_MODELS: Record<CarMake, string[]> = {
  BMW: ["330i (G20)", "M340i", "X1 sDrive20i", "320d", "M2 (G87)"],
  Audi: ["A4 45 TFSI", "S5 Sportback", "Q3 40 TFSI", "RS5", "A6 45 TFSI"],
  Volkswagen: ["Polo GT TSI", "Virtus GT", "Taigun 1.5 TSI", "Tiguan", "Golf GTI"],
  "Mercedes-Benz": ["C300", "A200", "GLA 35 AMG", "C43 AMG", "E350"],
  Skoda: ["Octavia vRS", "Slavia 1.5 TSI", "Kushaq 1.5 TSI", "Superb", "Kodiaq"],
  Toyota: ["Fortuner 2.8", "Innova Hycross", "Hilux", "Camry", "GR Supra"],
  Honda: ["City 1.5", "Civic RS", "Elevate", "Accord", "City Hybrid"],
  Hyundai: ["i20 N Line", "Verna 1.5 Turbo", "Creta 1.5", "Tucson", "Venue Turbo"],
  Kia: ["Seltos GT Line", "Sonet Turbo", "Carnival", "EV6", "Seltos Diesel"],
  "Maruti Suzuki": ["Swift", "Baleno", "Fronx Turbo", "Jimny", "Grand Vitara"],
  Tata: ["Harrier", "Safari", "Nexon Turbo", "Altroz DCA", "Curvv"],
  Mahindra: ["XUV700", "Thar 2.0 Petrol", "Scorpio-N", "XUV 3XO", "BE 6"],
};

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  badge?: "New Arrival" | "Best Seller" | "";
  inStock: boolean;
  fitment: string[]; // car makes, or ["Universal"]
  hue: number; // accent hue for generated product art
  imageUrl?: string; // optional real photo — overrides generated art when set
  short: string;
  description: string;
  specs: [string, string][];
}

export const PRODUCTS: Product[] = [
  {
    slug: "unity-stage1-panel-filter",
    name: "Unity HighFlow Panel Air Filter",
    brand: "Unity Performance",
    category: "Air Filters",
    price: 4499,
    mrp: 5999,
    rating: 4.8,
    reviews: 214,
    badge: "Best Seller",
    inStock: true,
    fitment: ["Volkswagen", "Skoda", "Hyundai", "Kia"],
    hue: 0,
    short: "Washable cotton-gauze drop-in filter. +4–6 HP, lifetime service life.",
    description:
      "Direct OEM-replacement panel filter with 4-layer oiled cotton gauze media. Flows up to 38% more air than a paper element while filtering down to 5 microns. Wash, re-oil, repeat — it outlives the car.",
    specs: [
      ["Media", "4-layer oiled cotton gauze"],
      ["Flow gain", "+38% vs OEM paper"],
      ["Filtration", "5 micron"],
      ["Service", "Washable / reusable"],
      ["Warranty", "10 years"],
    ],
  },
  {
    slug: "raceflow-cone-filter",
    name: "RaceFlow 3.5\" Open Cone Filter",
    brand: "RaceFlow",
    category: "Air Filters",
    price: 6999,
    mrp: 8499,
    rating: 4.6,
    reviews: 98,
    inStock: true,
    fitment: ["Universal"],
    hue: 210,
    short: "Universal 89mm inlet cone with velocity stack. Induction noise included.",
    description:
      "High-flow open cone with an integrated velocity stack for smooth intake charge. Pairs with any 3.5\" intake pipe. Expect a proper turbo whoosh on every lift-off.",
    specs: [
      ["Inlet", "89mm (3.5\")"],
      ["Height", "170mm"],
      ["Media", "Dual-layer synthetic"],
      ["Mount", "Worm-drive clamp"],
    ],
  },
  {
    slug: "unity-cold-air-intake-tsi",
    name: "Unity Cold Air Intake — 1.5 TSI",
    brand: "Unity Performance",
    category: "Intakes",
    price: 24999,
    mrp: 28999,
    rating: 4.9,
    reviews: 156,
    badge: "Best Seller",
    inStock: true,
    fitment: ["Volkswagen", "Skoda"],
    hue: 200,
    short: "Full CAI kit for EA211 EVO. +9 HP / +14 Nm dyno proven.",
    description:
      "Complete sealed-box cold air intake for the 1.5 TSI EA211 EVO (Virtus GT, Slavia, Kushaq, Taigun). Roto-moulded airbox, silicone couplers, heat shield and high-flow cone. Dyno proven +9 HP / +14 Nm on stock tune, more with Stage 1.",
    specs: [
      ["Engine", "1.5 TSI EA211 EVO"],
      ["Gain (stock)", "+9 HP / +14 Nm"],
      ["Pipe", "76mm aluminium, powder-coated"],
      ["Filter", "Washable cotton gauze"],
      ["Install", "60–90 min, bolt-on"],
    ],
  },
  {
    slug: "apexcharge-carbon-intake-b58",
    name: "ApexCharge Carbon Intake — B58",
    brand: "ApexCharge",
    category: "Intakes",
    price: 62999,
    mrp: 71999,
    rating: 4.9,
    reviews: 67,
    badge: "New Arrival",
    inStock: true,
    fitment: ["BMW", "Toyota"],
    hue: 220,
    short: "Full carbon airbox for BMW B58 / GR Supra. +12 HP up top.",
    description:
      "Pre-preg carbon fibre closed airbox for the B58 (M340i, GR Supra). Larger filter area, smoothed inlet path and heat isolation keep IATs down on back-to-back pulls.",
    specs: [
      ["Engine", "BMW B58 3.0T"],
      ["Gain", "+12 HP @ high RPM"],
      ["Material", "Pre-preg carbon fibre"],
      ["IAT drop", "-11°C vs stock (tested)"],
    ],
  },
  {
    slug: "unity-catback-valved-exhaust",
    name: "Unity Valved Cat-Back Exhaust",
    brand: "Unity Performance",
    category: "Exhausts",
    price: 89999,
    mrp: 104999,
    rating: 4.9,
    reviews: 189,
    badge: "Best Seller",
    inStock: true,
    fitment: ["BMW", "Audi", "Mercedes-Benz", "Volkswagen"],
    hue: 20,
    short: "T304 stainless valved cat-back with remote. Quiet to feral in one tap.",
    description:
      "Mandrel-bent T304 stainless cat-back with electronically controlled valves. Comfort mode stays cabin-quiet; Race mode opens straight-through pipes. Remote + app control included. TIG-welded in-house, lifetime weld warranty.",
    specs: [
      ["Material", "T304 stainless, TIG welded"],
      ["Piping", "76mm mandrel bent"],
      ["Valves", "Electronic, remote + app"],
      ["Tips", "114mm burnt titanium"],
      ["Weight", "-6.2 kg vs OEM"],
    ],
  },
  {
    slug: "trackline-downpipe-200cell",
    name: "TrackLine Downpipe — 200 Cell",
    brand: "TrackLine",
    category: "Exhausts",
    price: 38999,
    mrp: 44999,
    rating: 4.7,
    reviews: 122,
    inStock: true,
    fitment: ["Volkswagen", "Skoda", "Audi", "Hyundai"],
    hue: 30,
    short: "High-flow 200-cell catted downpipe. Unlocks Stage 2.",
    description:
      "3\" catted downpipe with 200-cell HJS-style sports cat. The single biggest restriction on a turbo car, removed. Required hardware for Stage 2 tunes; keeps emissions equipment in place.",
    specs: [
      ["Diameter", "76mm (3\")"],
      ["Cat", "200 cell sports cat"],
      ["Flanges", "CNC machined"],
      ["Fits", "1.0/1.5 TSI, 1.5 T-GDI"],
    ],
  },
  {
    slug: "unity-hybrid-turbo-td04",
    name: "Unity Hybrid Turbo — TD04 Upgrade",
    brand: "Unity Performance",
    category: "Turbochargers",
    price: 124999,
    mrp: 139999,
    rating: 4.8,
    reviews: 41,
    inStock: true,
    fitment: ["Volkswagen", "Skoda", "Hyundai", "Kia"],
    hue: 0,
    short: "Billet-wheel hybrid turbo, drop-in fitment. 250+ HP capable.",
    description:
      "Our in-house hybrid: billet 11-blade compressor wheel in a ported OEM frame. Drop-in fitment, stock-like spool, flows for 250+ HP. Balanced to 0.1 g·mm on a Schenck machine. Core exchange available.",
    specs: [
      ["Compressor", "Billet 11-blade, 49.5mm"],
      ["Capable", "250+ HP"],
      ["Spool", "+200 rpm vs stock (near identical)"],
      ["Balance", "0.1 g·mm dynamic"],
      ["Warranty", "1 year unlimited km"],
    ],
  },
  {
    slug: "gtx-ball-bearing-turbo",
    name: "GTX3076R Ball Bearing Turbo",
    brand: "Garrett Motion",
    category: "Turbochargers",
    price: 189999,
    mrp: 209999,
    rating: 5.0,
    reviews: 18,
    badge: "New Arrival",
    inStock: false,
    fitment: ["Universal"],
    hue: 350,
    short: "The big-power classic. 640 HP capable, dual ball bearing CHRA.",
    description:
      "Genuine Garrett GTX3076R Gen II with dual ball bearing CHRA and forged billet compressor wheel. For dedicated builds running standalone or custom ECU calibration. We supply, fit and tune.",
    specs: [
      ["Rated", "640 HP"],
      ["CHRA", "Dual ball bearing"],
      ["Compressor", "76mm forged billet"],
      ["A/R options", "0.83 / 1.01"],
    ],
  },
  {
    slug: "unity-front-mount-intercooler",
    name: "Unity Front-Mount Intercooler Kit",
    brand: "Unity Performance",
    category: "Intercoolers",
    price: 54999,
    mrp: 62999,
    rating: 4.8,
    reviews: 88,
    badge: "Best Seller",
    inStock: true,
    fitment: ["Volkswagen", "Skoda", "Hyundai", "Kia", "Tata"],
    hue: 190,
    short: "Bar-and-plate FMIC, 2x core volume. Kills heat soak for good.",
    description:
      "Bar-and-plate front mount with twice the core volume of stock. Holds IATs within 8°C of ambient on repeated pulls where the OEM cooler heat-soaks by 30°C+. Full piping and silicone kit included.",
    specs: [
      ["Core", "Bar & plate, 550x300x65mm"],
      ["Volume", "2.1x OEM"],
      ["End tanks", "Cast aluminium, TIG welded"],
      ["Pressure drop", "< 0.9 psi @ 25 psi"],
    ],
  },
  {
    slug: "chillcharge-race-intercooler",
    name: "ChillCharge Race Core Intercooler",
    brand: "ChillCharge",
    category: "Intercoolers",
    price: 74999,
    mrp: 82999,
    rating: 4.7,
    reviews: 29,
    inStock: true,
    fitment: ["BMW", "Audi", "Mercedes-Benz"],
    hue: 180,
    short: "Stepped race core for German turbo platforms. 700 HP rated.",
    description:
      "Stepped bar-and-plate core engineered for B48/B58, EA888 and M264 platforms. Rated to 700 HP with cast end tanks and full CAD-designed airflow guides.",
    specs: [
      ["Rated", "700 HP"],
      ["Core", "Stepped bar & plate"],
      ["Fitment", "B48/B58, EA888, M264"],
    ],
  },
  {
    slug: "unity-stage1-ecu-flash",
    name: "Unity Stage 1 ECU Flash (Bench)",
    brand: "Unity Performance",
    category: "ECU / Tuning Boxes",
    price: 34999,
    mrp: 39999,
    rating: 5.0,
    reviews: 342,
    badge: "Best Seller",
    inStock: true,
    fitment: ["Volkswagen", "Skoda", "Audi", "BMW", "Mercedes-Benz", "Hyundai", "Kia"],
    hue: 0,
    short: "Our signature Stage 1 calibration. +25–35% power, dyno verified.",
    description:
      "In-house Stage 1 calibration written on our AWD dyno — not a downloaded file. Boost, ignition, fuelling and torque management reworked for Indian fuel and heat. Includes before/after dyno sheets and 30-day revision window.",
    specs: [
      ["Gain", "+25–35% HP / torque"],
      ["Method", "Bench / OBD flash"],
      ["Fuel", "Optimised for 95+ octane"],
      ["Includes", "Before/after dyno runs"],
      ["Support", "30-day free revisions"],
    ],
  },
  {
    slug: "powerbox-plug-play-diesel",
    name: "PowerBox Plug & Play — Diesel",
    brand: "PowerBox",
    category: "ECU / Tuning Boxes",
    price: 28999,
    mrp: 32999,
    rating: 4.5,
    reviews: 176,
    inStock: true,
    fitment: ["Toyota", "Tata", "Mahindra", "Hyundai", "Kia"],
    hue: 40,
    short: "Piggyback tuning box for common-rail diesels. +28 HP / +60 Nm.",
    description:
      "Plug-and-play piggyback module for common-rail diesels (Fortuner, Harrier, Scorpio-N, XUV700). Multi-map control from your phone, fully removable with zero ECU trace. Warranty-friendly power.",
    specs: [
      ["Gain", "+28 HP / +60 Nm (typ.)"],
      ["Install", "15 min, plug & play"],
      ["Control", "Bluetooth app, 7 maps"],
      ["Removal", "Zero-trace"],
    ],
  },
  {
    slug: "unity-coilover-kit-street",
    name: "Unity Street Coilover Kit",
    brand: "Unity Performance",
    category: "Suspension",
    price: 78999,
    mrp: 89999,
    rating: 4.8,
    reviews: 94,
    inStock: true,
    fitment: ["Volkswagen", "Skoda", "Hyundai", "Honda", "BMW"],
    hue: 260,
    short: "32-way damping adjustable monotubes. Street comfort, track bite.",
    description:
      "Monotube coilovers with 32-way rebound adjustment and 40–65mm drop range. Valved in-house for Indian roads — compliant over broken tarmac, flat through fast corners. Camber plates included where applicable.",
    specs: [
      ["Damping", "32-way adjustable"],
      ["Drop", "40–65mm"],
      ["Springs", "Cold-wound, 8k/6k"],
      ["Warranty", "2 years"],
    ],
  },
  {
    slug: "rigidbar-front-strut-brace",
    name: "RigidBar Front Strut Brace",
    brand: "RigidBar",
    category: "Suspension",
    price: 12999,
    mrp: 14999,
    rating: 4.6,
    reviews: 61,
    inStock: true,
    fitment: ["Hyundai", "Kia", "Maruti Suzuki", "Tata"],
    hue: 280,
    short: "CNC aluminium strut tower brace. Sharper turn-in, zero flex.",
    description:
      "Two-point aluminium strut brace with CNC-machined end mounts. Noticeably sharper turn-in response and mid-corner stability on stiffer suspension setups.",
    specs: [
      ["Material", "6061-T6 aluminium"],
      ["Weight", "1.4 kg"],
      ["Install", "Bolt-on, 20 min"],
    ],
  },
  {
    slug: "unity-bigbrake-kit-6pot",
    name: "Unity Big Brake Kit — 6-Pot",
    brand: "Unity Performance",
    category: "Brakes",
    price: 149999,
    mrp: 169999,
    rating: 4.9,
    reviews: 37,
    badge: "New Arrival",
    inStock: true,
    fitment: ["BMW", "Audi", "Mercedes-Benz", "Toyota", "Mahindra"],
    hue: 0,
    short: "6-piston forged calipers, 355mm 2-piece discs. Fade is optional.",
    description:
      "Forged 6-piston calipers over 355mm two-piece floating discs with braided lines and race pads. Repeated hard stops from 160 without fade. Colour options: Unity Red, Stealth Black.",
    specs: [
      ["Calipers", "Forged 6-piston"],
      ["Discs", "355x32mm, 2-piece floating"],
      ["Lines", "Braided stainless"],
      ["Pads", "Street/track compound"],
    ],
  },
  {
    slug: "stopmax-sport-pads",
    name: "StopMax Sport Brake Pads",
    brand: "StopMax",
    category: "Brakes",
    price: 8999,
    mrp: 10499,
    rating: 4.7,
    reviews: 203,
    badge: "Best Seller",
    inStock: true,
    fitment: ["Universal"],
    hue: 15,
    short: "Fast-road compound, 0–650°C window. Bites cold, holds hot.",
    description:
      "Fast-road friction compound with instant cold bite and a 650°C fade threshold. Low dust, rotor-friendly, and quiet enough for daily use.",
    specs: [
      ["Compound", "Fast road / trackday"],
      ["Temp window", "0–650°C"],
      ["Friction", "μ 0.47 avg"],
    ],
  },
  {
    slug: "unity-forged-wheels-uf1",
    name: "Unity Forged UF-1 — 18x8.5",
    brand: "Unity Performance",
    category: "Wheels",
    price: 129999,
    mrp: 144999,
    rating: 4.9,
    reviews: 52,
    inStock: true,
    fitment: ["BMW", "Audi", "Volkswagen", "Skoda", "Honda", "Hyundai"],
    hue: 220,
    short: "Fully forged 10-spoke, 8.9 kg each. Set of 4.",
    description:
      "Our flagship fully-forged 10-spoke in 18x8.5 ET42. At 8.9 kg per corner you shed nearly 3 kg of unsprung mass per wheel vs cast OEM. Set of 4 with hub rings and titanium-finish bolts.",
    specs: [
      ["Size", "18x8.5 ET42, 5x112 / 5x120"],
      ["Weight", "8.9 kg per wheel"],
      ["Construction", "6000-series forged"],
      ["Load rating", "690 kg"],
      ["Finish", "Gunmetal / Gloss black"],
    ],
  },
  {
    slug: "flowform-fs2-wheels",
    name: "FlowForm FS-2 — 17x7.5",
    brand: "FlowForm",
    category: "Wheels",
    price: 69999,
    mrp: 79999,
    rating: 4.6,
    reviews: 84,
    inStock: true,
    fitment: ["Hyundai", "Kia", "Maruti Suzuki", "Tata", "Honda", "Volkswagen"],
    hue: 240,
    short: "Flow-formed twin-5-spoke, 9.6 kg. Big wheel look, small wheel weight.",
    description:
      "Flow-formed twin-5-spoke in 17x7.5 ET45. Flow-forming gives near-forged barrel strength at two-thirds the price. Set of 4.",
    specs: [
      ["Size", "17x7.5 ET45, 5x114.3 / 5x112"],
      ["Weight", "9.6 kg per wheel"],
      ["Construction", "Flow formed"],
    ],
  },
  {
    slug: "unity-heritage-tee",
    name: "Unity Heritage Tee — Turbo Badge",
    brand: "Unity Performance",
    category: "Merchandise",
    price: 1499,
    mrp: 1999,
    rating: 4.8,
    reviews: 267,
    badge: "Best Seller",
    inStock: true,
    fitment: ["Universal"],
    hue: 0,
    short: "240 GSM heavyweight cotton tee with the turbo badge print.",
    description:
      "Heavyweight 240 GSM combed cotton tee with the Unity turbo badge in high-density puff print. Boxy fit, pre-shrunk. Black only — obviously.",
    specs: [
      ["Fabric", "240 GSM combed cotton"],
      ["Print", "High-density puff"],
      ["Fit", "Boxy, pre-shrunk"],
      ["Sizes", "S–XXL"],
    ],
  },
  {
    slug: "unity-pitcrew-cap",
    name: "Unity Pit Crew Cap",
    brand: "Unity Performance",
    category: "Merchandise",
    price: 999,
    mrp: 1299,
    rating: 4.7,
    reviews: 143,
    inStock: true,
    fitment: ["Universal"],
    hue: 350,
    short: "Structured 6-panel cap, embroidered badge, curved brim.",
    description:
      "Structured 6-panel cap with 3D-embroidered Unity badge and red under-brim. Snapback closure, one size.",
    specs: [
      ["Panels", "6-panel structured"],
      ["Logo", "3D embroidery"],
      ["Closure", "Snapback"],
    ],
  },
  {
    slug: "unity-keytag-brake-disc",
    name: "Brake Disc Keytag — Machined",
    brand: "Unity Performance",
    category: "Merchandise",
    price: 799,
    mrp: 999,
    rating: 4.9,
    reviews: 312,
    badge: "New Arrival",
    inStock: true,
    fitment: ["Universal"],
    hue: 210,
    short: "CNC-machined mini brake disc keytag. Spins like the real thing.",
    description:
      "A CNC-machined, drilled and slotted mini brake disc that actually spins on its hub. Anodised red hat, stainless ring. The desk toy that ends meetings.",
    specs: [
      ["Material", "Stainless + anodised alu"],
      ["Diameter", "38mm"],
      ["Bearing", "Free-spinning hub"],
    ],
  },
  {
    slug: "boostgauge-52-digital",
    name: "Unity 52mm Digital Boost Gauge",
    brand: "Unity Performance",
    category: "ECU / Tuning Boxes",
    price: 7999,
    mrp: 9499,
    rating: 4.6,
    reviews: 77,
    inStock: true,
    fitment: ["Universal"],
    hue: 0,
    short: "52mm OLED boost/vac gauge with peak recall and warning flash.",
    description:
      "52mm OLED boost gauge reading -1 to +3 bar with peak recall, adjustable over-boost warning and auto-dim. Includes sensor, tubing and A-pillar pod mount.",
    specs: [
      ["Range", "-1.0 to +3.0 bar"],
      ["Display", "OLED, auto-dim"],
      ["Extras", "Peak recall, warning flash"],
    ],
  },
  {
    slug: "unity-oil-catch-can",
    name: "Unity Baffled Oil Catch Can",
    brand: "Unity Performance",
    category: "Intakes",
    price: 9999,
    mrp: 11999,
    rating: 4.8,
    reviews: 119,
    inStock: true,
    fitment: ["Universal"],
    hue: 120,
    short: "Baffled 300ml catch can. Keeps your intake valves clean on GDI.",
    description:
      "Billet baffled catch can with bronze filter media and dipstick. Essential on direct-injection turbo engines to slow intake valve coking. Universal bracket and fittings included.",
    specs: [
      ["Capacity", "300ml"],
      ["Media", "Bronze filter + baffle"],
      ["Ports", "2x 10AN"],
      ["Drain", "Bottom valve + dipstick"],
    ],
  },
  {
    slug: "trackline-axleback-jdm",
    name: "TrackLine Axle-Back — JDM Spec",
    brand: "TrackLine",
    category: "Exhausts",
    price: 32999,
    mrp: 37999,
    rating: 4.5,
    reviews: 58,
    inStock: true,
    fitment: ["Honda", "Toyota", "Hyundai", "Maruti Suzuki"],
    hue: 45,
    short: "Straight-through axle-back with burnt tip. Crisp, not obnoxious.",
    description:
      "Straight-through axle-back muffler with perforated core and burnt stainless tip. A crisp, high tone under load that settles right down at cruise.",
    specs: [
      ["Material", "T304 stainless"],
      ["Tip", "101mm burnt finish"],
      ["Sound", "+6 dB over stock"],
    ],
  },
];

/** Seed catalogue = the default PRODUCTS. The live catalogue lives in the JSON
 *  store (data/products.json) and is seeded from this on first run. */
export const SEED_PRODUCTS = PRODUCTS;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function findProduct(list: Product[], slug: string) {
  return list.find((p) => p.slug === slug);
}

export function relatedProducts(p: Product, n = 4) {
  return relatedFrom(PRODUCTS, p, n);
}

export function relatedFrom(list: Product[], p: Product, n = 4) {
  return list
    .filter((x) => x.slug !== p.slug && (x.category === p.category || x.fitment.some((f) => p.fitment.includes(f))))
    .slice(0, n);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
