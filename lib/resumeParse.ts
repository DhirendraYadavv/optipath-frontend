// lib/resumeParse.ts
// Pulls structured details out of resume text with plain rules. No guessing: a field we cannot find stays empty.

import { detectSkillLabels } from "@/lib/skillMatch";

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  links: { linkedin: string; github: string };
  /** Section heading found -> its body text. */
  sections: Record<string, string>;
  /** Skills from our vocabulary that actually appear in the text. */
  skills: string[];
  graduationYear: string;
}

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/;
const HEADINGS: Record<string, RegExp> = {
  education: /^(?:education|academic (?:background|qualifications?)|qualifications?)\b/i,
  skills: /^(?:(?:technical |key |core )?skills|competenc(?:y|ies)|technologies)\b/i,
  experience: /^(?:(?:work |professional )?experience|internships?|employment(?: history)?)\b/i,
  projects: /^(?:(?:academic |personal )?projects?)\b/i,
  certifications: /^(?:certifications?|courses|licen[sc]es)\b/i,
  summary: /^(?:summary|profile|objective|career objective|about me)\b/i,
};

export function splitSections(text: string): Record<string, string> {
  const out: Record<string, string[]> = {};
  let current = "header";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const bare = line.replace(/[:|\-_•]+$/g, "").trim();
    const key = bare.length <= 40 ? Object.keys(HEADINGS).find((k) => HEADINGS[k].test(bare)) : undefined;
    if (key) {
      current = key;
      out[current] ??= [];
      const rest = bare.replace(HEADINGS[key], "").replace(/^[:\s-]+/, "");
      if (rest) out[current].push(rest);
    } else {
      (out[current] ??= []).push(line);
    }
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join("\n")]));
}

function guessName(headerLines: string[]): string {
  for (const l of headerLines.slice(0, 6)) {
    const t = l.trim();
    if (!t || EMAIL_RE.test(t) || PHONE_RE.test(t) || /https?:|linkedin|github|\d/i.test(t)) continue;
    const words = t.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && words.every((w) => /^[A-Za-z.'-]+$/.test(w))) {
      return words.map((w) => (w === w.toUpperCase() ? w[0] + w.slice(1).toLowerCase() : w)).join(" ");
    }
  }
  return "";
}

export function parseResume(text: string): ParsedResume {
  const sections = splitSections(text);
  const header = (sections.header ?? "").split("\n");
  const phone = text.match(PHONE_RE)?.[0].replace(/[\s-]/g, "").replace(/^\+?91/, "") ?? "";
  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[A-Za-z0-9_\-/%.]+/i)?.[0] ?? "";
  const github = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_\-/.]+/i)?.[0] ?? "";
  const years = (sections.education ?? "").match(/\b(?:19|20)\d{2}\b/g)?.map(Number) ?? [];
  return {
    name: guessName(header),
    email: text.match(EMAIL_RE)?.[0] ?? "",
    phone,
    links: { linkedin, github },
    sections,
    skills: detectSkillLabels(sections.skills ? `${sections.skills}\n${sections.projects ?? ""}\n${sections.experience ?? ""}` : text),
    graduationYear: years.length ? String(Math.max(...years)) : "",
  };
}
