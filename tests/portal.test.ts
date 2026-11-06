import test from "node:test";
import assert from "node:assert/strict";
import { deflateRawSync } from "node:zlib";
import {
  buildUploadFormData, degreeRouteFor, parseCandidates, rankCandidates, validateUpload, type Candidate, type UploadFields,
} from "@/lib/talentPool";
import { buildGapReport, planText } from "@/lib/gapReport";
import { extractDocxText, readZipEntry, resumeKind, wordXmlToText } from "@/lib/resumeText";
import { validateStudentLogin } from "@/lib/studentPortal";
import { normalizeStoredStudent } from "@/lib/studentPortalSession";
import { buildDevTestStudent } from "@/lib/sgtStudent";
import { GOAL_ROLE_TITLES } from "@/data/goalRoles";

const NOW = new Date("2026-11-05T00:00:00Z");
const BACKEND = "Backend Developer (Python / Java / Node.js)";

// --- tiny zip writer for fixtures -----------------------------------------
function le(n: number, bytes: number): number[] {
  return Array.from({ length: bytes }, (_, i) => (n >>> (8 * i)) & 0xff);
}
function makeZip(name: string, content: string, deflate: boolean): ArrayBuffer {
  const raw = Buffer.from(content, "utf8");
  const data = deflate ? deflateRawSync(raw) : raw;
  const method = deflate ? 8 : 0;
  const nameB = Buffer.from(name);
  const local = Buffer.from([...le(0x04034b50, 4), ...le(20, 2), ...le(0, 2), ...le(method, 2), ...le(0, 4), ...le(0, 4), ...le(data.length, 4), ...le(raw.length, 4), ...le(nameB.length, 2), ...le(0, 2)]);
  const central = Buffer.from([...le(0x02014b50, 4), ...le(20, 2), ...le(20, 2), ...le(0, 2), ...le(method, 2), ...le(0, 4), ...le(0, 4), ...le(data.length, 4), ...le(raw.length, 4), ...le(nameB.length, 2), ...le(0, 2), ...le(0, 2), ...le(0, 2), ...le(0, 2), ...le(0, 4), ...le(0, 4)]);
  const cdOffset = local.length + nameB.length + data.length;
  const eocd = Buffer.from([...le(0x06054b50, 4), ...le(0, 2), ...le(0, 2), ...le(1, 2), ...le(1, 2), ...le(central.length + nameB.length, 4), ...le(cdOffset, 4), ...le(0, 2)]);
  const all = Buffer.concat([local, nameB, data, central, nameB, eocd]);
  return all.buffer.slice(all.byteOffset, all.byteOffset + all.byteLength) as ArrayBuffer;
}
const DOC_XML =
  '<?xml version="1.0"?><w:document><w:body><w:p><w:r><w:t>Skills: Python, SQL &amp; Git</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Built a REST API with Docker</w:t></w:r></w:p></w:body></w:document>';

test("DOCX text is read from both stored and deflated archives", async () => {
  for (const deflate of [false, true]) {
    const text = await extractDocxText(makeZip("word/document.xml", DOC_XML, deflate));
    assert.match(text, /Skills: Python, SQL & Git/);
    assert.match(text, /REST API with Docker/);
  }
});

test("non-DOCX input fails with a readable error", async () => {
  await assert.rejects(() => extractDocxText(new TextEncoder().encode("hello world, not a zip file at all").buffer as ArrayBuffer), /DOCX/);
  assert.equal(await readZipEntry(new Uint8Array(makeZip("other.xml", "x", false)), "word/document.xml"), null);
});

test("word xml text extraction handles entities and tabs", () => {
  assert.equal(wordXmlToText("<w:p><w:r><w:t>A &lt; B</w:t></w:r><w:r><w:tab/><w:t>C</w:t></w:r></w:p>"), "A < B\tC");
});

test("resume kind by extension", () => {
  assert.equal(resumeKind("CV.PDF"), "pdf");
  assert.equal(resumeKind("cv.docx"), "docx");
  assert.equal(resumeKind("cv.doc"), "unsupported");
});

test("gap report splits foundation vs production gaps and maps SGT courses", () => {
  const groups = { completed: ["Database Management Systems"], inProgress: [], upcoming: [{ semester: 6, courses: ["Cloud Computing"] }] };
  const r = buildGapReport(BACKEND, "I know Python and Git", groups);
  assert.equal(r.hasInput, true);
  assert.ok(r.match && r.match.percentage > 0 && r.match.percentage < 100);
  assert.equal(r.foundation.length, r.match?.foundationGaps.length);
  assert.equal(r.production.length, r.match?.productionGaps.length);
  assert.ok(r.foundation.every((a) => a.tier === "foundation"));
  assert.ok(r.production.every((a) => a.tier === "production"));
  assert.ok(![...r.foundation, ...r.production].some((a) => a.skill.label.toLowerCase() === "python"));
  assert.ok(r.projects.length > 0 && r.projects.length <= 3);
  for (const a of [...r.foundation, ...r.production]) assert.ok(planText(a.plan).length > 0);
});

