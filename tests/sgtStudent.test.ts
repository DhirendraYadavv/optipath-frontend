import test from "node:test";
import assert from "node:assert/strict";
import { buildAcademicView, buildDevTestStudent, normalizeBackendStudent, resolveProgramKey } from "@/lib/sgtStudent";

test("programme names resolve to catalogue keys", () => {
  assert.equal(resolveProgramKey("BCA"), "bca");
  assert.equal(resolveProgramKey("Bachelor of Computer Applications (BCA)"), "bca");
  assert.equal(resolveProgramKey("B.Com"), "bcom");
  assert.equal(resolveProgramKey("MCA (Lateral)"), "mca");
  assert.equal(resolveProgramKey("BSc"), null);
  assert.equal(resolveProgramKey(""), null);
});

test("backend record is validated", () => {
  const ok = normalizeBackendStudent(
    { registrationNo: "sgt2023bca1042", fullName: "A B", program: "BCA", currentSemester: 4, completedCourses: ["X"], upcomingCourses: [] },
    "Backend Developer"
  );
  assert.ok(ok);
  assert.equal(ok?.registrationNo, "SGT2023BCA1042");
  assert.equal(ok?.programKey, "bca");
  assert.equal(ok?.semester, 4);
  assert.equal(normalizeBackendStudent({ registrationNo: "", fullName: "x", currentSemester: 4 }, "g"), null);
  assert.equal(normalizeBackendStudent({ registrationNo: "A", fullName: "x", currentSemester: "abc" }, "g"), null);
  assert.equal(normalizeBackendStudent(null, "g"), null);
});

test("backend completed courses win over the catalogue", () => {
  const s = { ...buildDevTestStudent("g"), completedCourses: ["Data Structures & Algorithms"] };
  const v = buildAcademicView(s);
  assert.equal(v.completed.source, "backend");
  assert.deepEqual(v.completed.courses, ["Data Structures & Algorithms"]);
});

test("empty backend list falls back to the catalogue for earlier semesters", () => {
  const v = buildAcademicView(buildDevTestStudent("g"));
  assert.equal(v.completed.source, "catalog");
  assert.ok(v.completed.courses.length > 0);
  assert.ok(v.completed.note.length > 0);
  assert.equal(v.inProgress.loaded, true);
});

test("semesters missing from the catalogue are reported, never invented", () => {
  const v = buildAcademicView(buildDevTestStudent("g"));
  for (const n of v.unmappedSemesters) assert.ok(n > v.currentSemester);
  for (const g of v.upcoming) assert.ok(g.courses.length > 0 && g.semester > v.currentSemester);
});

test("first-semester student has no completed courses", () => {
  const v = buildAcademicView({ ...buildDevTestStudent("g"), currentSemester: 1, semester: 1 });
  assert.equal(v.completed.source, "none");
  assert.equal(v.completed.courses.length, 0);
});

test("unknown programme yields an empty view without throwing", () => {
  const v = buildAcademicView({ ...buildDevTestStudent("g"), programKey: null, program: "Unknown" });
  assert.equal(v.program, null);
  assert.equal(v.upcoming.length, 0);
});
