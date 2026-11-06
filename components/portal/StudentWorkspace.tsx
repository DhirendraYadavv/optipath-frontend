"use client";

import React, { useMemo, useState } from "react";
import { FileText, Loader2, Lock } from "lucide-react";
import RoleSelect from "@/components/RoleSelect";
import AtsReportView from "@/components/portal/AtsReportView";
import GapReportView from "@/components/portal/GapReportView";
import TalentOptIn from "@/components/portal/TalentOptIn";
import { useAuth } from "@/components/AuthProvider";
import { GOAL_ROLE_TITLES } from "@/data/goalRoles";
import { runAtsChecks } from "@/lib/atsCheck";
import { buildGapReport } from "@/lib/gapReport";
import { parseResume } from "@/lib/resumeParse";
import { ResumeSignals, extractResumeSignals } from "@/lib/resumeText";
import { StoredStudent, buildAcademicView } from "@/lib/sgtStudent";
import { computeSkillMatch } from "@/lib/skillMatch";
import { validateResumeFile } from "@/lib/talentPool";

interface Details {
  fullName: string;
  email: string;
  phone: string;
  sgtRegNo: string;
  targetRole: string;
  graduationYear: string;
}

const input = "w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]";

export default function StudentWorkspace({ student }: { student: StoredStudent | null }) {
  const { user, openSignIn } = useAuth();

  const [parsedText, setParsedText] = useState("");
  const parsed = useMemo(() => parseResume(parsedText), [parsedText]);
  // Values the page can fill in by itself. The student's own typing always wins.
  const defaults: Details = {
    fullName: student?.fullName || parsed.name || user?.name || "",
    email: parsed.email || user?.email || "",
    phone: parsed.phone,
    sgtRegNo: student?.registrationNo ?? "",
    targetRole: student && GOAL_ROLE_TITLES.includes(student.goal) ? student.goal : "",
    graduationYear: parsed.graduationYear,
  };
  const [edits, setEdits] = useState<Partial<Details>>({});
  const d: Details = { ...defaults, ...edits };
  const set = (k: keyof Details, v: string) => setEdits((e) => ({ ...e, [k]: v }));

  const [file, setFile] = useState<File | null>(null);
  const [signals, setSignals] = useState<ResumeSignals | null>(null);
  const [reading, setReading] = useState(false);
  const [fileMsg, setFileMsg] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(null);
    setSignals(null);
    setParsedText("");
    setFileMsg(null);
    if (!f) return;
    const problem = validateResumeFile(f);
    if (problem) {
      setFileMsg(problem);
      return;
    }
    setFile(f);
    setReading(true);
    try {
      const sig = await extractResumeSignals(f);
      setSignals(sig);
      setParsedText(sig.text);
    } catch (err) {
      setFileMsg(err instanceof Error ? err.message : "We could not read this file.");
    } finally {
      setReading(false);
    }
  }

  const groups = useMemo(() => {
    if (!student) return null;
    const v = buildAcademicView(student);
    return { completed: v.completed.courses, inProgress: v.inProgress.courses, upcoming: v.upcoming };
  }, [student]);

  const text = signals?.text ?? "";
  const foundSkills = useMemo(() => (d.targetRole && text ? computeSkillMatch(d.targetRole, text).covered.map((s) => s.label) : []), [d.targetRole, text]);
  const ats = useMemo(() => (user && signals && d.targetRole ? runAtsChecks(signals, d.targetRole) : null), [user, signals, d.targetRole]);
  const gaps = useMemo(() => (user && d.targetRole ? buildGapReport(d.targetRole, text, groups) : null), [user, d.targetRole, text, groups]);

  return (
    <div className="space-y-5">
      {/* 1. Details and resume */}
      <section className="bg-white border border-[#E5DFD5] rounded-2xl p-5 space-y-3">
        <h2 className="font-serif text-lg font-bold">1. Your details and resume</h2>
        <div>
          <label htmlFor="sw-name" className="text-xs font-bold text-[#64748B] block mb-1">Full name</label>
          <input id="sw-name" className={input} value={d.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="sw-email" className="text-xs font-bold text-[#64748B] block mb-1">Email</label>
            <input id="sw-email" type="email" className={input} value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="sw-phone" className="text-xs font-bold text-[#64748B] block mb-1">Phone</label>
            <input id="sw-phone" type="tel" className={input} value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="sw-reg" className="text-xs font-bold text-[#64748B] block mb-1">SGT registration no. (optional)</label>
            <input id="sw-reg" className={input} value={d.sgtRegNo} onChange={(e) => set("sgtRegNo", e.target.value)} />
          </div>
          <div>
            <label htmlFor="sw-year" className="text-xs font-bold text-[#64748B] block mb-1">Graduation / expected year (optional)</label>
            <input id="sw-year" inputMode="numeric" className={input} value={d.graduationYear} onChange={(e) => set("graduationYear", e.target.value)} placeholder="e.g. 2027" />
          </div>
        </div>
        <div>
          <label htmlFor="sw-role" className="text-xs font-bold text-[#64748B] block mb-1">Target career role</label>
          <RoleSelect id="sw-role" value={d.targetRole} onChange={(r) => set("targetRole", r)} placeholder="Select your target role" />
        </div>
        <div>
          <label htmlFor="sw-file" className="text-xs font-bold text-[#64748B] block mb-1">Resume (PDF or DOCX, up to 5 MB)</label>
          <input
            id="sw-file"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => void onFile(e)}
            className="block w-full text-xs file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#831843] file:text-white file:font-bold file:cursor-pointer"
          />
          {reading && <p className="text-xs text-[#526173] mt-2 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Reading your resume on this device...</p>}
          {file && signals && !reading && <p className="text-xs text-emerald-800 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Read {file.name}. It stays in your browser until you publish.</p>}
          {fileMsg && <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2" role="status">{fileMsg}</p>}
        </div>
      </section>

      {/* 2. ATS check, locked by Google sign-in */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold">2. Make your resume ATS-friendly</h2>
        {!user ? (
          <div className="bg-white border border-dashed border-[#831843]/50 rounded-2xl p-6 text-center space-y-3">
            <Lock className="w-6 h-6 text-[#831843] mx-auto" />
            <p className="text-sm font-bold">This check is locked</p>
            <p className="text-xs text-[#526173]">Sign in with Google to run the ATS-readiness check, see your Foundation and Production gaps, and get fixes.</p>
            <button onClick={() => openSignIn()} className="px-6 py-2.5 bg-[#831843] hover:bg-[#701237] text-white text-xs font-bold rounded-full cursor-pointer">Sign in with Google to unlock</button>
          </div>
        ) : !signals ? (
          <p className="text-xs text-[#526173] bg-white border border-[#E5DFD5] rounded-xl p-4">Upload your resume above to run the check.</p>
        ) : !d.targetRole ? (
          <p className="text-xs text-[#526173] bg-white border border-[#E5DFD5] rounded-xl p-4">Choose your target role above. The check compares your resume with that role.</p>
        ) : (
          <>
            {ats && <AtsReportView report={ats} />}
            {gaps && gaps.hasInput && <GapReportView report={gaps} role={d.targetRole} showPlans={student !== null} />}
          </>
        )}
      </section>

      {/* 3. Talent pool */}
      {file && (
        <TalentOptIn
          fields={{ fullName: d.fullName, email: d.email, phone: d.phone, sgtRegNo: d.sgtRegNo, targetRole: d.targetRole, graduationYear: d.graduationYear }}
          file={file}
          skills={foundSkills}
          program={student?.program ?? ""}
        />
      )}
    </div>
  );
}