test("gap report needs both a role and some skills", () => {
  assert.equal(buildGapReport("", "python", null).hasInput, false);
  assert.equal(buildGapReport(BACKEND, "   ", null).hasInput, false);
  const r = buildGapReport(BACKEND, "python", null);
  assert.ok([...r.foundation, ...r.production].every((a) => a.plan.status === "self_learn"));
});

test("plan text is honest for each status", () => {
  assert.match(planText({ status: "completed", course: "X" }), /completed course "X"/);
  assert.match(planText({ status: "upcoming", course: "Y", semester: 6 }), /Semester 6/);
  assert.match(planText({ status: "self_learn" }), /on your own/);
});

test("student login validation", () => {
  assert.deepEqual(validateStudentLogin({ registrationNo: "SGT2023BCA1042", dob: "2001-07-05" }, NOW), {});
  assert.ok("registrationNo" in validateStudentLogin({ registrationNo: "x", dob: "2001-07-05" }, NOW));
  assert.ok("dob" in validateStudentLogin({ registrationNo: "SGT2023BCA1042", dob: "" }, NOW));
  assert.ok("dob" in validateStudentLogin({ registrationNo: "SGT2023BCA1042", dob: "2001-02-31" }, NOW));
  assert.ok("dob" in validateStudentLogin({ registrationNo: "SGT2023BCA1042", dob: "2030-01-01" }, NOW));
});

test("stored student record round-trips", () => {
  const dev = buildDevTestStudent("Data Analyst");
  const back = normalizeStoredStudent(dev as unknown as Record<string, unknown>);
  assert.equal(back?.registrationNo, dev.registrationNo);
  assert.equal(back?.goal, "Data Analyst");
  assert.equal(back?.dataSource, "dev-fallback");
  assert.equal(normalizeStoredStudent({ goal: "x" }), null);
});

const cands: Candidate[] = [
  { id: "1", fullName: "Zed", targetRole: BACKEND, skills: ["Python", "SQL", "Git", "Docker"], graduationYear: 2027 },
  { id: "2", fullName: "Amy", targetRole: BACKEND, skills: ["Photoshop"], graduationYear: null },
  { id: "3", fullName: "Bob", targetRole: BACKEND, skills: [], graduationYear: 2026 },
];

test("candidates are scored, filtered and sorted", () => {
  const all = rankCandidates(cands, BACKEND);
  assert.equal(all[0].candidate.id, "1");
  assert.ok(all[0].percent > all[1].percent);
  assert.equal(all.find((r) => r.candidate.id === "3")?.percent, 0);
  assert.deepEqual(rankCandidates(cands, BACKEND, { minPercent: 1, skillQuery: "" }).map((r) => r.candidate.id), ["1"]);
  assert.deepEqual(rankCandidates(cands, BACKEND, { minPercent: 0, skillQuery: "python docker" }).map((r) => r.candidate.id), ["1"]);
  assert.deepEqual(rankCandidates(cands, BACKEND, { minPercent: 0, skillQuery: "rust" }), []);
});

test("degree route comes only from the goal roles", () => {
  assert.equal(degreeRouteFor("Financial Analyst"), "B.Com / MBA");
  assert.equal(degreeRouteFor(BACKEND), "BCA / MCA");
  assert.equal(degreeRouteFor("Plumber"), "");
  assert.equal(GOAL_ROLE_TITLES.length, new Set(GOAL_ROLE_TITLES).size);
});

test("candidate parsing keeps the programme when given", () => {
  const [c] = parseCandidates({ candidates: [{ id: "1", fullName: "A", targetRole: "Data Analyst", program: "BCA", skills: [] }] });
  assert.equal(c.program, "BCA");
});

test("upload form data accepts extra fields (skills, programme, source)", () => {
  const f: UploadFields = { fullName: "Asha", email: "a@b.co", phone: "9876543210", sgtRegNo: "SGT2023BCA1042", targetRole: "Data Analyst", graduationYear: "", consent: true };
  assert.deepEqual(validateUpload(f, { name: "cv.pdf", size: 10 }, NOW), {});
  const fd = buildUploadFormData(f, new Blob(["x"]), "cv.pdf", { skills: JSON.stringify(["Python"]), program: "BCA", source: "student-portal" });
  assert.equal(fd.get("skills"), '["Python"]');
  assert.equal(fd.get("program"), "BCA");
  assert.equal(fd.get("source"), "student-portal");
  assert.equal(fd.get("sgtRegNo"), "SGT2023BCA1042");
});

test("every goal role maps to a specific skill family and a degree", async () => {
  const { GOAL_ROLES } = await import("@/data/goalRoles");
  const { detectRoleFamily } = await import("@/lib/skillMatch");
  for (const r of GOAL_ROLES) {
    assert.notEqual(detectRoleFamily(r.title), "generic", r.title);
    assert.ok(r.programs.length > 0, r.title);
  }
  for (const p of ["bca", "mca", "bba", "mba", "bcom"] as const) {
    assert.ok(GOAL_ROLES.filter((r) => r.programs.includes(p)).length >= 10, p);
  }
});
