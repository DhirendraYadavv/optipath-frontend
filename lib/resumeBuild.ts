// lib/resumeBuild.ts
// Rebuilds a resume into an ATS-friendly layout using ONLY the words the student already wrote.
// It never adds skills, jobs, dates or numbers. It changes structure: one column, standard headings, plain bullets.

import type { DocBlock } from "@/lib/docxWriter";
import type { ParsedResume } from "@/lib/resumeParse";

export interface BuildDetails {
  fullName: string;
  email: string;
  phone: string;
}

const ORDER: { key: string; title: string }[] = [
  { key: "summary", title: "Summary" },
  { key: "education", title: "Education" },
  { key: "skills", title: "Skills" },
  { key: "experience", title: "Experience" },
  { key: "projects", title: "Projects" },
  { key: "certifications", title: "Certifications" },
];

const BULLET_RE = /^[\s•●▪◦‣⁃·–—*>\-]+\s*/;
const BULLET_LEAD = /^\s*[•●▪◦‣⁃·*>\-–—]\s+/;

function bodyBlocks(key: string, body: string): DocBlock[] {
  const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
  if (key === "skills") {
    // Skills read best as one plain comma-separated line per original line.
    return lines.map((l) => ({ kind: "line" as const, text: l.replace(BULLET_RE, "").replace(/\s*[|•·]\s*/g, ", ") }));
  }
  return lines.map((l) => {
    if (BULLET_LEAD.test(l)) return { kind: "bullet" as const, text: l.replace(BULLET_RE, "") };
    // In experience and projects, long sentences are achievements: show them as bullets. Short lines are titles/dates.
    if ((key === "experience" || key === "projects") && l.length > 60) return { kind: "bullet" as const, text: l };
    return { kind: "line" as const, text: l };
  });
}

export function buildAtsBlocks(parsed: ParsedResume, d: BuildDetails): DocBlock[] {
  const blocks: DocBlock[] = [];
  const name = d.fullName.trim() || parsed.name;
  if (name) blocks.push({ kind: "name", text: name });
  const contact = [d.email.trim() || parsed.email, d.phone.trim() || parsed.phone, parsed.links.linkedin, parsed.links.github].filter(Boolean);
  if (contact.length) blocks.push({ kind: "contact", text: contact.join(" | ") });

  for (const { key, title } of ORDER) {
    const body = parsed.sections[key];
    if (!body || !body.trim()) continue;
    blocks.push({ kind: "heading", text: title });
    blocks.push(...bodyBlocks(key, body));
  }
  // Skills the resume mentions elsewhere, but which has no Skills section: list only skills found in the text.
  if (!parsed.sections.skills && parsed.skills.length) {
    blocks.push({ kind: "heading", text: "Skills" }, { kind: "line", text: parsed.skills.join(", ") });
  }
  return blocks;
}

export function blocksToText(blocks: DocBlock[]): string {
  return blocks.map((b) => (b.kind === "bullet" ? `• ${b.text}` : b.text)).join("\n");
}

/** True when the rebuilt resume is too thin to be worth downloading (for example a scanned file). */
export function isBuildable(blocks: DocBlock[]): boolean {
  return blocks.filter((b) => b.kind === "heading").length >= 2;
}
