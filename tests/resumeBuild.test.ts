import test from "node:test";
import assert from "node:assert/strict";
import { crc32, makeDocx, escapeXml } from "@/lib/docxWriter";
import { blocksToText, buildAtsBlocks, isBuildable } from "@/lib/resumeBuild";
import { parseResume } from "@/lib/resumeParse";
import { extractDocxContent } from "@/lib/resumeText";
import { runAtsChecks } from "@/lib/atsCheck";

const RAW = `RAHUL SHARMA
rahul@acme-mail.in | 98765 43210
Education
BCA, SGT University 2023 - 2026
Skills
Python • SQL | React
Projects
Built a Flask API used by 200 users and cut load time by 30% in the first month
Short title 2025
Experience
Intern at Acme 2025`;

test("crc32 matches the known check value", () => assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926));

test("xml escaping handles markup and control characters", () => assert.equal(escapeXml("a & <b>\u0001"), "a &amp; &lt;b&gt;"));

test("rebuilt resume uses only the student's own words", () => {
  const blocks = buildAtsBlocks(parseResume(RAW), { fullName: "", email: "", phone: "" });
  const text = blocksToText(blocks);
  const words = (s: string) => new Set(s.toLowerCase().match(/[a-z0-9@.+]+/g));
  const original = words(RAW.replace(/(\d) (\d)/g, "$1$2")); // the phone number loses its space, nothing else changes
  const added = [...words(text)].filter((w) => !original.has(w) && !["education", "skills", "projects", "experience", "summary"].includes(w));
  assert.deepEqual(added, []);
  assert.ok(blocks.some((b) => b.kind === "heading" && b.text === "Education"));
  assert.ok(blocks.some((b) => b.kind === "bullet" && b.text.startsWith("Built a Flask API")));
  assert.ok(text.includes("Python, SQL, React"));
  assert.ok(isBuildable(blocks));
});

test("form values override parsed header details", () => {
  const blocks = buildAtsBlocks(parseResume(RAW), { fullName: "Rahul S", email: "new@x.in", phone: "9000000000" });
  assert.equal(blocks[0].text, "Rahul S");
  assert.ok(blocks[1].text.includes("new@x.in"));
});

test("a too-thin resume is not buildable", () => assert.equal(isBuildable(buildAtsBlocks(parseResume("hello"), { fullName: "", email: "", phone: "" })), false));

test("generated docx can be read back and is ATS-clean", async () => {
  const blocks = buildAtsBlocks(parseResume(RAW), { fullName: "", email: "", phone: "" });
  const bytes = makeDocx(blocks);
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const c = await extractDocxContent(buf);
  assert.ok(c.text.includes("Rahul Sharma") && c.text.includes("Education"));
  assert.equal(c.hasTables || c.hasImages || c.hasTextBoxes, false);
  const r = runAtsChecks({ kind: "docx", ...c }, "Software Engineer / SDE 1");
  assert.equal(r.checks.find((x) => x.id === "layout")?.status, "pass");
  assert.equal(r.checks.find((x) => x.id === "sections")?.status, "pass");
});
