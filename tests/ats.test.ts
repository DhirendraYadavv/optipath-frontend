import test from "node:test";
import assert from "node:assert/strict";
import { runAtsChecks, wordCount } from "@/lib/atsCheck";
import { extractDocxContent } from "@/lib/resumeText";
import { splitHighlight, parseCandidates } from "@/lib/talentPool";
import type { ResumeSignals } from "@/lib/resumeText";
import { deflateRawSync } from "node:zlib";

const ROLE = "Backend Developer (Python / Java / Node.js)";

const GOOD = `Asha Verma | asha.verma@example.com | +91 98765 43210
Summary
Final-year BCA student building backend services.
Education
BCA, SGT University, 2023 - 2026, CGPA 8.2
Skills
Python, SQL, Git, Docker, REST APIs, Linux, Data Structures, Algorithms, Operating Systems, Networking
Projects
URL shortener (2025): REST API in Python with PostgreSQL and Redis, handling 500 requests per minute and cutting response time by 35%.
Order service (2025): built payment flows with 20 automated tests and Docker deployment, used by 150 test users.
Experience
Backend intern, Acme Pvt Ltd, 2025: wrote 12 API endpoints and reduced query time by 40%.`;

const good: ResumeSignals = { kind: "docx", text: GOOD.repeat(2), hasTables: false, hasImages: false, hasTextBoxes: false };

test("a clean resume passes most checks and scores high", () => {
  const r = runAtsChecks(good, ROLE);
  assert.ok(r.score >= 80, String(r.score));
  assert.ok(r.checks.every((c) => c.status !== "fail"));
  assert.equal(r.checks.find((c) => c.id === "contact")?.status, "pass");
  assert.equal(r.checks.find((c) => c.id === "sections")?.status, "pass");
});

test("a scanned/empty resume fails the text check and is told how to fix it", () => {
  const r = runAtsChecks({ kind: "pdf", text: "", pages: 1 }, ROLE);
  const t = r.checks.find((c) => c.id === "text");
  assert.equal(t?.status, "fail");
  assert.match(t?.fix ?? "", /text-based/);
  assert.ok(r.score < 40);
  assert.ok(r.fixes.length > 0);
});

test("missing contact details and headings are reported", () => {
  const r = runAtsChecks({ kind: "docx", text: "I like computers and I have done some things. ".repeat(20) }, ROLE);
  assert.equal(r.checks.find((c) => c.id === "contact")?.status, "fail");
  assert.notEqual(r.checks.find((c) => c.id === "sections")?.status, "pass");
});

test("tables, text boxes and images in a DOCX are flagged", () => {
  const r = runAtsChecks({ ...good, hasTables: true, hasTextBoxes: true, hasImages: true }, ROLE);
  const l = r.checks.find((c) => c.id === "layout");
  assert.equal(l?.status, "warn");
  assert.match(l?.detail ?? "", /tables, text boxes, images/);
});

test("long PDFs are flagged for a 0-3 year profile", () => {
  const r = runAtsChecks({ kind: "pdf", text: good.text, pages: 4 }, ROLE);
  assert.equal(r.checks.find((c) => c.id === "length")?.status, "warn");
});

test("keyword check never tells the student to invent skills", () => {
  const r = runAtsChecks({ kind: "docx", text: "Education Skills Projects Photoshop 2024 2025 email a@b.co 9876543210 ".repeat(8) }, ROLE);
  const k = r.checks.find((c) => c.id === "keywords");
  assert.notEqual(k?.status, "pass");
  assert.match(k?.fix ?? "", /genuinely have/);
});

test("fixes are ordered most urgent first and no fix is empty", () => {
  const r = runAtsChecks({ kind: "docx", text: "short text only" }, ROLE);
  assert.ok(r.fixes.every((f) => f.length > 0));
  const firstFail = r.checks.filter((c) => c.status === "fail").sort((a, b) => b.weight - a.weight)[0];
  assert.equal(r.fixes[0], firstFail?.fix);
});

test("word count", () => assert.equal(wordCount("  a  b\nc "), 3));

test("highlight splits text without touching HTML", () => {
  assert.deepEqual(splitHighlight("Built with Python and SQL", "python sql").map((s) => [s.text, s.hit]), [
    ["Built with ", false], ["Python", true], [" and ", false], ["SQL", true],
  ]);
  assert.deepEqual(splitHighlight("a.b", "a.b"), [{ text: "a.b", hit: true }]);
  assert.deepEqual(splitHighlight("plain", ""), [{ text: "plain", hit: false }]);
  assert.equal(splitHighlight("<b>x</b>", "x").map((s) => s.text).join(""), "<b>x</b>");
});

test("candidate parsing keeps snippet and resume flag", () => {
  const [c] = parseCandidates({ candidates: [{ id: "1", fullName: "A", targetRole: "Data Analyst", snippet: "used Power BI daily", hasResume: true }] });
  assert.equal(c.snippet, "used Power BI daily");
  assert.equal(c.hasResume, true);
});

test("DOCX structure flags are read from the document xml", async () => {
  const xml = '<w:document><w:body><w:tbl><w:tr><w:tc><w:p><w:r><w:t>Cell</w:t></w:r></w:p></w:tc></w:tr></w:tbl><w:p><w:r><w:drawing/></w:r></w:p></w:body></w:document>';
  const raw = Buffer.from(xml);
  const data = deflateRawSync(raw);
  const name = Buffer.from("word/document.xml");
  const le = (n: number, b: number) => Array.from({ length: b }, (_, i) => (n >>> (8 * i)) & 0xff);
  const local = Buffer.from([...le(0x04034b50, 4), ...le(20, 2), ...le(0, 2), ...le(8, 2), ...le(0, 4), ...le(0, 4), ...le(data.length, 4), ...le(raw.length, 4), ...le(name.length, 2), ...le(0, 2)]);
  const central = Buffer.from([...le(0x02014b50, 4), ...le(20, 2), ...le(20, 2), ...le(0, 2), ...le(8, 2), ...le(0, 4), ...le(0, 4), ...le(data.length, 4), ...le(raw.length, 4), ...le(name.length, 2), ...le(0, 2), ...le(0, 2), ...le(0, 2), ...le(0, 2), ...le(0, 4), ...le(0, 4)]);
  const eocd = Buffer.from([...le(0x06054b50, 4), ...le(0, 2), ...le(0, 2), ...le(1, 2), ...le(1, 2), ...le(central.length + name.length, 4), ...le(local.length + name.length + data.length, 4), ...le(0, 2)]);
  const all = Buffer.concat([local, name, data, central, name, eocd]);
  const c = await extractDocxContent(all.buffer.slice(all.byteOffset, all.byteOffset + all.byteLength) as ArrayBuffer);
  assert.equal(c.hasTables, true);
  assert.equal(c.hasImages, true);
  assert.equal(c.hasTextBoxes, false);
  assert.match(c.text, /Cell/);
});
