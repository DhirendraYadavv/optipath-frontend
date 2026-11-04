import test from "node:test";
import assert from "node:assert/strict";
import { SALARY_ROWS, TIER2_FACTOR, estimateSalary, typicalDegree } from "@/lib/salaryEstimatorData";

test("every salary row is traceable and sane", () => {
  for (const r of SALARY_ROWS) {
    assert.ok(r.sourceUrl.startsWith("https://"), r.sourceTitle);
    assert.ok(r.source.length > 0);
    assert.ok(r.min > 0 && r.max > r.min, r.sourceTitle);
    assert.match(r.capturedOn, /^\d{4}-\d{2}-\d{2}$/);
    if (r.bengaluru) assert.ok(r.bengaluru.max > r.bengaluru.min);
  }
});

test("Tier-1 city shows the reported range, Bengaluru uses its own range when listed", () => {
  const blr = estimateSalary("Backend Developer (Python/FastAPI/Django)", "Bengaluru");
  assert.equal(blr.basis, "bengaluru-reported");
  assert.deepEqual(blr.range, { min: 2, max: 20 });
  const mumbai = estimateSalary("Backend Developer (Python/FastAPI/Django)", "Mumbai");
  assert.equal(mumbai.basis, "india-reported");
  assert.deepEqual(mumbai.range, { min: 1.5, max: 17 });
});

test("Tier-2 city applies the factor to the baseline and says so", () => {
  const r = estimateSalary("Backend Developer (Python/FastAPI/Django)", "Jaipur");
  assert.equal(r.basis, "tier2-estimate");
  assert.equal(r.factorApplied, TIER2_FACTOR);
  assert.deepEqual(r.range, { min: 1.2, max: 13.6 });
});

test("roles without a sourced row return no range instead of a guess", () => {
  const r = estimateSalary("HR Talent Acquisition Specialist", "Hyderabad");
  assert.equal(r.range, null);
  assert.equal(r.row, null);
  assert.equal(r.basis, "none");
  assert.equal(r.degree, "BBA / MBA");
});

test("degree rules by family", () => {
  assert.equal(typicalDegree("backend"), "BCA / B.Tech / MCA");
  assert.equal(typicalDegree("data_ai"), "BCA / B.Sc CS / MCA / B.Tech");
  assert.equal(typicalDegree("finance"), "B.Com (Hons) / MBA Finance / M.Com");
  assert.equal(typicalDegree("operations"), "BBA / MBA Operations / B.Tech");
  assert.equal(typicalDegree("generic"), null);
});

test("unknown city is treated as Tier-2", () => {
  const r = estimateSalary("Data Scientist & AI Engineer", "Nowhere");
  assert.equal(r.city.tier, "tier2");
});
