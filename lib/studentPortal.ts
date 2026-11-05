// lib/studentPortal.ts
// Student login for the portal. Uses the same endpoint and body as /login: POST /auth/student-login { registrationNo, dob }.

import { StoredStudent, TEST_REG_NO, buildDevTestStudent, normalizeBackendStudent } from "@/lib/sgtStudent";
import { API_URL } from "@/lib/siteConfig";

export interface StudentLoginFields {
  registrationNo: string;
  dob: string;
}

export type StudentLoginErrors = Partial<Record<keyof StudentLoginFields, string>>;

export function validateStudentLogin(f: StudentLoginFields, now: Date = new Date()): StudentLoginErrors {
  const e: StudentLoginErrors = {};
  if (!/^[A-Za-z0-9-]{4,30}$/.test(f.registrationNo.trim())) e.registrationNo = "Enter your registration number, e.g. SGT2023BCA1042.";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f.dob.trim());
  const d = m ? new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))) : null;
  const real = d && d.getUTCFullYear() === Number(m?.[1]) && d.getUTCMonth() === Number(m?.[2]) - 1 && d.getUTCDate() === Number(m?.[3]);
  if (!real || !d || d.getTime() > now.getTime()) e.dob = "Enter your date of birth.";
  return e;
}

export type StudentLoginResult = { ok: true; student: StoredStudent; token?: string } | { ok: false; error: string };

const IS_DEV = process.env.NODE_ENV !== "production";

export async function loginSgtStudent(registrationNo: string, dob: string, goal = ""): Promise<StudentLoginResult> {
  const reg = registrationNo.trim().toUpperCase();
  try {
    const res = await fetch(`${API_URL}/auth/student-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationNo: reg, dob: dob.trim() }),
    });
    let data: Record<string, unknown> | null = null;
    try {
      const parsed: unknown = await res.json();
      data = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    } catch {
      /* non-JSON response */
    }
    if (!res.ok) {
      return { ok: false, error: typeof data?.detail === "string" ? data.detail : "Invalid registration number or date of birth." };
    }
    const student = normalizeBackendStudent(data?.student, goal);
    if (!student) return { ok: false, error: "The university record is incomplete. Please contact your coordinator." };
    return { ok: true, student, token: typeof data?.access_token === "string" ? data.access_token : undefined };
  } catch {
    if (IS_DEV && reg === TEST_REG_NO) return { ok: true, student: buildDevTestStudent(goal) };
    return { ok: false, error: "Cannot reach the server right now. Please try again in a little while." };
  }
}
