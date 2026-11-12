// lib/talentPool.ts
// Pure helpers for the Talent Pool upload and the recruiter section: validation, payload building,
// response parsing. No React and no network calls here, so everything is unit-tested.
//
// IMPORTANT: every check in this file is a convenience for the user. The backend must repeat them
// (file type and size, work-email rule, recruiter verification, consent) because browser code can be bypassed.

import { GOAL_ROLES, GOAL_ROLE_TITLES } from "@/data/goalRoles";
import { computeSkillMatch } from "@/lib/skillMatch";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  const e = email.trim();
  return e.length <= 254 && EMAIL_RE.test(e);
}

/** Free / personal mail providers. A recruiter must use a company address. */
export const FREE_EMAIL_DOMAINS: readonly string[] = [
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk", "ymail.com", "rocketmail.com",
  "outlook.com", "hotmail.com", "live.com", "msn.com", "rediffmail.com", "rediff.com", "aol.com", "icloud.com", "me.com",
  "proton.me", "protonmail.com", "mail.com", "gmx.com", "zoho.com", "yandex.com",
];

export function isWorkEmail(email: string): boolean {
  if (!isValidEmail(email)) return false;
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return !FREE_EMAIL_DOMAINS.includes(domain);
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

// ---------------------------------------------------------------------------
// Candidate upload
// ---------------------------------------------------------------------------
export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB: an app choice, mirror it on the server
export const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".docx"] as const;
export const CONSENT_TEXT = "Allow verified campus and corporate recruiters to view my profile.";

export interface UploadFields {
  fullName: string;
  email: string;
  phone: string;
  sgtRegNo: string;
  targetRole: string;
  graduationYear: string;
  consent: boolean;
}

export type UploadErrors = FieldErrors<keyof UploadFields | "resume">;

export function validateResumeFile(file: { name: string; size: number } | null): string | null {
  if (!file) return "Choose your resume (PDF or DOCX).";
  const name = file.name.toLowerCase();
  if (!ALLOWED_RESUME_EXTENSIONS.some((ext) => name.endsWith(ext))) return "Only PDF or DOCX files are accepted.";
  if (file.size <= 0) return "This file is empty.";
  if (file.size > MAX_RESUME_BYTES) return "The file is larger than 5 MB.";
  return null;
}

/** Accepts 10-digit Indian mobiles, with optional +91 / 91 / 0 prefix and spaces or dashes. */
export function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/[\s-]/g, "").replace(/^\+/, "");
  const m = /^(?:91|0)?([6-9]\d{9})$/.exec(digits);
  return m ? m[1] : null;
}

export function validateUpload(f: UploadFields, file: { name: string; size: number } | null, now: Date = new Date()): UploadErrors {
  const e: UploadErrors = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!isValidEmail(f.email)) e.email = "Enter a valid email address.";
  if (!normalizePhone(f.phone)) e.phone = "Enter a 10-digit Indian mobile number.";
  if (f.sgtRegNo.trim() && !/^[A-Za-z0-9-]{4,30}$/.test(f.sgtRegNo.trim())) e.sgtRegNo = "Use letters, numbers and dashes only.";
  if (!GOAL_ROLE_TITLES.includes(f.targetRole)) e.targetRole = "Pick one of the listed career roles.";
  if (f.graduationYear.trim()) {
    const y = Number(f.graduationYear);
    const yr = now.getFullYear();
    if (!Number.isInteger(y) || y < yr - 10 || y > yr + 6) e.graduationYear = "Enter a four-digit graduation year.";
  }
  const fileErr = validateResumeFile(file);
  if (fileErr) e.resume = fileErr;
  if (!f.consent) e.consent = "Consent is needed to add you to the Talent Pool.";
  return e;
}

export function buildUploadFormData(f: UploadFields, file: Blob, fileName: string, extras: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.append("fullName", f.fullName.trim());
  fd.append("email", f.email.trim().toLowerCase());
  fd.append("phone", normalizePhone(f.phone) ?? "");
  fd.append("sgtRegNo", f.sgtRegNo.trim());
  fd.append("targetRole", f.targetRole);
  fd.append("graduationYear", f.graduationYear.trim());
  fd.append("recruiterConsent", f.consent ? "true" : "false");
  for (const [k, v] of Object.entries(extras)) fd.append(k, v);
  fd.append("resume", file, fileName);
  return fd;
}

// ---------------------------------------------------------------------------
// Recruiter
// ---------------------------------------------------------------------------
export interface RecruiterFields {
  name: string;
  workEmail: string;
  company: string;
  designation: string;
  website: string;
}

export type RecruiterErrors = FieldErrors<keyof RecruiterFields>;

/** Accepts a company website or a LinkedIn page, with or without the scheme. Returns a normalised https URL or null. */
export function normalizeCompanyUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateRecruiter(f: RecruiterFields): RecruiterErrors {
  const e: RecruiterErrors = {};
  if (f.name.trim().length < 2) e.name = "Enter your name.";
  if (!isValidEmail(f.workEmail)) e.workEmail = "Enter a valid email address.";
  else if (!isWorkEmail(f.workEmail)) e.workEmail = "Use your official company email. Personal addresses such as Gmail or Yahoo are not accepted.";
  if (f.company.trim().length < 2) e.company = "Enter your company name.";
  if (f.designation.trim().length < 2) e.designation = "Enter your designation.";
  if (!normalizeCompanyUrl(f.website)) e.website = "Enter your company website or LinkedIn page.";
  return e;
}

export interface RecruiterSession {
  name: string;
  company: string;
  designation: string;
  token: string;
  verifiedAt: string;
}

