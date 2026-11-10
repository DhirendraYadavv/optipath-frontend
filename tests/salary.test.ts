import test from "node:test";
import assert from "node:assert/strict";
import { SALARY_ROWS, ROLE_BENCHMARKS, DOMAIN_BENCHMARKS, TIER2_FACTOR, estimateSalary, formatRangeLpa, typicalDegree } from "@/lib/salaryEstimatorData";
import { GOAL_ROLES, GOAL_ROLE_TITLES } from "@/data/goalRoles";
import { detectRoleFamily } from "@/lib/skillMatch";

test("every reference salary row is traceable and sane", () => {
  for (const r of SALARY_ROWS) {
    assert.ok(r.sourceUrl.startsWith("https://"), r.sourceTitle);
    assert.ok(r.min > 0 && r.max > r.min, r.sourceTitle);
    assert.match(r.capturedOn, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("role benchmarks belong to goal roles and are sane", () => {
  for (const b of ROLE_BENCHMARKS) {
    assert.ok(b.max > b.min, b.label);
    assert.ok(b.median >= b.min && b.median <= b.max, b.label);
    for (const r of b.roles) assert.ok(GOAL_ROLE_TITLES.includes(r), r);
  }
  const claimed = ROLE_BENCHMARKS.flatMap((b) => b.roles);
  assert.equal(new Set(claimed).size, claimed.length, "a role is claimed by two benchmarks");
});

test("owner-specified role benchmarks", () => {
  const get = (role: string) => estimateSalary(role, "Mumbai");
  assert.deepEqual(get("Software Engineer / SDE 1").range, { min: 3.6, max: 12 });
  assert.equal(get("Software Engineer / SDE 1").median, 6.5);
  assert.deepEqual(get("Mobile App Developer (Android / Flutter)").range, { min: 3.2, max: 9.5 });
  assert.deepEqual(get("Backend Developer (Python / Java / Node.js)").range, { min: 3.6, max: 11 });
  assert.deepEqual(get("Data Scientist").range, { min: 4.2, max: 14 });
  assert.deepEqual(get("Machine Learning Engineer").range, { min: 4.2, max: 14 });
  assert.deepEqual(get("SEO Specialist").range, { min: 2.5, max: 6 });
  assert.deepEqual(get("Human Resources (HR) Generalist / Talent Acquisition").range, { min: 2.5, max: 5.5 });
  assert.deepEqual(get("Operations Analyst").range, { min: 3, max: 7.5 });
});

test("Tier-2 city applies 0.8x to the range and the median and says so", () => {
  const r = estimateSalary("Data Analyst", "Jaipur");
  assert.equal(r.basis, "entry-band-tier2");
  assert.equal(r.factorApplied, TIER2_FACTOR);
  assert.deepEqual(r.range, { min: 2.6, max: 6.8 });
  assert.equal(r.median, 4);
});

test("every goal role shows a range: an exact row or its domain fallback", () => {
  for (const r of GOAL_ROLES) {
    const e = estimateSalary(r.title, "Mumbai");
    assert.ok(e.range && e.band, r.title);
    assert.ok(e.range.min > 0 && e.range.max > e.range.min, r.title);
  }
});

test("roles without an exact row use the domain fallback and have no median", () => {
  const tech = estimateSalary("Python Developer", "Mumbai");
  assert.deepEqual(tech.range, DOMAIN_BENCHMARKS["Tech / Engineering"]);
  assert.equal(tech.band?.kind, "domain");
  assert.equal(tech.median, null);
  assert.deepEqual(estimateSalary("Data Engineer", "Mumbai").range, { min: 3.8, max: 9 });
  assert.deepEqual(estimateSalary("Audit Associate", "Mumbai").range, { min: 3.2, max: 7 });
  assert.deepEqual(estimateSalary("Sales Executive", "Mumbai").range, { min: 3, max: 6.5 });
  assert.deepEqual(estimateSalary("Content Marketing Executive", "Mumbai").range, { min: 2.8, max: 5.5 });
});

test("an unknown title outside the goal list gets no guess", () => {
  assert.equal(estimateSalary("Underwater Basket Weaver", "Mumbai").range, null);
});

test("range text uses the requested format", () => {
  assert.equal(formatRangeLpa({ min: 3.6, max: 12 }), "\u20b93.6L \u2013 \u20b912.0L LPA");
});

test("SDE 1 still points at the Software Engineer reference row with its alias note", () => {
  const r = estimateSalary("Software Engineer / SDE 1", "Mumbai");
  assert.equal(r.row?.sourceTitle, "Software Engineer");
  assert.match(r.row?.aliasNote ?? "", /Benchmarked against entry-level Software Engineer/);
});

test("every goal role resolves to the intended family and has a degree", () => {
  const expected: Record<string, string> = {
    "Software Engineer / SDE 1": "sde",
    "Backend Developer (Python / Java / Node.js)": "backend",
    "Frontend Developer (React / Next.js)": "frontend",
    "Full Stack Developer": "fullstack",
    "Data Analyst": "data_eng",
    "Cloud / DevOps Engineer": "devops",
    "Cybersecurity / Information Security Analyst": "security",
    "Database Administrator / QA Automation Engineer": "qa",
    "Digital Marketing Executive / Specialist": "marketing",
    "Human Resources (HR) Generalist / Talent Acquisition": "hr",
    "Operations & Supply Chain Executive": "operations",
    "Financial Analyst": "finance",
    "Accounting & Tax Associate": "finance",
    "Risk & Compliance Analyst": "finance",
    "Investment Banking / Equity Research Associate": "finance",
    "Audit Associate": "finance",
  };
  for (const [role, fam] of Object.entries(expected)) assert.equal(detectRoleFamily(role), fam, role);
  for (const r of GOAL_ROLES) assert.notEqual(estimateSalary(r.title, "Mumbai").degree, null, r.title);
});

test("goal list is approved roles with no duplicates", () => {
  assert.equal(GOAL_ROLES.length, GOAL_ROLE_TITLES.length);
  assert.equal(new Set(GOAL_ROLE_TITLES).size, GOAL_ROLES.length);
});

test("degree rules by family", () => {
  assert.equal(typicalDegree("backend"), "BCA / B.Tech / MCA");
  assert.equal(typicalDegree("finance"), "B.Com (Hons) / MBA Finance / M.Com");
  assert.equal(typicalDegree("generic"), null);
});

test("unknown city is treated as Tier-2", () => {
  assert.equal(estimateSalary("Data Analyst", "Nowhere").city.tier, "tier2");
});

import { ambitionBoxSearchUrl } from "@/lib/salaryEstimatorData";

test("AmbitionBox link encodes the role title exactly as specified", () => {
  assert.equal(
    ambitionBoxSearchUrl("Frontend Developer (React / Next.js)"),
    "https://www.ambitionbox.com/salaries?search=Frontend%20Developer%20(React%20%2F%20Next.js)",
  );
});

test("every published row is sourced and the reported range is sane", () => {
  for (const r of SALARY_ROWS) {
    assert.match(r.sourceUrl, /^https:\/\/(www\.)?ambitionbox\.com\//);
    assert.ok(r.min > 0 && r.max > r.min, r.sourceTitle);
  }
});
