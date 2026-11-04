// lib/sgtStudent.ts
// SGT student record handling: normalising the backend response and splitting coursework
// into completed / in progress / upcoming using data/sgtCurriculum.ts as the master catalogue.

import { SGT_PROGRAMS, CourseData } from "@/data/sgtCurriculum";

export const TEST_REG_NO = "SGT2023BCA1042";

export interface StoredStudent {
  registrationNo: string;
  fullName: string;
  /** Program as sent by the backend, e.g. "BCA". */
  program: string;
  /** Key into SGT_PROGRAMS, or null if the program is not in the catalogue. */
  programKey: string | null;
  currentSemester: number;
  /** Kept for older pages that read `semester`. Always equals currentSemester. */
  semester: number;
  completedCourses: string[];
  upcomingCourses: string[];
  goal: string;
  isExternal: false;
  dataSource: "backend" | "dev-fallback";
}

/** Maps "BCA", "Bachelor of Computer Applications (BCA)", "B.Com" ... to a SGT_PROGRAMS key. */
export function resolveProgramKey(program?: string | null): string | null {
  if (!program) return null;
  const text = program.toLowerCase().replace(/\./g, "");
  for (const [key, p] of Object.entries(SGT_PROGRAMS)) {
    const code = p.code.toLowerCase();
    const re = new RegExp("(^|[^a-z])(" + key + "|" + code + ")([^a-z]|$)");
    if (re.test(text)) return key;
  }
  return null;
}

function toStringList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];
}

/** Validates the backend `student` object. Returns null if the essentials are missing. */
export function normalizeBackendStudent(input: unknown, goal: string): StoredStudent | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const registrationNo = typeof raw.registrationNo === "string" ? raw.registrationNo.trim().toUpperCase() : "";
  const fullName = typeof raw.fullName === "string" ? raw.fullName.trim() : "";
  const sem = Number(raw.currentSemester);
  if (!registrationNo || !fullName || !Number.isInteger(sem) || sem < 1) return null;
  const program = typeof raw.program === "string" ? raw.program : "";
  return {
    registrationNo,
    fullName,
    program,
    programKey: resolveProgramKey(program),
    currentSemester: sem,
    semester: sem,
    completedCourses: toStringList(raw.completedCourses),
    upcomingCourses: toStringList(raw.upcomingCourses),
    goal,
    isExternal: false,
    dataSource: "backend",
  };
}

/** Local-development stand-in used only when the backend is unreachable. */
export function buildDevTestStudent(goal: string): StoredStudent {
  return {
    registrationNo: TEST_REG_NO,
    fullName: "Test Student",
    program: "BCA",
    programKey: "bca",
    currentSemester: 4,
    semester: 4,
    completedCourses: [],
    upcomingCourses: [],
    goal,
    isExternal: false,
    dataSource: "dev-fallback",
  };
}

export interface AcademicView {
  program: CourseData | null;
  totalSemesters: number;
  currentSemester: number;
  completed: { courses: string[]; source: "backend" | "catalog" | "none"; note: string };
  inProgress: { courses: string[]; loaded: boolean };
  /** Mapped future semesters from the catalogue. */
  upcoming: { semester: number; courses: string[] }[];
  /** Future semesters of the degree that the catalogue does not contain. */
  unmappedSemesters: number[];
}

function totalSemestersOf(p: CourseData): number {
  const m = p.duration.match(/\((\d+)\s*Semesters?\)/i);
  const mapped = Object.keys(p.semesters).map(Number);
  const maxMapped = mapped.length ? Math.max(...mapped) : 0;
  return m ? Math.max(Number(m[1]), maxMapped) : maxMapped;
}

export function buildAcademicView(s: StoredStudent): AcademicView {
  const program = s.programKey ? SGT_PROGRAMS[s.programKey] ?? null : null;
  const cur = s.currentSemester;

  if (!program) {
    return {
      program: null,
      totalSemesters: 0,
      currentSemester: cur,
      completed: { courses: s.completedCourses, source: s.completedCourses.length ? "backend" : "none", note: "" },
      inProgress: { courses: [], loaded: false },
      upcoming: [],
      unmappedSemesters: [],
    };
  }

  const total = totalSemestersOf(program);
  const semCourses = (n: number): string[] => program.semesters[n] ?? [];

  // Completed: backend record first; otherwise the catalogue for Semesters 1..(current-1).
  let completed: AcademicView["completed"];
  if (s.completedCourses.length > 0) {
    completed = { courses: s.completedCourses, source: "backend", note: "From your verified university record." };
  } else if (cur > 1) {
    const list: string[] = [];
    for (let n = 1; n < cur; n++) list.push(...semCourses(n));
    completed = {
      courses: list,
      source: "catalog",
      note: `Your record has no completed courses yet, so this list shows the syllabus for Semesters 1 to ${cur - 1}.`,
    };
  } else {
    completed = { courses: [], source: "none", note: "No completed semesters yet." };
  }

  const currentCourses = semCourses(cur);
  const upcoming: AcademicView["upcoming"] = [];
  const unmapped: number[] = [];
  for (let n = cur + 1; n <= total; n++) {
    const c = semCourses(n);
    if (c.length > 0) upcoming.push({ semester: n, courses: c });
    else unmapped.push(n);
  }

  return {
    program,
    totalSemesters: total,
    currentSemester: cur,
    completed,
    inProgress: { courses: currentCourses, loaded: currentCourses.length > 0 },
    upcoming,
    unmappedSemesters: unmapped,
  };
}
