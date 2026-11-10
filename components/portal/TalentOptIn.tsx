"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { TALENT_UPLOAD_URL } from "@/lib/siteConfig";
import { CONSENT_TEXT, UploadErrors, UploadFields, buildUploadFormData, validateUpload } from "@/lib/talentPool";
import { readStudentToken } from "@/lib/studentStore";

interface Props {
  /** Everything except consent, collected by the details form above. */
  fields: Omit<UploadFields, "consent">;
  file: File | null;
  /** Skill labels found in the resume, sent so recruiters can see them. */
  skills: string[];
  program: string;
  /** Checklist score, only when the student is signed in and the check ran. */
  atsScore?: number;
}

export default function TalentOptIn({ fields, file, skills, program, atsScore }: Props) {
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<UploadErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function publish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const all: UploadFields = { ...fields, consent };
    const found = validateUpload(all, file);
    setErrors(found);
    if (Object.keys(found).length > 0 || !file) return;

    setStatus("sending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const token = readStudentToken();
      const res = await fetch(TALENT_UPLOAD_URL, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: buildUploadFormData(all, file, file.name, { skills: JSON.stringify(skills), program, source: "student-portal", ...(atsScore === undefined ? {} : { atsScore: String(atsScore) }) }),
        signal: controller.signal,
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      setStatus("idle");
      setServerError(res.status >= 500 ? "The Talent Pool service had a problem. Please try again shortly." : "The server did not accept this. Please check your details and try again.");
    } catch {
      setStatus("idle");
      setServerError("Could not reach the Talent Pool service. Nothing was published.");
    } finally {
      clearTimeout(timer);
    }
  }

  if (status === "done") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 flex items-start gap-2" role="status">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Your resume is now in the Talent Pool for verified recruiters. You can ask us to remove it at any time.
      </div>
    );
  }

  const err = (k: keyof UploadErrors) => (errors[k] ? <p className="text-[11px] text-red-700" role="alert">{errors[k]}</p> : null);

  return (
    <form onSubmit={publish} noValidate className="bg-white border border-[#E5DFD5] rounded-2xl p-5 space-y-3">
      <h3 className="font-serif text-lg font-bold">Join the Talent Pool</h3>
      <p className="text-[11px] text-[#526173]">Publishing sends your resume, the details above and the skills found in it to our servers. Nothing is published unless you tick the box.</p>
      {(["fullName", "email", "phone", "sgtRegNo", "targetRole", "graduationYear", "resume"] as const).map((k) => (
        <React.Fragment key={k}>{err(k)}</React.Fragment>
      ))}
      <label className="flex items-start gap-2 text-xs cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>{CONSENT_TEXT}</span>
      </label>
      {err("consent")}
      {serverError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{serverError}</p>}
      <button type="submit" disabled={status === "sending"} className="px-6 py-2.5 bg-[#831843] hover:bg-[#701237] disabled:opacity-60 text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer">
        {status === "sending" ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : "Publish my resume to the Talent Pool"}
      </button>
    </form>
  );
}
