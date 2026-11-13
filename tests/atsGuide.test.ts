import test from "node:test";
import assert from "node:assert/strict";
import { ATS_GUIDE, ATS_GUIDE_NOTE } from "@/data/atsGuide";
import { CHECK_WEIGHTS } from "@/lib/atsCheck";

test("the guide covers every check in the checklist, most important first", () => {
  assert.deepEqual([...ATS_GUIDE.map((g) => g.id)].sort(), Object.keys(CHECK_WEIGHTS).sort());
  const weights = ATS_GUIDE.map((g) => CHECK_WEIGHTS[g.id]);
  assert.deepEqual(weights, [...weights].sort((a, b) => b - a));
});

test("every section explains why and gives at least two concrete points", () => {
  for (const g of ATS_GUIDE) {
    assert.ok(g.title.length > 5 && g.why.length > 20, g.id);
    assert.ok(g.points.length >= 2 && g.points.every((p) => p.length > 10), g.id);
  }
});

test("the guide never tells students to invent skills or figures, and promises no result", () => {
  const all = ATS_GUIDE.flatMap((g) => g.points).join(" ");
  assert.match(ATS_GUIDE.find((g) => g.id === "keywords")!.points.join(" "), /never add a skill you do not have/i);
  assert.match(ATS_GUIDE.find((g) => g.id === "results")!.points.join(" "), /only use figures you can explain/i);
  assert.doesNotMatch(all, /guarantee|100%|always get/i);
  assert.match(ATS_GUIDE_NOTE, /not the score of any real ATS/i);
  assert.match(ATS_GUIDE_NOTE, /does not guarantee a shortlist/i);
});

test("the page offers no resume download", async () => {
  const { readFileSync } = await import("node:fs");
  const page = readFileSync("components/portal/StudentWorkspace.tsx", "utf8");
  assert.doesNotMatch(page, /AtsDownload/);
});
