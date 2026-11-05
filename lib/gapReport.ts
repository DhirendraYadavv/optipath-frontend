// lib/gapReport.ts
// Turns resume skills + a target role + (optionally) the student's SGT coursework into a gap report:
// Foundation gaps vs Production gaps, the SGT course that bridges each one, and project ideas.
// Pure functions only, so the whole report is unit-tested.

import { AcademicStatus, CourseGroups, SkillItem, SkillMatchResult, analyzeAcademicGap, computeSkillMatch } from "@/lib/skillMatch";
import { ProjectIdea, projectIdeasFor } from "@/lib/careerResources";

export interface GapPlan {
  status: AcademicStatus;
  course?: string;
  semester?: number;
}

export interface GapAction {
  skill: SkillItem;
  tier: "foundation" | "production";
  plan: GapPlan;
}

export interface StudentGapReport {
  hasInput: boolean;
  match: SkillMatchResult | null;
  foundation: GapAction[];
  production: GapAction[];
  projects: ProjectIdea[];
}

const EMPTY: StudentGapReport = { hasInput: false, match: null, foundation: [], production: [], projects: [] };

export function planText(plan: GapPlan): string {
  switch (plan.status) {
    case "completed":
      return `Your completed course "${plan.course}" covers this. Add it to your resume.`;
    case "in_progress":
      return `Your current course "${plan.course}" covers this. Add it once you finish.`;
    case "upcoming":
      return `"${plan.course}" in Semester ${plan.semester} covers this.`;
    default:
      return "Not taught in your remaining SGT syllabus. Learn it on your own.";
  }
}

export function buildGapReport(role: string, skillsText: string, groups: CourseGroups | null): StudentGapReport {
  if (!role || !skillsText.trim()) return EMPTY;
  const match = computeSkillMatch(role, skillsText);

  const byId = new Map<string, GapPlan>();
  if (groups) {
    for (const row of analyzeAcademicGap(role, groups).rows) {
      byId.set(row.skill.id, { status: row.status, course: row.viaCourse, semester: row.semester });
    }
  }
  const planFor = (s: SkillItem): GapPlan => byId.get(s.id) ?? { status: "self_learn" };

  const foundation = match.foundationGaps.map((skill) => ({ skill, tier: "foundation" as const, plan: planFor(skill) }));
  const production = match.productionGaps.map((skill) => ({ skill, tier: "production" as const, plan: planFor(skill) }));

  const wanted = production.map((a) => a.skill.label.toLowerCase());
  const overlap = (p: ProjectIdea) => p.skills.filter((s) => wanted.some((w) => w.includes(s.toLowerCase()) || s.toLowerCase().includes(w))).length;
  const projects = [...projectIdeasFor(match.family)].sort((a, b) => overlap(b) - overlap(a)).slice(0, 3);

  return { hasInput: true, match, foundation, production, projects };
}
