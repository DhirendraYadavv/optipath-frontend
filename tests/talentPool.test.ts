import test from "node:test";
import assert from "node:assert/strict";
import {
  FREE_EMAIL_DOMAINS, MAX_RESUME_BYTES, SAMPLE_CANDIDATES, buildMailto, buildUploadFormData, isValidEmail, isWorkEmail,
  matchingSkills, normalizeCompanyUrl, normalizePhone, parseCandidates, parseRecruiterSession, sessionFromVerifyResponse,
  validateRecruiter, validateResumeFile, validateUpload, type UploadFields,
} from "@/lib/talentPool";
import { TALENT_UPLOAD_URL, RECRUITER_VERIFY_URL, TALENT_SEARCH_URL, API_URL } from "@/lib/siteConfig";

const good: UploadFields = {
  fullName: "Asha Verma", email: "asha@example.com", phone: "+91 98765 43210", sgtRegNo: "", targetRole: "Data Analyst",
  graduationYear: "2027", consent: true,
};
const pdf = { name: "cv.PDF", size: 200_000 };
const NOW = new Date("2026-11-05T00:00:00Z");

test("endpoints are built from the central API_URL", () => {
  assert.equal(TALENT_UPLOAD_URL, `${API_URL}/talent/upload`);
  assert.equal(RECRUITER_VERIFY_URL, `${API_URL}/recruiter/verify`);
  assert.equal(TALENT_SEARCH_URL, `${API_URL}/talent/search`);
});

test("email checks and free-provider rule", () => {
  assert.ok(isValidEmail("a@b.co"));
  assert.ok(!isValidEmail("a@b"));
  assert.ok(!isValidEmail("a b@c.com"));
  for (const d of ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "protonmail.com"]) {
    assert.ok(FREE_EMAIL_DOMAINS.includes(d), d);
    assert.ok(!isWorkEmail(`x@${d}`), d);
  }
  assert.ok(!isWorkEmail("x@GMAIL.com"));
  assert.ok(isWorkEmail("hr@infosys.com"));
});

test("resume file validation: type and size", () => {
  assert.equal(validateResumeFile(pdf), null);
  assert.equal(validateResumeFile({ name: "cv.docx", size: 1 }), null);
  assert.match(validateResumeFile(null) ?? "", /Choose/);
  assert.match(validateResumeFile({ name: "cv.exe", size: 10 }) ?? "", /PDF or DOCX/);
  assert.match(validateResumeFile({ name: "cv.pdf", size: MAX_RESUME_BYTES + 1 }) ?? "", /5 MB/);
  assert.match(validateResumeFile({ name: "cv.pdf", size: 0 }) ?? "", /empty/);
});

test("phone normalisation", () => {
  assert.equal(normalizePhone("+91 98765-43210"), "9876543210");
  assert.equal(normalizePhone("09876543210"), "9876543210");
  assert.equal(normalizePhone("1234567890"), null);
  assert.equal(normalizePhone("98765"), null);
});

test("a complete upload passes; SGT reg no and year are optional", () => {
  assert.deepEqual(validateUpload(good, pdf, NOW), {});
  assert.deepEqual(validateUpload({ ...good, graduationYear: "", sgtRegNo: "" }, pdf, NOW), {});
});

test("upload rejects roles outside the 19 SGT goal roles, missing consent and bad fields", () => {
  const e = validateUpload({ ...good, targetRole: "Plumber", consent: false, email: "nope", phone: "1", fullName: "A", graduationYear: "1990", sgtRegNo: "!!" }, null, NOW);
  for (const k of ["targetRole", "consent", "email", "phone", "fullName", "graduationYear", "sgtRegNo", "resume"]) assert.ok(k in e, k);
});

test("upload FormData carries every field and the file", async () => {
  const fd = buildUploadFormData(good, new Blob(["hello"], { type: "application/pdf" }), "cv.pdf");
  assert.equal(fd.get("fullName"), "Asha Verma");
  assert.equal(fd.get("email"), "asha@example.com");
  assert.equal(fd.get("phone"), "9876543210");
  assert.equal(fd.get("targetRole"), "Data Analyst");
  assert.equal(fd.get("recruiterConsent"), "true");
  const f = fd.get("resume");
  assert.ok(f instanceof Blob);
  assert.equal((f as File).name, "cv.pdf");
});

