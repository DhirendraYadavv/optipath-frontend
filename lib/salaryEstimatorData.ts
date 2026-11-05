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
//  - SALARY_ROWS are all-experience published ranges and are shown only as a REFERENCE. The headline figure the
//    estimator shows is the entry-level band in ENTRY_BANDS below, which is a PROJECT-OWNER ESTIMATE, not a
//    published statistic. A role with no entry band shows no headline figure.

import { RoleFamily, detectRoleFamily } from "@/lib/skillMatch";
import { GOAL_ROLE_TITLES } from "@/data/goalRoles";

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
  /** Shown on screen when a role is benchmarked against a neighbouring title. */
  aliasNote?: string;
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
  {
    // "SDE 1" and generic software roles are benchmarked against this row (project-owner decision).
    // The source range covers 1 to 5 years, so it is not an entry-level-only figure; Bengaluru: 1 to 5 years.
    families: ["sde"],
    sourceTitle: "Software Engineer",
    min: 2.8,
    max: 16,
    experience: "1 to 5 years",
    reports: "about 5.8 lakh",
    bengaluru: { min: 3, max: 16 },
    aliasNote: "Benchmarked against entry-level Software Engineer / Backend Developer compensation bands.",
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/software-engineer-salary",
    sourceDate: "24 Feb 2025",
    capturedOn: "2026-11-04",
  },
  {
    // Bengaluru range on the source is for 0 to 5 years.
    families: ["frontend"],
    sourceTitle: "Front end Developer",
    min: 1.2,
    max: 11.9,
    experience: "under 1 year to 6 years",
    reports: "about 50.6k",
    bengaluru: { min: 1.8, max: 13 },
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/front-end-developer-salary",
    sourceDate: "5 Mar 2025",
    capturedOn: "2026-11-04",
  },
  {
    // Bengaluru range on the source is for 0 to 7 years.
    families: ["fullstack"],
    sourceTitle: "Full Stack Developer",
    min: 1.8,
    max: 15.4,
    experience: "under 1 year to 7 years",
    reports: "about 39.7k",
    bengaluru: { min: 2.1, max: 16.5 },
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/full-stack-developer-salary",
    sourceDate: "5 Mar 2025",
    capturedOn: "2026-11-04",
  },
  {
    // The "Cyber Security Analyst" page could not be read in this session, so the closest readable title
    // is used. Bengaluru range on the source is for 1 to 6 years.
    families: ["security"],
    sourceTitle: "Information Security Analyst",
    min: 3,
    max: 14.8,
    experience: "1 to 7 years",
    reports: "about 7.1k",
    bengaluru: { min: 3, max: 14.5 },
    source: "AmbitionBox",
    sourceUrl: "https://www.ambitionbox.com/profile/information-security-analyst-salary",
    sourceDate: "15 Aug 2025",
    capturedOn: "2026-11-04",
  },
  {
    families: ["hr"],
    sourceTitle: "HR Executive",
    min: 1.7,
    max: 5.7,
    experience: "1 to 7 years",
    reports: "about 1.2 lakh",
    bengaluru: { min: 2, max: 6 },
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/hr-executive-salary",
    sourceDate: "1 Jul 2025",
    capturedOn: "2026-11-04",
  },
  {
    // Used for the whole operations family; it is the supply-chain title, not a general "Operations" title.
    families: ["operations"],
    sourceTitle: "Supply Chain Executive",
    min: 2,
    max: 8,
    experience: "1 to 10 years",
    reports: "about 7.3k",
    bengaluru: { min: 2.2, max: 8 },
    source: "AmbitionBox",
    sourceUrl: "https://ambitionbox.com/profile/supply-chain-executive-salary",
    sourceDate: "10 Mar 2025",
    capturedOn: "2026-11-04",
  },
];

// ---------------------------------------------------------------------------
// Entry-level bands (0 to 3 years) - PROJECT-OWNER ESTIMATES
// ---------------------------------------------------------------------------
export interface EntryBand {
  /** Exact goal-role title from data/goalRoles.ts. */
  title: string;
  min: number;
  max: number;
  experience: string;
}

/**
 * Set by the project owner on 2026-11-05 as realistic entry-to-mid bands. They are NOT copied from a published
 * source: the published ranges we could read for the same titles are far wider (see SALARY_ROWS). Shown on
 * screen as "OptiPath estimate". To add a role, add a line here; do not guess.
 */
export const ENTRY_BANDS: EntryBand[] = [
  { title: "Software Engineer / SDE 1", min: 5.5, max: 7.2, experience: "0 to 3 years" },
  { title: "Backend Developer (Python / Java / Node.js)", min: 5.5, max: 7.2, experience: "0 to 3 years" },
  { title: "Data Analyst", min: 4.0, max: 5.5, experience: "0 to 3 years" },
  { title: "Financial Analyst", min: 3.8, max: 5.0, experience: "0 to 3 years" },
  { title: "Human Resources (HR) Generalist / Talent Acquisition", min: 3.5, max: 4.8, experience: "0 to 3 years" },
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
  /** Closest published all-experience row, for reference only. */
  row: SalaryRow | null;
  band: EntryBand | null;
  /** Headline range in LPA. Null when the role has no entry band. */
  range: { min: number; max: number } | null;
  basis: "entry-band" | "entry-band-tier2" | "none";
  factorApplied: number | null;
  /** True when the role is one of the SGT goal roles. */
  isGoalRole: boolean;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function estimateSalary(role: string, cityName: string): SalaryEstimate {
  const family = detectRoleFamily(role);
  const city = CITIES.find((c) => c.name === cityName) ?? CITIES[CITIES.length - 1];
  const row = SALARY_ROWS.find((r) => r.families.includes(family)) ?? null;
  const band = ENTRY_BANDS.find((b) => b.title === role) ?? null;
  const degree = typicalDegree(family);
  const isGoalRole = GOAL_ROLE_TITLES.includes(role);
  const base = { family, city, degree, row, band, isGoalRole };

  if (!band) return { ...base, range: null, basis: "none", factorApplied: null };

  if (city.tier === "tier2") {
    return {
      ...base,
      range: { min: round1(band.min * TIER2_FACTOR), max: round1(band.max * TIER2_FACTOR) },
      basis: "entry-band-tier2",
      factorApplied: TIER2_FACTOR,
    };
  }
  return { ...base, range: { min: band.min, max: band.max }, basis: "entry-band", factorApplied: null };
}