export const RECRUITER_STORAGE_KEY = "optipath_recruiter";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Parses a stored session. Anything unreadable or without a token is treated as "not verified". */
export function parseRecruiterSession(raw: string | null): RecruiterSession | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== "object") return null;
    const r = v as Record<string, unknown>;
    const token = str(r.token);
    if (!token) return null;
    return { name: str(r.name), company: str(r.company), designation: str(r.designation), token, verifiedAt: str(r.verifiedAt) };
  } catch {
    return null;
  }
}

/** Reads the backend's /recruiter/verify response. Returns a session only when the backend returned a token. */
export function sessionFromVerifyResponse(body: unknown, f: RecruiterFields, now: Date = new Date()): RecruiterSession | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const token = str(b.access_token);
  if (!token) return null;
  const rec = b.recruiter && typeof b.recruiter === "object" ? (b.recruiter as Record<string, unknown>) : {};
  return {
    name: str(rec.name) || f.name.trim(),
    company: str(rec.company) || f.company.trim(),
    designation: str(rec.designation) || f.designation.trim(),
    token,
    verifiedAt: now.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Candidates
// ---------------------------------------------------------------------------
export interface Candidate {
  id: string;
  fullName: string;
  targetRole: string;
  skills: string[];
  graduationYear: number | null;
  /** SGT programme as sent by the backend, e.g. "BCA". Optional. */
  program?: string;
  /** Short excerpt of the resume around the searched keyword, as sent by the backend. Optional. */
  snippet?: string;
  /** True when the backend can serve this candidate's resume file. */
  hasResume?: boolean;
  /** Only present when the backend returns it for candidates who gave consent. */
  contactEmail?: string;
  /** True for the built-in layout preview. Never set by the backend. */
  isSample?: boolean;
}

/** Reads the /talent/search response, dropping anything malformed instead of guessing. */
export function parseCandidates(body: unknown): Candidate[] {
  const list = body && typeof body === "object" ? (body as Record<string, unknown>).candidates : null;
  if (!Array.isArray(list)) return [];
  const out: Candidate[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const c = item as Record<string, unknown>;
    const id = str(c.id);
    const fullName = str(c.fullName);
    const targetRole = str(c.targetRole);
    if (!id || !fullName || !targetRole) continue;
    const skills = Array.isArray(c.skills) ? c.skills.filter((s): s is string => typeof s === "string" && s.trim().length > 0).map((s) => s.trim()) : [];
    const gy = typeof c.graduationYear === "number" && Number.isInteger(c.graduationYear) ? c.graduationYear : null;
    const email = str(c.contactEmail);
    const program = str(c.program);
    out.push({ id, fullName, targetRole, skills, graduationYear: gy, program: program || undefined, snippet: str(c.snippet).slice(0, 400) || undefined, hasResume: c.hasResume === true, contactEmail: isValidEmail(email) ? email : undefined });
  }
  return out;
}

/** Skills the candidate lists that the selected role actually asks for. Uses the same matcher as the rest of the site. */
export function matchingSkills(role: string, skills: string[]): string[] {
  if (skills.length === 0) return [];
  return computeSkillMatch(role, skills.join(", ")).covered.map((s) => s.label);
}

const PROGRAM_LABEL: Record<string, string> = { bca: "BCA", mca: "MCA", bba: "BBA", mba: "MBA", bcom: "B.Com" };

/** SGT degrees that open a goal role, e.g. "BCA / MCA". Empty string for a role outside the list. */
export function degreeRouteFor(role: string): string {
  const r = GOAL_ROLES.find((g) => g.title === role);
  return r ? r.programs.map((p) => PROGRAM_LABEL[p]).join(" / ") : "";
}

export interface RankedCandidate {
  candidate: Candidate;
  /** Share of the role's core skills the candidate lists, 0 to 100. */
  percent: number;
  matched: string[];
}

export interface CandidateFilter {
  minPercent: number;
  /** Free text; every word must appear in the candidate's skills. */
  skillQuery: string;
}

/** Scores candidates for a role with the shared skill matcher, applies the filters, sorts best first. */
export function rankCandidates(candidates: Candidate[], role: string, filter: CandidateFilter = { minPercent: 0, skillQuery: "" }): RankedCandidate[] {
  const words = filter.skillQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const ranked = candidates.map((candidate) => {
    const m = computeSkillMatch(role, candidate.skills.join(", "));
    return { candidate, percent: candidate.skills.length ? m.percentage : 0, matched: m.covered.map((s) => s.label) };
  });
  return ranked
    .filter((r) => r.percent >= filter.minPercent)
    .filter((r) => words.every((w) => r.candidate.skills.some((sk) => sk.toLowerCase().includes(w))))
    .sort((a, b) => b.percent - a.percent || a.candidate.fullName.localeCompare(b.candidate.fullName));
}

export interface TextSegment {
  text: string;
  hit: boolean;
}

/** Splits text so the searched words can be highlighted without injecting HTML. Case-insensitive. */
export function splitHighlight(text: string, query: string): TextSegment[] {
  const words = Array.from(new Set(query.toLowerCase().split(/\s+/).filter((w) => w.length > 0)));
  if (!text || words.length === 0) return [{ text, hit: false }];
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text
    .split(re)
    .filter((t) => t.length > 0)
    .map((t) => ({ text: t, hit: words.includes(t.toLowerCase()) }));
}

/** Layout preview shown only when the backend cannot be reached. Obviously fictional, no contact details. */
export const SAMPLE_CANDIDATES: Candidate[] = [
  { id: "sample-1", fullName: "Sample Candidate A", targetRole: "Software Engineer / SDE 1", skills: ["Python", "SQL", "Git"], graduationYear: 2027, isSample: true },
  { id: "sample-2", fullName: "Sample Candidate B", targetRole: "Software Engineer / SDE 1", skills: ["Java", "REST APIs", "Linux"], graduationYear: 2026, isSample: true },
];
