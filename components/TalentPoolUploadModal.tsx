"use client";

import React, { useRef, useState } from "react";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { GOAL_ROLES, TRACK_LABELS, type GoalTrack } from "@/data/goalRoles";
import { TALENT_UPLOAD_URL } from "@/lib/siteConfig";
import { CONSENT_TEXT, UploadErrors, UploadFields, buildUploadFormData, validateUpload } from "@/lib/talentPool";

const EMPTY: UploadFields = { fullName: "", email: "", phone: "", sgtRegNo: "", targetRole: "", graduationYear: "", consent: false };
const TIMEOUT_MS = 20000;

type Status = "idle" | "submitting" | "done";

export default function TalentPoolUploadModal({ onClose }: { onClose: () => void }) {
  const [fields, setFields] = useState<UploadFields>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<UploadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof UploadFields>(key: K, value: UploadFields[K]) => setFields((f) => ({ ...f, [key]: value }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const found = validateUpload(fields, file);
    setErrors(found);
    if (Object.keys(found).length > 0 || !file) return;

    setStatus("submitting");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(TALENT_UPLOAD_URL, {
        method: "POST",
        body: buildUploadFormData(fields, file, file.name),
        signal: controller.signal,
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      setStatus("idle");
      setServerError(
        res.status >= 400 && res.status < 500
          ? "The server did not accept this upload. Please check your details and the file, then try again."
          : "The Talent Pool service had a problem. Please try again in a few minutes."
      );
    } catch {
      setStatus("idle");
      setServerError("Could not reach the Talent Pool service. Your resume was not uploaded. Please try again later.");
    } finally {
      clearTimeout(timer);
    }
  }

  const input = "w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]";
  const err = (k: keyof UploadErrors) => (errors[k] ? <p className="text-[11px] text-red-700 mt-1" role="alert">{errors[k]}</p> : null);
  const tracks = Object.keys(TRACK_LABELS) as GoalTrack[];

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Upload resume to Talent Pool">
      <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-xl w-full p-7 shadow-2xl relative text-[#0E1726] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Talent Pool</span>
            <h3 className="font-serif text-2xl font-bold">Upload your resume</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === "done" ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
            <p className="font-serif text-xl font-bold">Resume received</p>
            <p className="text-xs text-[#526173]">Verified recruiters can now find your profile for the role you chose. You can ask us to remove it at any time.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-[#831843] text-white text-xs font-bold rounded-full cursor-pointer">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
            <div>
              <label htmlFor="tp-name" className="text-xs font-bold text-[#64748B] block mb-1">Full name</label>
              <input id="tp-name" className={input} value={fields.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
              {err("fullName")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="tp-email" className="text-xs font-bold text-[#64748B] block mb-1">Email</label>
                <input id="tp-email" type="email" className={input} value={fields.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                {err("email")}
              </div>
              <div>
                <label htmlFor="tp-phone" className="text-xs font-bold text-[#64748B] block mb-1">Phone</label>
                <input id="tp-phone" type="tel" className={input} value={fields.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" autoComplete="tel" />
                {err("phone")}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="tp-reg" className="text-xs font-bold text-[#64748B] block mb-1">SGT registration no. (optional)</label>
                <input id="tp-reg" className={input} value={fields.sgtRegNo} onChange={(e) => set("sgtRegNo", e.target.value)} />
                {err("sgtRegNo")}
              </div>
              <div>
                <label htmlFor="tp-year" className="text-xs font-bold text-[#64748B] block mb-1">Graduation / expected year (optional)</label>
                <input id="tp-year" inputMode="numeric" className={input} value={fields.graduationYear} onChange={(e) => set("graduationYear", e.target.value)} placeholder="e.g. 2027" />
                {err("graduationYear")}
              </div>
            </div>
            <div>
              <label htmlFor="tp-role" className="text-xs font-bold text-[#64748B] block mb-1">Target career role</label>
              <select id="tp-role" className={input} value={fields.targetRole} onChange={(e) => set("targetRole", e.target.value)}>
                <option value="">Select a role</option>
                {tracks.map((t) => (
                  <optgroup key={t} label={TRACK_LABELS[t]}>
                    {GOAL_ROLES.filter((r) => r.track === t).map((r) => (
                      <option key={r.title} value={r.title}>{r.title}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {err("targetRole")}
            </div>
            <div>
              <label htmlFor="tp-file" className="text-xs font-bold text-[#64748B] block mb-1">Resume (PDF or DOCX, up to 5 MB)</label>
              <input
                id="tp-file"
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-xs file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#831843] file:text-white file:font-bold file:cursor-pointer"
              />
              {err("resume")}
            </div>
            <div>
              <label className="flex items-start gap-2 text-xs text-[#0E1726] cursor-pointer">
                <input type="checkbox" checked={fields.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5" />
                <span>{CONSENT_TEXT}</span>
              </label>
              {err("consent")}
            </div>

            {serverError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{serverError}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-3 bg-[#831843] hover:bg-[#701237] disabled:opacity-60 text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer"
            >
              {status === "submitting" ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload to Talent Pool</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
