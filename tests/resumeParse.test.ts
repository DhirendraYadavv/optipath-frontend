import test from "node:test";
import assert from "node:assert/strict";
import { parseResume, splitSections } from "@/lib/resumeParse";
import { itemsToLines } from "@/lib/resumePdf";
import { runAtsChecks } from "@/lib/atsCheck";
import type { ResumeSignals } from "@/lib/resumeText";

const RESUME = `RAHUL SHARMA
rahul.sharma@gmail.com | +91 98765 43210
linkedin.com/in/rahulsharma | github.com/rahul-s
Education
BCA, SGT University 2023 - 2026
Skills
Python, SQL, React, Git
Projects
Built a Flask API used by 200 users, cut load time by 30%
Experience
Intern at Acme 2025`;

test("parser reads name, contact, links, sections and skills", () => {
  const p = parseResume(RESUME);
  assert.equal(p.name, "Rahul Sharma");
  assert.equal(p.email, "rahul.sharma@gmail.com");
  assert.equal(p.phone, "9876543210");
  assert.ok(p.links.linkedin.includes("rahulsharma"));
  assert.ok(p.links.github.includes("rahul-s"));
  assert.equal(p.graduationYear, "2026");
  assert.ok(p.sections.education && p.sections.skills && p.sections.projects && p.sections.experience);
  assert.ok(p.skills.length >= 2);
});

test("parser leaves unknown fields empty instead of guessing", () => {
  const p = parseResume("hello 123");
  assert.equal(p.name, "");
  assert.equal(p.email, "");
  assert.equal(p.phone, "");
});

test("section split ignores long lines that merely start with a heading word", () => {
  const s = splitSections("Skills\nPython\nExperience in building very large distributed systems for many years now");
  assert.ok(!s.experience);
});

test("pdf items become separate lines by position", () => {
  const t = itemsToLines([
    { str: "Rahul", transform: [1, 0, 0, 1, 0, 700] },
    { str: "Sharma", transform: [1, 0, 0, 1, 40, 700] },
    { str: "Skills", transform: [1, 0, 0, 1, 0, 650] },
  ]);
  assert.equal(t, "Rahul Sharma\nSkills");
});

test("ats score is weighted: unreadable text drags the score down more than a short length", () => {
  const sig = (text: string): ResumeSignals => ({ text, kind: "docx", pages: 1, hasTables: false, hasImages: false, hasTextBoxes: false });
  const good = runAtsChecks(sig(RESUME), "Software Engineer / SDE 1");
  const empty = runAtsChecks(sig("x"), "Software Engineer / SDE 1");
  assert.ok(good.score > empty.score);
  assert.ok(good.checks.every((c) => c.weight > 0));
  assert.ok(empty.fixes.length > 0);
});
