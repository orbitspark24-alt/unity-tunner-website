export interface TuneService {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string; // human readable
  durationHours: number;
  gain: string;
  icon: "ecu" | "dyno" | "turbo" | "exhaust" | "intake" | "fab" | "health";
  bullets: string[];
}

export const BOOKING_SERVICES: TuneService[] = [
  {
    id: "stage1",
    name: "Stage 1 Remap",
    tagline: "The biggest bang-for-buck upgrade in tuning.",
    price: 34999,
    duration: "3–4 hrs",
    durationHours: 4,
    gain: "+25–35% HP",
    icon: "ecu",
    bullets: ["Full diagnostic scan", "Custom in-house calibration", "Before/after dyno runs", "30-day revision window"],
  },
  {
    id: "stage2",
    name: "Stage 2 Remap",
    tagline: "For cars with downpipe + intake hardware.",
    price: 49999,
    duration: "4–6 hrs",
    durationHours: 6,
    gain: "+40–55% HP",
    icon: "ecu",
    bullets: ["Requires downpipe + intake", "Hardware inspection included", "Custom dyno calibration", "Logging & fine-tune session"],
  },
  {
    id: "stage3",
    name: "Stage 3 Build & Tune",
    tagline: "Hybrid turbo, fuelling, the works. Serious power.",
    price: 99999,
    duration: "2–3 days",
    durationHours: 8,
    gain: "+70–100% HP",
    icon: "turbo",
    bullets: ["Hybrid/upgraded turbo install", "Fuel system upgrades", "Multi-session dyno calibration", "1,000 km follow-up check"],
  },
  {
    id: "dyno",
    name: "Dyno Session",
    tagline: "Three pulls, real numbers, printed graphs.",
    price: 7999,
    duration: "1 hr",
    durationHours: 1,
    gain: "Baseline truth",
    icon: "dyno",
    bullets: ["3x power pulls on AWD dyno", "HP/torque graphs printed", "AFR & boost logging", "Health verdict from our tuner"],
  },
  {
    id: "turbo-install",
    name: "Turbo Install",
    tagline: "Upgrade or replacement, fitted and calibrated.",
    price: 24999,
    duration: "1–2 days",
    durationHours: 8,
    gain: "Labour + tune",
    icon: "turbo",
    bullets: ["Turbo supplied or customer's own", "New gaskets, oil & coolant lines", "Break-in procedure", "Post-install calibration"],
  },
  {
    id: "custom",
    name: "Custom Tune",
    tagline: "E85, big turbo, standalone — built on our dyno.",
    price: 74999,
    duration: "Full day",
    durationHours: 8,
    gain: "Whatever it takes",
    icon: "fab",
    bullets: ["Full-day dyno booking", "Custom map from scratch", "Any fuel, any hardware", "Datalog pack included"],
  },
  {
    id: "transmission",
    name: "Transmission Optimization",
    tagline: "Faster shifts, higher torque limits, smoother delivery.",
    price: 19999,
    duration: "3–4 hrs",
    durationHours: 4,
    gain: "Sharper shifts",
    icon: "fab",
    bullets: ["TCU calibration & adaptation", "Raised torque limiters", "Shift speed & logic tuning", "Road-test verification"],
  },
  {
    id: "egr",
    name: "EGR Solution",
    tagline: "Cleaner intake, sharper response, healthier engine.",
    price: 14999,
    duration: "2–3 hrs",
    durationHours: 3,
    gain: "Restored response",
    icon: "exhaust",
    bullets: ["Full EGR system diagnosis", "Software-side optimization", "Intake carbon assessment", "Emissions-compliant setup"],
  },
  {
    id: "health",
    name: "Performance Health Check",
    tagline: "Know your engine before you push it.",
    price: 3999,
    duration: "1–2 hrs",
    durationHours: 2,
    gain: "Peace of mind",
    icon: "health",
    bullets: ["Compression & leak-down test", "Boost leak smoke test", "Full OBD deep scan", "Written condition report"],
  },
];

export interface StageRow {
  label: string;
  s1: string;
  s2: string;
  s3: string;
}

export const STAGE_COMPARISON: StageRow[] = [
  { label: "Power gain", s1: "+25–35%", s2: "+40–55%", s3: "+70–100%" },
  { label: "Torque gain", s1: "+30–40%", s2: "+45–60%", s3: "+75–110%" },
  { label: "Hardware needed", s1: "None (stock car)", s2: "Downpipe + intake", s3: "Hybrid turbo, fuelling, clutch" },
  { label: "Fuel requirement", s1: "95 octane", s2: "97/100 octane", s3: "100 octane / E85 blend" },
  { label: "Dyno time", s1: "3–4 hours", s2: "4–6 hours", s3: "2–3 days" },
  { label: "Price", s1: "₹34,999", s2: "₹49,999", s3: "from ₹99,999" },
  { label: "Warranty on tune", s1: "Lifetime file", s2: "Lifetime file", s3: "Lifetime file" },
];

export const SERVICE_FAQ: [string, string][] = [
  [
    "Will a remap damage my engine?",
    "Not when it's done properly. Every Unity calibration keeps torque within the tolerance of your gearbox and drivetrain, retains all factory protection strategies (knock control, EGT protection, limp modes), and is verified with logging on our dyno before the car leaves. We tune for longevity first, peak numbers second.",
  ],
  [
    "Does tuning void my warranty?",
    "A flash remap can be detected by the dealer and may affect powertrain warranty claims. If your car is under warranty, ask us about the PowerBox piggyback option — it's removable in 15 minutes and leaves no trace in the ECU.",
  ],
  [
    "What fuel do I need to run after a tune?",
    "Stage 1 is calibrated for 95 octane, which is available at most pumps. Stage 2 and above we calibrate for 97/100 octane. Run lower octane than your map expects and the ECU will pull timing — you lose power, not the engine, but don't make a habit of it.",
  ],
  [
    "How long does a Stage 1 take?",
    "Book a morning slot and you'll drive out the same afternoon. The process: baseline dyno pull, ECU read, calibration, flash, verification pulls, road test with logging. 3–4 hours total.",
  ],
  [
    "Can you tune diesels?",
    "Absolutely — common-rail diesels respond brilliantly. A Fortuner 2.8 picks up around 45 HP and 100 Nm on Stage 1. Smoke-free, because we tune fuelling with airflow, not against it.",
  ],
  [
    "Do you offer a money-back guarantee?",
    "If we don't hit the quoted gains on our dyno, you don't pay for the tune. Dyno session cost still applies. In 10+ years we've refunded exactly zero customers.",
  ],
];
