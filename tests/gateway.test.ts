import test from "node:test";
import assert from "node:assert/strict";
import { GATEWAY_METRICS, PROGRAM_COUNT, RECRUITER_CARD, STUDENT_CARD, TRACK_COUNT } from "@/lib/gatewayContent";
import { GOAL_ROLES } from "@/data/goalRoles";
import { PROGRAMS } from "@/lib/siteConfig";

test("gateway numbers come from the real data files", () => {
  assert.equal(TRACK_COUNT, GOAL_ROLES.length);
  assert.equal(TRACK_COUNT, 19);
  assert.equal(PROGRAM_COUNT, PROGRAMS.length);
  assert.equal(PROGRAM_COUNT, 5);
  assert.ok(RECRUITER_CARD.badges.includes("19 Degree Tracks"));
  assert.ok(GATEWAY_METRICS[0].title.startsWith("5 SGT Online Programs"));
  assert.ok(GATEWAY_METRICS[1].title.startsWith("19 Curated Career Tracks"));
});

test("gateway buttons go to the right places with the requested labels", () => {
  assert.equal(RECRUITER_CARD.href, "/recruiter");
  assert.equal(RECRUITER_CARD.cta, "Enter Recruiter Portal");
  assert.equal(STUDENT_CARD.href, "/portal/student");
  assert.equal(STUDENT_CARD.cta, "Audit Resume & Join Talent Pool");
});

test("program labels match the five SGT programmes", () => {
  assert.deepEqual(GATEWAY_METRICS[0].detail, "BCA, MCA, BBA, MBA, B.Com");
});

test("card copy does not claim things the site does not do", () => {
  const text = JSON.stringify([RECRUITER_CARD, STUDENT_CARD, GATEWAY_METRICS]).toLowerCase();
  for (const banned of ["semantic", "pre-screened", "ats ", "zero-mock", "calibrated"]) assert.ok(!text.includes(banned), banned);
});
