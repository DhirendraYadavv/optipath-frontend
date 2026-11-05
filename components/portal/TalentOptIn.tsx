"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { TALENT_UPLOAD_URL } from "@/lib/siteConfig";
import { CONSENT_TEXT, UploadErrors, UploadFields, buildUploadFormData, validateUpload } from "@/lib/talentPool";
import { readStudentToken } from "@/lib/studentStore";

interface Props {
  fullName: string;
  registrationNo: string;
  program: string;
  role: string;
  file: File | null;
  /** Skill labels found in the resume, sent so recruiters can see them. */
  skills: string[];
}

export default function TalentOptIn({ fullName, registrationNo, program, role, file, skills }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<UploadErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function publish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fields: UploadFields = { fullName, email, phone, sgtRegNo: registrationNo, targetRole: role, graduationYear: year, consent };
    const found = validateUpload(fields, file);
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
        body: buildUploadFormData(fields, file, file.name, { skills: JSON.stringify(skills), program, source: "student-portal" }),
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
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Your profile is now visible to verified recruiters. You can ask us to remove it at any time.
      </div>
    );
  }

  const input = "w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]";
  const err = (k: keyof UploadErrors) => (errors[k] ? <p className="text-[11px] text-red-700 mt-1" role="alert">{errors[k]}</p> : null);

  return (
    <form onSubmit={publish} noValidate className="bg-white border border-[#E5DFD5] rounded-2xl p-5 space-y-3">
      <h3 className="font-serif text-lg font-bold">Talent Pool opt-in</h3>
      <p className="text-[11px] text-[#526173]">Publishing sends your resume, the skills found above and the contact details below to our servers. Nothing is published unless you tick the box.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="oi-email" className="text-xs font-bold text-[#64748B] block mb-1">Email</label>
          <input id="oi-email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="oi-phone" className="text-xs font-bold text-[#64748B] block mb-1">Phone</label>
          <input id="oi-phone" type="tel" className={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="oi-year" className="text-xs font-bold text-[#64748B] block mb-1">Graduation year (optional)</label>
          <input id="oi-year" inputMode="numeric" className={input} value={year} onChange={(e) => setYear(e.target.value)} />
          {err("graduationYear")}
        </div>
      </div>
      {err("resume")}
      {err("targetRole")}
      <label className="flex items-start gap-2 text-xs cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>{CONSENT_TEXT}</span>
      </label>
      {err("consent")}
      {serverError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{serverError}</p>}
      <button type="submit" disabled={status === "sending"} className="px-6 py-2.5 bg-[#831843] hover:bg-[#701237] disabled:opacity-60 text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer">
        {status === "sending" ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : "Publish my profile to the Talent Pool"}
      </button>
    </form>
  );
}
