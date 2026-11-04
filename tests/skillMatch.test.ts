import test from "node:test";
import assert from "node:assert/strict";
import { analyzeAcademicGap, computeSkillMatch, detectRoleFamily } from "@/lib/skillMatch";

test("role titles map to the expected family", () => {
  const cases: [string, string][] = [
    ["Software Development Engineer 1 (SDE 1)", "sde"],
    ["Backend Developer (Python/FastAPI/Django)", "backend"],
    ["Full Stack Developer (Next.js & Spring Boot)", "fullstack"],
    ["Frontend Engineer (React / TypeScript)", "frontend"],
    ["Cloud & DevOps Engineer (Docker/K8s/AWS)", "devops"],
    ["Data Scientist & AI Engineer", "data_ai"],
    ["Cybersecurity & SOC Analyst", "security"],
    ["Blockchain & Smart Contract Developer", "blockchain"],
    ["Digital Marketing Strategist", "marketing"],
    ["Financial Analyst Associate", "finance"],
    ["HR Talent Acquisition Specialist", "hr"],
    ["Supply Chain & Logistics Director", "operations"],
    ["Business Intelligence & Analytics Lead", "bizanalytics"],
    ["Business Development Manager", "business"],
    ["AC Mechanic (Air Conditioner Mechanic)", "generic"],
  ];
  for (const [role, family] of cases) assert.equal(detectRoleFamily(role), family, role);
});

test("percentage follows covered / required", () => {
  const r = computeSkillMatch("Software Development Engineer 1 (SDE 1)", "C++, Java, React, Python, MySQL");
  assert.equal(r.required.length, 13);
  assert.equal(r.covered.length, 3);
  assert.equal(r.percentage, 23);
  assert.deepEqual(r.covered.map((c) => c.id).sort(), ["dbms_sql", "oop", "programming"]);
});

test("no skills gives 0% and everything missing", () => {
  const r = computeSkillMatch("Backend Developer", "");
  assert.equal(r.percentage, 0);
  assert.equal(r.missing.length, r.required.length);
});

test("c does not match c++ or c#, and java does not match javascript", () => {
  assert.ok(computeSkillMatch("x", "c++").covered.some((c) => c.id === "programming"));
  assert.ok(computeSkillMatch("x", "java javascript").covered.some((c) => c.id === "oop"));
  const onlyJs = computeSkillMatch("x", "javascript");
  assert.ok(!onlyJs.covered.some((c) => c.id === "oop"));
});

test("unknown entries are reported, known ones are not", () => {
  const r = computeSkillMatch("Frontend Engineer (React / TypeScript)", "React, Foo, bar baz");
  assert.deepEqual(r.unrecognized, ["Foo", "bar baz"]);
});

test("foundation and production gaps partition the missing skills", () => {
  const r = computeSkillMatch("Backend Developer", "Python");
  assert.equal(r.foundationGaps.length + r.productionGaps.length, r.missing.length);
});

test("academic analysis prefers completed over in-progress over upcoming", () => {
  const res = analyzeAcademicGap("Software Development Engineer 1 (SDE 1)", {
    completed: ["Python Programming", "Computer Networks"],
    inProgress: ["Operating System"],
    upcoming: [{ semester: 6, courses: ["Cloud Computing"] }],
  });
  const status = Object.fromEntries(res.rows.map((r) => [r.skill.id, r.status]));
  assert.equal(status.programming, "completed");
  assert.equal(status.networks, "completed");
  assert.equal(status.os, "in_progress");
  assert.equal(status.docker, "self_learn");
  assert.equal(res.counts.completed + res.counts.in_progress + res.counts.upcoming + res.counts.self_learn, res.total);
  assert.ok(res.afterSyllabusPercent >= res.readyNowPercent);
});

test("course titles do not credit implied skills (Generative AI does not teach Python)", () => {
  const res = analyzeAcademicGap("Data Scientist & AI Engineer", { completed: ["Generative AI"], inProgress: [], upcoming: [] });
  const status = Object.fromEntries(res.rows.map((r) => [r.skill.id, r.status]));
  assert.equal(status.deep_learning, "completed");
  assert.equal(status.python, "self_learn");
});