test("company URL normalisation accepts sites and LinkedIn, rejects junk", () => {
  assert.equal(normalizeCompanyUrl("infosys.com"), "https://infosys.com/");
  assert.equal(normalizeCompanyUrl("https://www.linkedin.com/company/tcs"), "https://www.linkedin.com/company/tcs");
  assert.equal(normalizeCompanyUrl("javascript:alert(1)"), null);
  assert.equal(normalizeCompanyUrl("not a url"), null);
  assert.equal(normalizeCompanyUrl(""), null);
});

test("recruiter form: free email is refused with a clear message", () => {
  const f = { name: "Ravi", workEmail: "ravi@gmail.com", company: "Acme", designation: "TA Lead", website: "acme.com" };
  assert.match(validateRecruiter(f).workEmail ?? "", /official company email/);
  assert.deepEqual(validateRecruiter({ ...f, workEmail: "ravi@acme.com" }), {});
  assert.ok("website" in validateRecruiter({ ...f, workEmail: "ravi@acme.com", website: "" }));
});

test("session is created only when the backend returned a token", () => {
  const f = { name: "Ravi", workEmail: "ravi@acme.com", company: "Acme", designation: "TA Lead", website: "acme.com" };
  assert.equal(sessionFromVerifyResponse({ status: "ok" }, f), null);
  assert.equal(sessionFromVerifyResponse(null, f), null);
  const s = sessionFromVerifyResponse({ access_token: "t123", recruiter: { company: "Acme Ltd" } }, f, NOW);
  assert.equal(s?.token, "t123");
  assert.equal(s?.company, "Acme Ltd");
  assert.equal(s?.name, "Ravi");
});

test("stored session parsing is defensive", () => {
  assert.equal(parseRecruiterSession(null), null);
  assert.equal(parseRecruiterSession("not json"), null);
  assert.equal(parseRecruiterSession(JSON.stringify({ name: "x" })), null);
  assert.equal(parseRecruiterSession(JSON.stringify({ name: "R", token: "abc" }))?.token, "abc");
});

test("candidate parsing drops malformed entries and invalid emails", () => {
  const list = parseCandidates({
    candidates: [
      { id: "1", fullName: "Asha", targetRole: "Data Analyst", skills: ["Python", 5, ""], graduationYear: 2027, contactEmail: "asha@example.com" },
      { id: "2", fullName: "NoRole" },
      { id: "3", fullName: "Bad", targetRole: "Data Analyst", contactEmail: "nope", graduationYear: "2027" },
      null,
    ],
  });
  assert.equal(list.length, 2);
  assert.deepEqual(list[0].skills, ["Python"]);
  assert.equal(list[1].contactEmail, undefined);
  assert.equal(list[1].graduationYear, null);
  assert.deepEqual(parseCandidates({}), []);
  assert.deepEqual(parseCandidates("x"), []);
});

test("matching skills come from the shared skill matcher", () => {
  const m = matchingSkills("Backend Developer (Python / Java / Node.js)", ["Python", "SQL", "Photoshop"]);
  assert.ok(m.length >= 1);
  assert.ok(!m.some((x) => /photoshop/i.test(x)));
  assert.deepEqual(matchingSkills("Data Analyst", []), []);
});

test("mailto is encoded, carries context, and needs a contact email", () => {
  const rec = { name: "Ravi", company: "Acme & Co", designation: "TA Lead" };
  const c = { id: "1", fullName: "Asha", targetRole: "Data Analyst", skills: [], graduationYear: 2027, contactEmail: "asha@example.com" };
  const link = buildMailto(c, rec);
  assert.ok(link?.startsWith("mailto:asha%40example.com?subject="));
  assert.ok(link?.includes(encodeURIComponent("Acme & Co")));
  assert.ok(link?.includes(encodeURIComponent("Data Analyst")));
  assert.equal(buildMailto({ ...c, contactEmail: undefined }, rec), null);
});

test("offline sample cards are clearly fictional and have no contact details", () => {
  for (const c of SAMPLE_CANDIDATES) {
    assert.equal(c.isSample, true);
    assert.equal(c.contactEmail, undefined);
    assert.match(c.fullName, /^Sample Candidate/);
  }
});
