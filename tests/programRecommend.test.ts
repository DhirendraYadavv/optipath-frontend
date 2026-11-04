import test from "node:test";
import assert from "node:assert/strict";
import { computeSkillMatch } from "@/lib/skillMatch";
import { evaluatePrograms, recommendPrograms } from "@/lib/programRecommend";

test("recommendation rules", () => {
  assert.equal(recommendPrograms("12th", "backend").recommended, "bca");
  assert.equal(recommendPrograms("12th", "finance").recommended, "bcom");
  assert.equal(recommendPrograms("12th", "marketing").recommended, "bba");
  assert.equal(recommendPrograms("nontech_grad", "data_ai").recommended, "mca");
  assert.equal(recommendPrograms("tech_grad", "devops").recommended, "mca");
  assert.equal(recommendPrograms("nontech_grad", "hr").recommended, "mba");
  assert.equal(recommendPrograms("tech_grad", "operations").recommended, "mba");
});

test("postgraduates and unmapped occupations get no programme but a note", () => {
  const pg = recommendPrograms("postgrad", "backend");
  assert.equal(pg.recommended, null);
  assert.ok(pg.note.length > 0);
  const other = recommendPrograms("12th", "generic");
  assert.equal(other.recommended, null);
  assert.ok(other.note.length > 0);
});

test("coverage only counts gaps the candidate actually has", () => {
  const role = "AI / Machine Learning Engineer";
  const a = computeSkillMatch(role, "Python");
  const ev = evaluatePrograms(role, "nontech_grad", a.missing);
  const missingIds = new Set(a.missing.map((m) => m.id));
  for (const fit of ev.fits) for (const c of fit.covered) assert.ok(missingIds.has(c.skill.id));
  const rec = ev.fits.find((f) => f.recommended);
  assert.equal(rec?.key, "mca");
  // self-learn = missing minus what the recommended programme teaches
  assert.equal(ev.selfLearn.length, a.missing.length - (rec?.covered.length ?? 0));
});

test("non-recommended programmes are shown only if they teach at least one gap", () => {
  const role = "Backend Developer (Python/FastAPI/Django)";
  const a = computeSkillMatch(role, "Python");
  const ev = evaluatePrograms(role, "12th", a.missing);
  for (const fit of ev.fits) assert.ok(fit.recommended || fit.covered.length > 0);
});
