import { CAR_MAKES, CAR_MODELS, type CarMake } from "./products";

export type EngineType = "petrol-turbo" | "diesel" | "na" | "electric";

export interface BaseSpec {
  hp: number;
  nm: number;
  engine: EngineType;
}

/**
 * Stock power figures per model (manufacturer-claimed, approximate). Drives the
 * customer-facing Power Gain Estimator. Keyed by the same model strings used in
 * CAR_MODELS so the make/model dropdowns stay in sync.
 */
export const BASE_SPECS: Record<string, BaseSpec> = {
  // BMW
  "330i (G20)": { hp: 258, nm: 400, engine: "petrol-turbo" },
  "M340i": { hp: 382, nm: 500, engine: "petrol-turbo" },
  "X1 sDrive20i": { hp: 204, nm: 300, engine: "petrol-turbo" },
  "320d": { hp: 190, nm: 400, engine: "diesel" },
  "M2 (G87)": { hp: 460, nm: 550, engine: "petrol-turbo" },
  // Audi
  "A4 45 TFSI": { hp: 265, nm: 370, engine: "petrol-turbo" },
  "S5 Sportback": { hp: 354, nm: 500, engine: "petrol-turbo" },
  "Q3 40 TFSI": { hp: 190, nm: 320, engine: "petrol-turbo" },
  "RS5": { hp: 450, nm: 600, engine: "petrol-turbo" },
  "A6 45 TFSI": { hp: 265, nm: 370, engine: "petrol-turbo" },
  // Volkswagen
  "Polo GT TSI": { hp: 110, nm: 175, engine: "petrol-turbo" },
  "Virtus GT": { hp: 150, nm: 250, engine: "petrol-turbo" },
  "Taigun 1.5 TSI": { hp: 150, nm: 250, engine: "petrol-turbo" },
  Tiguan: { hp: 190, nm: 320, engine: "petrol-turbo" },
  "Golf GTI": { hp: 245, nm: 370, engine: "petrol-turbo" },
  // Mercedes-Benz
  C300: { hp: 258, nm: 400, engine: "petrol-turbo" },
  A200: { hp: 163, nm: 250, engine: "petrol-turbo" },
  "GLA 35 AMG": { hp: 306, nm: 400, engine: "petrol-turbo" },
  "C43 AMG": { hp: 390, nm: 520, engine: "petrol-turbo" },
  E350: { hp: 299, nm: 400, engine: "petrol-turbo" },
  // Skoda
  "Octavia vRS": { hp: 245, nm: 370, engine: "petrol-turbo" },
  "Slavia 1.5 TSI": { hp: 150, nm: 250, engine: "petrol-turbo" },
  "Kushaq 1.5 TSI": { hp: 150, nm: 250, engine: "petrol-turbo" },
  Superb: { hp: 190, nm: 320, engine: "petrol-turbo" },
  Kodiaq: { hp: 190, nm: 320, engine: "petrol-turbo" },
  // Toyota
  "Fortuner 2.8": { hp: 204, nm: 500, engine: "diesel" },
  "Innova Hycross": { hp: 186, nm: 188, engine: "na" },
  Hilux: { hp: 204, nm: 500, engine: "diesel" },
  Camry: { hp: 218, nm: 221, engine: "na" },
  "GR Supra": { hp: 382, nm: 500, engine: "petrol-turbo" },
  // Honda
  "City 1.5": { hp: 121, nm: 145, engine: "na" },
  "Civic RS": { hp: 178, nm: 240, engine: "petrol-turbo" },
  Elevate: { hp: 121, nm: 145, engine: "na" },
  Accord: { hp: 190, nm: 240, engine: "na" },
  "City Hybrid": { hp: 126, nm: 253, engine: "na" },
  // Hyundai
  "i20 N Line": { hp: 120, nm: 172, engine: "petrol-turbo" },
  "Verna 1.5 Turbo": { hp: 160, nm: 253, engine: "petrol-turbo" },
  "Creta 1.5": { hp: 115, nm: 144, engine: "na" },
  Tucson: { hp: 156, nm: 192, engine: "na" },
  "Venue Turbo": { hp: 120, nm: 172, engine: "petrol-turbo" },
  // Kia
  "Seltos GT Line": { hp: 160, nm: 253, engine: "petrol-turbo" },
  "Sonet Turbo": { hp: 120, nm: 172, engine: "petrol-turbo" },
  Carnival: { hp: 200, nm: 440, engine: "diesel" },
  EV6: { hp: 229, nm: 350, engine: "electric" },
  "Seltos Diesel": { hp: 116, nm: 250, engine: "diesel" },
  // Maruti Suzuki
  Swift: { hp: 82, nm: 113, engine: "na" },
  Baleno: { hp: 90, nm: 113, engine: "na" },
  "Fronx Turbo": { hp: 100, nm: 148, engine: "petrol-turbo" },
  Jimny: { hp: 105, nm: 134, engine: "na" },
  "Grand Vitara": { hp: 103, nm: 137, engine: "na" },
  // Tata
  Harrier: { hp: 170, nm: 350, engine: "diesel" },
  Safari: { hp: 170, nm: 350, engine: "diesel" },
  "Nexon Turbo": { hp: 120, nm: 170, engine: "petrol-turbo" },
  "Altroz DCA": { hp: 110, nm: 140, engine: "petrol-turbo" },
  Curvv: { hp: 125, nm: 225, engine: "petrol-turbo" },
  // Mahindra
  XUV700: { hp: 200, nm: 380, engine: "petrol-turbo" },
  "Thar 2.0 Petrol": { hp: 150, nm: 320, engine: "petrol-turbo" },
  "Scorpio-N": { hp: 175, nm: 400, engine: "diesel" },
  "XUV 3XO": { hp: 130, nm: 230, engine: "petrol-turbo" },
  "BE 6": { hp: 282, nm: 380, engine: "electric" },
};

