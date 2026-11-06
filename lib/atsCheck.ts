// lib/atsCheck.ts
// ATS-readiness checklist for a resume. These are OUR rule-based checks, drawn from widely shared guidance on how
// applicant-tracking software reads resumes. They are not a score from any real ATS, and passing them does not
// guarantee a shortlist. Pure functions only, so every rule is unit-tested.

import { computeSkillMatch } from "@/lib/skillMatch";
import type { ResumeSignals } from "@/lib/resumeText";

export type CheckStatus = "pass" | "warn" | "fail";

export interface AtsCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  /** What to do. Empty when the check passed. */
  fix: string;
  /** How much this check counts toward the score. Higher means more important to an ATS. */
  weight: number;
}

/** Weights: readable text and role keywords matter most to an ATS, polish items matter least. */
export const CHECK_WEIGHTS: Record<string, number> = {
  text: 20,
  keywords: 25,
  sections: 15,
  contact: 12,
  layout: 10,
  results: 8,
  length: 5,
  dates: 5,
};

export interface AtsReport {
  /** Weighted share of checks passed (warnings count half), 0 to 100. A checklist score, not a real ATS score. */
  score: number;
  checks: AtsCheck[];
  /** Fixes ordered most urgent first. */
  fixes: string[];
  wordCount: number;
}

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/;

const SECTION_PATTERNS: Record<string, RegExp> = {
  education: /\beducation\b|\bacademic (?:background|qualifications?)\b/i,
  skills: /\b(?:technical |key |core )?skills\b|\bcompetenc(?:y|ies)\b/i,
  experience: /\b(?:work |professional )?experience\b|\binternships?\b|\bemployment\b/i,
  projects: /\bprojects?\b/i,
};

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function check(id: string, label: string, status: CheckStatus, detail: string, fix = ""): AtsCheck {
  return { id, label, status, detail, fix: status === "pass" ? "" : fix, weight: CHECK_WEIGHTS[id] ?? 5 };
}

export function runAtsChecks(signals: ResumeSignals, role: string): AtsReport {
  const text = signals.text;
  const words = wordCount(text);
  const checks: AtsCheck[] = [];

  // 1. Readable text
  if (text.trim().length < 30) {
    checks.push(check("text", "Text can be read", "fail", "We found almost no text. The file may be a scanned picture.", "Export the resume again as a text-based PDF or DOCX from Word or Google Docs. Do not scan or screenshot it."));
  } else if (text.trim().length < 200) {
    checks.push(check("text", "Text can be read", "warn", "Very little text was found.", "Check that the whole resume is real text and not images."));
  } else {
    checks.push(check("text", "Text can be read", "pass", "The text can be extracted, which is what an ATS needs."));
  }

  // 2. Contact details
  const hasEmail = EMAIL_RE.test(text);
  const hasPhone = PHONE_RE.test(text);
  if (hasEmail && hasPhone) checks.push(check("contact", "Contact details", "pass", "Email and phone number found."));
  else {
    const missing = [!hasEmail && "email", !hasPhone && "phone number"].filter(Boolean).join(" and ");
    checks.push(check("contact", "Contact details", hasEmail || hasPhone ? "warn" : "fail", `No ${missing} found in the body of the resume.`, "Put your email and phone number as plain text at the top, not inside the header/footer area or an image."));
  }

  // 3. Standard sections
  const present = Object.fromEntries(Object.entries(SECTION_PATTERNS).map(([k, re]) => [k, re.test(text)]));
  const missingCore = ["education", "skills"].filter((k) => !present[k]);
  const hasWork = present.experience || present.projects;
  if (missingCore.length === 0 && hasWork) {
    checks.push(check("sections", "Standard section headings", "pass", "Education, Skills and Experience or Projects headings found."));
  } else {
    const missing = [...missingCore.map((k) => k[0].toUpperCase() + k.slice(1)), ...(hasWork ? [] : ["Experience / Projects"])];
    checks.push(check("sections", "Standard section headings", missingCore.length > 1 || !hasWork ? "fail" : "warn", `Could not find: ${missing.join(", ")}.`, `Add clearly named sections using the usual titles (${missing.join(", ")}). ATS software looks for these exact words.`));
  }

  // 4. Role keywords
  if (role) {
    const m = computeSkillMatch(role, text);
    const missingTop = m.missing.slice(0, 5).map((s) => s.label).join(", ");
    const status: CheckStatus = m.percentage >= 60 ? "pass" : m.percentage >= 30 ? "warn" : "fail";
    checks.push(check("keywords", "Keywords for your target role", status, `${m.percentage}% of this role's core skills appear in your resume.`, `Add the skills you genuinely have from this list to your Skills section and project bullets: ${missingTop}. Do not add skills you do not have.`));
  }

  // 5. Length
  const longPdf = signals.kind === "pdf" && (signals.pages ?? 1) > 2;
  if (words < 150) checks.push(check("length", "Length", "warn", `Only about ${words} words.`, "Add detail: projects, tools used and what you achieved. One full page is a good target for 0-3 years."));
  else if (words > 1000 || longPdf) checks.push(check("length", "Length", "warn", longPdf ? `${signals.pages} pages.` : `About ${words} words.`, "Trim to one page, two at most, for 0-3 years of experience."));
  else checks.push(check("length", "Length", "pass", `About ${words} words, a sensible size.`));

  // 6. Dates
  const years = (text.match(/\b(19|20)\d{2}\b/g) ?? []).length;
  checks.push(years >= 2 ? check("dates", "Dates", "pass", "Dates found for education or work.") : check("dates", "Dates", "warn", "Few or no dates found.", "Add years (for example 2023 - 2026) to education, internships and projects."));

  // 7. Measurable results
  const numbers = (text.match(/\b\d+(?:\.\d+)?\s?(?:%|x\b|\+|k\b|lakh|users|ms\b)|\b\d{2,}\b/gi) ?? []).length;
  checks.push(numbers >= 3 ? check("results", "Measurable results", "pass", "Numbers are used to show results.") : check("results", "Measurable results", "warn", "Few numbers found.", "Add measurable results to bullets, for example 'cut load time by 30%' or 'built an API used by 200 users'. Only use figures that are true."));

  // 8. Layout risks (DOCX only; we can inspect the file structure)
  if (signals.kind === "docx") {
    const risks = [signals.hasTables && "tables", signals.hasTextBoxes && "text boxes", signals.hasImages && "images or graphics"].filter(Boolean);
    checks.push(risks.length === 0 ? check("layout", "Simple layout", "pass", "No tables, text boxes or images found.") : check("layout", "Simple layout", "warn", `Found ${risks.join(", ")}.`, "Use a single-column layout with plain text. Tables, text boxes and graphics can scramble reading order in an ATS."));
  } else {
    checks.push(check("layout", "Simple layout", "pass", "Text extracted in a readable order. We cannot inspect a PDF's columns, so keep it single-column."));
  }

  const total = checks.reduce((n, c) => n + c.weight, 0);
  const points = checks.reduce((n, c) => n + c.weight * (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
  const order: Record<CheckStatus, number> = { fail: 0, warn: 1, pass: 2 };
  const fixes = [...checks].filter((c) => c.fix).sort((a, b) => order[a.status] - order[b.status] || b.weight - a.weight).map((c) => c.fix);
  return { score: Math.round((points / total) * 100), checks, fixes, wordCount: words };
}
