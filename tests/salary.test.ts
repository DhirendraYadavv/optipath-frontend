import test from "node:test";
import assert from "node:assert/strict";
import { SALARY_ROWS, ENTRY_BANDS, TIER2_FACTOR, estimateSalary, typicalDegree } from "@/lib/salaryEstimatorData";
import { GOAL_ROLES, GOAL_ROLE_TITLES } from "@/data/goalRoles";
import { detectRoleFamily } from "@/lib/skillMatch";

test("every reference salary row is traceable and sane", () => {
  for (const r of SALARY_ROWS) {
    assert.ok(r.sourceUrl.startsWith("https://"), r.sourceTitle);
    assert.ok(r.min > 0 && r.max > r.min, r.sourceTitle);
    assert.match(r.capturedOn, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("entry bands are tight, belong to goal roles and are not blended", () => {
  for (const b of ENTRY_BANDS) {
    assert.ok(GOAL_ROLE_TITLES.includes(b.title), b.title);
    assert.ok(b.max > b.min && b.max - b.min <= 2.5, b.title);
    assert.equal(b.experience, "0 to 3 years");
  }
});

test("owner-specified bands", () => {
  const get = (role: string) => estimateSalary(role, "Mumbai").range;
  assert.deepEqual(get("Software Engineer / SDE 1"), { min: 5.5, max: 7.2 });
  assert.deepEqual(get("Backend Developer (Python / Java / Node.js)"), { min: 5.5, max: 7.2 });
  assert.deepEqual(get("Data Analyst"), { min: 4, max: 5.5 });
  assert.deepEqual(get("Financial Analyst"), { min: 3.8, max: 5 });
  assert.deepEqual(get("Human Resources (HR) Generalist / Talent Acquisition"), { min: 3.5, max: 4.8 });
});

test("Tier-2 city applies 0.8x to the band and says so", () => {
  const r = estimateSalary("Data Analyst", "Jaipur");
  assert.equal(r.basis, "entry-band-tier2");
  assert.equal(r.factorApplied, TIER2_FACTOR);
  assert.deepEqual(r.range, { min: 3.2, max: 4.4 });
  assert.deepEqual(estimateSalary("Software Engineer / SDE 1", "Indore").range, { min: 4.4, max: 5.8 });
});

test("goal roles without a band show no figure instead of a guess", () => {
  const r = estimateSalary("Audit Associate", "Hyderabad");
  assert.equal(r.range, null);
  assert.equal(r.basis, "none");
  assert.equal(r.degree, "B.Com (Hons) / MBA Finance / M.Com");
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
