// lib/programRecommend.ts
// Which SGT Online programme fits a non-SGT candidate, and how much of their skill gap it teaches.
// Course coverage comes from data/sgtCurriculum.ts (the approved catalogue), never from assumptions.

import { SGT_PROGRAMS, CourseData } from "@/data/sgtCurriculum";
import { RoleFamily, SkillItem, analyzeAcademicGap, detectRoleFamily } from "@/lib/skillMatch";

export type Qualification = "12th" | "nontech_grad" | "tech_grad" | "postgrad";

export const QUALIFICATIONS: { value: Qualification; label: string }[] = [
  { value: "12th", label: "12th pass / not yet a graduate" },
  { value: "nontech_grad", label: "Graduate, non-tech (BA, B.Sc, B.Com, etc.)" },
  { value: "tech_grad", label: "Graduate, tech (BCA, B.Sc IT, B.Tech, etc.)" },
  { value: "postgrad", label: "Postgraduate" },
];

export function qualificationLabel(q: string | undefined): string {
  return QUALIFICATIONS.find((x) => x.value === q)?.label ?? "Not provided";
}

const TECH: RoleFamily[] = ["sde", "backend", "frontend", "fullstack", "devops", "data_ai", "data_eng", "security", "blockchain", "mobile", "qa"];
const MANAGEMENT: RoleFamily[] = ["marketing", "finance", "hr", "operations", "bizanalytics", "business"];

export type GoalTrack = "tech" | "management" | "other";

export function goalTrack(family: RoleFamily): GoalTrack {
  if (TECH.includes(family)) return "tech";
  if (MANAGEMENT.includes(family)) return "management";
  return "other";
}

/** Programme chosen by the agreed rules, plus other programmes at the same level. */
export function recommendPrograms(q: Qualification, family: RoleFamily): { recommended: string | null; options: string[]; note: string } {
  const track = goalTrack(family);

  if (q === "postgrad") {
    return { recommended: null, options: [], note: "Your qualification already meets the degree requirement for this goal. The focus now is closing the specific skill gaps below." };
  }
  if (track === "other") {
    return { recommended: null, options: [], note: "None of the five SGT Online programmes maps directly to this occupation, so no programme is recommended. The skill gaps below use general software fundamentals." };
  }

  if (q === "12th") {
    if (track === "tech") return { recommended: "bca", options: ["bca", "bba", "bcom"], note: "" };
    if (family === "finance") return { recommended: "bcom", options: ["bcom", "bba", "bca"], note: "" };
    return { recommended: "bba", options: ["bba", "bcom", "bca"], note: "" };
  }
  // graduates (tech or non-tech)
  if (track === "tech") return { recommended: "mca", options: ["mca", "mba"], note: "" };
  return { recommended: "mba", options: ["mba", "mca"], note: "" };
}

function totalSemesters(p: CourseData): number {
  const m = p.duration.match(/\((\d+)\s*Semesters?\)/i);
  const mapped = Object.keys(p.semesters).map(Number);
  const maxMapped = mapped.length ? Math.max(...mapped) : 0;
  return m ? Math.max(Number(m[1]), maxMapped) : maxMapped;
}

export interface CoveredGap {
  skill: SkillItem;
  semester: number;
  course: string;
}

export interface ProgramFit {
  key: string;
  program: CourseData;
  recommended: boolean;
  covered: CoveredGap[];
  unmappedSemesters: number[];
}

export interface ProgramEvaluation {
  fits: ProgramFit[];
  /** Missing skills that the recommended programme (or any programme, if none recommended) does not teach. */
  selfLearn: SkillItem[];
  note: string;
}

export function evaluatePrograms(role: string, q: Qualification, missing: SkillItem[]): ProgramEvaluation {
  const family = detectRoleFamily(role);
  const rec = recommendPrograms(q, family);
  const missingIds = new Set(missing.map((m) => m.id));

  const fits: ProgramFit[] = rec.options
    .filter((k) => SGT_PROGRAMS[k])
    .map((key) => {
      const program = SGT_PROGRAMS[key];
      const upcoming = Object.entries(program.semesters).map(([sem, courses]) => ({ semester: Number(sem), courses }));
      const result = analyzeAcademicGap(role, { completed: [], inProgress: [], upcoming });
      const covered: CoveredGap[] = result.rows
        .filter((r) => r.status === "upcoming" && missingIds.has(r.skill.id) && r.viaCourse && r.semester)
        .map((r) => ({ skill: r.skill, semester: r.semester as number, course: r.viaCourse as string }));
      const total = totalSemesters(program);
      const unmapped: number[] = [];
      for (let n = 1; n <= total; n++) if (!(program.semesters[n]?.length > 0)) unmapped.push(n);
      return { key, program, recommended: key === rec.recommended, covered, unmappedSemesters: unmapped };
    });

  // Keep the recommended programme always; show others only if they teach at least one gap.
  const shown = fits.filter((f) => f.recommended || f.covered.length > 0);

  const recFit = fits.find((f) => f.recommended);
  const coveredIds = new Set((recFit?.covered ?? []).map((c) => c.skill.id));
  const selfLearn = missing.filter((m) => !coveredIds.has(m.id));

  return { fits: shown, selfLearn, note: rec.note };
}