// per-engine gain multipliers by stage (index 0 = Stage 1)
const GAINS: Record<EngineType, { hp: number[]; nm: number[] }> = {
  "petrol-turbo": { hp: [1.28, 1.45, 1.8], nm: [1.3, 1.48, 1.85] },
  diesel: { hp: [1.22, 1.34, 1.5], nm: [1.28, 1.42, 1.62] },
  na: { hp: [1.05, 1.09, 1.16], nm: [1.05, 1.09, 1.16] },
  electric: { hp: [1.08, 1.12, 1.16], nm: [1.1, 1.15, 1.2] },
};

export const ENGINE_LABEL: Record<EngineType, string> = {
  "petrol-turbo": "Turbo Petrol",
  diesel: "Turbo Diesel",
  na: "Naturally Aspirated",
  electric: "Electric",
};

export const ENGINE_NOTE: Record<EngineType, string> = {
  "petrol-turbo": "Turbo petrol engines respond brilliantly to a remap — the biggest gains per rupee in tuning.",
  diesel: "Diesels love a tune. Expect a big torque wave low down, smoke-free, with mileage that often improves.",
  na: "Naturally aspirated engines gain little from software alone. These figures assume supporting bolt-ons (intake, exhaust, headers) — book a chat to plan a build.",
  electric: "EVs get a software power unlock rather than a fuel tune. Gains are modest but instant. Ask us what's possible for your pack.",
};

export interface EstimateResult {
  spec: BaseSpec;
  stockHp: number;
  stockNm: number;
  tunedHp: number;
  tunedNm: number;
  hpGain: number;
  nmGain: number;
  hpPct: number;
}

export function estimate(model: string, stageIndex: 0 | 1 | 2): EstimateResult | null {
  const spec = BASE_SPECS[model];
  if (!spec) return null;
  const g = GAINS[spec.engine];
  const tunedHp = Math.round(spec.hp * g.hp[stageIndex]);
  const tunedNm = Math.round((spec.nm * g.nm[stageIndex]) / 5) * 5;
  return {
    spec,
    stockHp: spec.hp,
    stockNm: spec.nm,
    tunedHp,
    tunedNm,
    hpGain: tunedHp - spec.hp,
    nmGain: tunedNm - spec.nm,
    hpPct: Math.round(((tunedHp - spec.hp) / spec.hp) * 100),
  };
}

export const STAGE_LABELS = ["Stage 1", "Stage 2", "Stage 3"] as const;

// only makes/models we have base specs for (all of them, but keep this defensive)
export const ESTIMATOR_MAKES = CAR_MAKES.filter((m) => CAR_MODELS[m].some((mo) => BASE_SPECS[mo]));
export function modelsFor(make: CarMake) {
  return CAR_MODELS[make].filter((m) => BASE_SPECS[m]);
}
