// lib/salaryEstimatorData.ts
// Salary figures for the Salary Estimator. EVERY row must be traceable to a source page.
//
// How to add a row: open the source page, copy the range it shows, and record the source URL, the
// page's own "updated" date if it shows one, and the date you looked. Never type a figure from memory.
//
// Limits of this data (shown to users on screen):
//  - Ranges are what AmbitionBox publishes for that job title across all cities and a stated mix of
//    experience levels. AmbitionBox does not publish a median on these pages, so none is shown.
//  - The page snapshots we captured were dated March 2025 or showed no date, so they are NOT "Q1 2026".

import { RoleFamily, detectRoleFamily } from "@/lib/skillMatch";

export interface SalaryRow {
  /** Role families this row is the closest researched title for. */
  families: RoleFamily[];
  /** Exact job title on the source page. */
  sourceTitle: string;
  /** Annual range in lakh rupees per year (LPA), India-wide. */
  min: number;
  max: number;
  /** Experience mix behind the range, as the source states it. */
  experience: string;
  /** Number of salary reports the source states, if shown. */
  reports?: string;
  /** Range for Bengaluru from the same source, if the page lists it. */
  bengaluru?: { min: number; max: number };
  source: string;
  sourceUrl: string;
  /** Date the source page itself shows ("updated: ..."), or null if the captured text showed none. */
  sourceDate: string | null;
  /** Date this row was captured. */
  capturedOn: string;
}

export const SALARY_ROWS: SalaryRow[] = [
  {
    families: ["backend"],
    sourceTitle: "Backend Developer",
    min: 1.5,
    max: 17,
    experience: "under 1 year to 5 years",
    reports: "about 11.9k",
    bengaluru: { min: 2.0, max: 20.0 },
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/backend-developer-salary",
    sourceDate: null,
    capturedOn: "2026-11-04",
  },
  {
    families: ["data_ai"],
    sourceTitle: "Data Scientist",
    min: 3.8,
    max: 27.9,
    experience: "1 to 8 years",
    reports: "about 45.4k",
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/data-scientist-salary",
    sourceDate: "15 Mar 2025",
    capturedOn: "2026-11-04",
  },
  {
    // Note: a third-party article reports a newer AmbitionBox figure (typical range 8.8 to 9.8 LPA for
    // 2 to 6 years, updated Oct 2026). That is a narrower statistic and not comparable to a min-max range,
    // so it is not used here. Refresh this row from the live page when you can.
    families: ["devops"],
    sourceTitle: "DevOps Engineer",
    min: 3.8,
    max: 14.5,
    experience: "2 to 6 years",
    reports: "about 94.8k",
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/devops-engineer-salary",
    sourceDate: "13 Mar 2025",
    capturedOn: "2026-11-04",
  },
  {
    families: ["finance"],
    sourceTitle: "Financial Analyst",
    min: 2.1,
    max: 13,
    experience: "1 to 8 years",
    reports: "about 48.4k",
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/financial-analyst-salary",
    sourceDate: "12 Mar 2025",
    capturedOn: "2026-11-04",
  },
  {
    // The source title is "Digital Manager", not "Digital Marketing Manager". It is the closest title
    // whose range we could read, and the page text we captured showed no update date.
    families: ["marketing"],
    sourceTitle: "Digital Manager",
    min: 2.8,
    max: 30,
    experience: "2 to 14 years",
    reports: "about 352",
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/digital-manager-salary",
    sourceDate: null,
    capturedOn: "2026-11-04",
  },
];

// ---------------------------------------------------------------------------
// Cities
// ---------------------------------------------------------------------------
export type CityTier = "tier1" | "tier2";

export interface City {
  name: string;
  tier: CityTier;
}

export const CITIES: City[] = [
  { name: "Bengaluru", tier: "tier1" },
  { name: "Gurugram / Delhi NCR", tier: "tier1" },
  { name: "Hyderabad", tier: "tier1" },
  { name: "Mumbai", tier: "tier1" },
  { name: "Jaipur", tier: "tier2" },
  { name: "Indore", tier: "tier2" },
  { name: "Lucknow", tier: "tier2" },
  { name: "Chandigarh", tier: "tier2" },
  { name: "Other city", tier: "tier2" },
];

/** Project-owner assumption, not a measured figure. Shown on screen as an estimate. */
export const TIER2_FACTOR = 0.8;

// ---------------------------------------------------------------------------
// Typical minimum degree by role family (project-owner rules)
// ---------------------------------------------------------------------------
const DEGREE_BY_FAMILY: Partial<Record<RoleFamily, string>> = {
  sde: "BCA / B.Tech / MCA",
  backend: "BCA / B.Tech / MCA",
  frontend: "BCA / B.Tech / MCA",
  fullstack: "BCA / B.Tech / MCA",
  devops: "BCA / B.Tech / MCA",
  mobile: "BCA / B.Tech / MCA",
  qa: "BCA / B.Tech / MCA",
  blockchain: "BCA / B.Tech / MCA",
  data_ai: "BCA / B.Sc CS / MCA / B.Tech",
  data_eng: "BCA / B.Sc CS / MCA / B.Tech",
  security: "BCA / B.Sc CS / MCA / B.Tech",
  marketing: "BBA / MBA",
  hr: "BBA / MBA",
  business: "BBA / MBA",
  bizanalytics: "BBA / MBA",
  finance: "B.Com (Hons) / MBA Finance / M.Com",
  operations: "BBA / MBA Operations / B.Tech",
};

export function typicalDegree(family: RoleFamily): string | null {
  return DEGREE_BY_FAMILY[family] ?? null;
}

// ---------------------------------------------------------------------------
// Estimate
// ---------------------------------------------------------------------------
export interface SalaryEstimate {
  family: RoleFamily;
  city: City;
  degree: string | null;
  row: SalaryRow | null;
  /** Range to display, in LPA. Null when there is no sourced row for this role family. */
  range: { min: number; max: number } | null;
  /** What the displayed range is based on. */
  basis: "bengaluru-reported" | "india-reported" | "tier2-estimate" | "none";
  factorApplied: number | null;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function estimateSalary(role: string, cityName: string): SalaryEstimate {
  const family = detectRoleFamily(role);
  const city = CITIES.find((c) => c.name === cityName) ?? CITIES[CITIES.length - 1];
  const row = SALARY_ROWS.find((r) => r.families.includes(family)) ?? null;
  const degree = typicalDegree(family);

  if (!row) return { family, city, degree, row: null, range: null, basis: "none", factorApplied: null };

  if (city.tier === "tier2") {
    return {
      family,
      city,
      degree,
      row,
      range: { min: round1(row.min * TIER2_FACTOR), max: round1(row.max * TIER2_FACTOR) },
      basis: "tier2-estimate",
      factorApplied: TIER2_FACTOR,
    };
  }

  if (city.name === "Bengaluru" && row.bengaluru) {
    return { family, city, degree, row, range: { ...row.bengaluru }, basis: "bengaluru-reported", factorApplied: null };
  }

  return { family, city, degree, row, range: { min: row.min, max: row.max }, basis: "india-reported", factorApplied: null };
}
