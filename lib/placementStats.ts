// lib/placementStats.ts
// Turns the anonymous candidate rows from /placement/summary into the numbers the placement cell sees.
// Skill gaps use the same matcher as the student report, so the two always agree.

import { computeSkillMatch } from "@/lib/skillMatch";

export interface CandidateRow {
  targetRole: string;
  program: string;
  skills: string[];
  atsScore: number | null;
}

export interface SummaryResponse {
  roster: { total: number; byProgram: Record<string, number>; bySemester: Record<string, number> };
  pool: { total: number; withScore: number; byBand: Record<string, number> };
  candidates: CandidateRow[];
}

export interface Tally {
  label: string;
  count: number;
}

export interface GapCluster {
  skill: string;
  kind: "foundation" | "production";
  /** Candidates (with at least one listed skill) who are missing this skill for their own target role. */
  count: number;
  roles: string[];
}

export interface PlacementStats {
  byProgram: Tally[];
  byRole: Tally[];
  /** Candidates whose listed skills we could compare with their target role. */
  analysed: number;
  gaps: GapCluster[];
  averageScore: number | null;
  /** Share of the roster that has uploaded a resume, 0 to 100. */
  coverage: number;
}

export function parseSummary(body: unknown): SummaryResponse | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Partial<SummaryResponse>;
  if (!b.roster || !b.pool || !Array.isArray(b.candidates)) return null;
  const candidates = b.candidates.filter((c): c is CandidateRow => !!c && typeof c.targetRole === "string" && Array.isArray(c.skills));
  return { roster: b.roster, pool: b.pool, candidates };
}

function tally(items: string[]): Tally[] {
  const m = new Map<string, number>();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return [...m.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildPlacementStats(s: SummaryResponse): PlacementStats {
  const gaps = new Map<string, GapCluster>();
  let analysed = 0;
  for (const c of s.candidates) {
    if (c.skills.length === 0) continue;
    analysed++;
    const m = computeSkillMatch(c.targetRole, c.skills.join(", "));
    for (const [list, kind] of [[m.foundationGaps, "foundation"], [m.productionGaps, "production"]] as const) {
      for (const g of list) {
        const key = `${kind}:${g.label}`;
        const cur = gaps.get(key) ?? { skill: g.label, kind, count: 0, roles: [] };
        cur.count++;
        if (!cur.roles.includes(c.targetRole)) cur.roles.push(c.targetRole);
        gaps.set(key, cur);
      }
    }
  }
  const scores = s.candidates.map((c) => c.atsScore).filter((x): x is number => typeof x === "number");
  return {
    byProgram: tally(s.candidates.map((c) => c.program || "Not given")),
    byRole: tally(s.candidates.map((c) => c.targetRole)),
    analysed,
    gaps: [...gaps.values()].sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill)).slice(0, 12),
    averageScore: scores.length ? Math.round(scores.reduce((n, x) => n + x, 0) / scores.length) : null,
    coverage: s.roster.total ? Math.min(100, Math.round((s.pool.total / s.roster.total) * 100)) : 0,
  };
}
