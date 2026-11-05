// lib/studentPortalSession.ts
// Reads the stored student record (unknown shape in localStorage) back into a StoredStudent, or null.

import { StoredStudent, normalizeBackendStudent } from "@/lib/sgtStudent";

export function normalizeStoredStudent(record: Record<string, unknown>): StoredStudent | null {
  const base = normalizeBackendStudent(record, typeof record.goal === "string" ? record.goal : "");
  if (!base) return null;
  return { ...base, dataSource: record.dataSource === "dev-fallback" ? "dev-fallback" : "backend" };
}
