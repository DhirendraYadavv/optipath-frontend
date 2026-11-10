import test from "node:test";
import assert from "node:assert/strict";
import { buildPlacementStats, parseSummary, type SummaryResponse } from "@/lib/placementStats";

const S: SummaryResponse = {
  roster: { total: 10, byProgram: { MBA: 6, BCA: 4 }, bySemester: { "1": 10 } },
  pool: { total: 4, withScore: 2, byBand: { High: 1, Low: 1, "Not checked": 2 } },
  candidates: [
    { targetRole: "Data Analyst", program: "BCA", skills: ["Python", "SQL"], atsScore: 80 },
    { targetRole: "Data Analyst", program: "BCA", skills: ["Excel"], atsScore: 40 },
    { targetRole: "Software Engineer / SDE 1", program: "MCA", skills: [], atsScore: null },
    { targetRole: "Data Analyst", program: "", skills: ["SQL"], atsScore: null },
  ],
};

test("counts, coverage and average", () => {
  const s = buildPlacementStats(S);
  assert.equal(s.coverage, 40);
  assert.equal(s.averageScore, 60);
  assert.deepEqual(s.byRole[0], { label: "Data Analyst", count: 3 });
  assert.ok(s.byProgram.some((t) => t.label === "Not given" && t.count === 1));
});

test("resumes with no listed skills are not counted as gaps", () => {
  const s = buildPlacementStats(S);
  assert.equal(s.analysed, 3);
  for (const g of s.gaps) assert.ok(g.count <= s.analysed);
});

test("gaps are sorted by how many candidates miss them", () => {
  const s = buildPlacementStats(S);
  for (let i = 1; i < s.gaps.length; i++) assert.ok(s.gaps[i - 1].count >= s.gaps[i].count);
});

test("empty cohort does not divide by zero", () => {
  const s = buildPlacementStats({ roster: { total: 0, byProgram: {}, bySemester: {} }, pool: { total: 0, withScore: 0, byBand: {} }, candidates: [] });
  assert.equal(s.coverage, 0);
  assert.equal(s.averageScore, null);
  assert.deepEqual(s.gaps, []);
});

test("malformed responses are rejected", () => {
  assert.equal(parseSummary(null), null);
  assert.equal(parseSummary({ roster: {} }), null);
  assert.equal(parseSummary({ ...S, candidates: [{ nope: 1 }, ...S.candidates] })?.candidates.length, 4);
});
