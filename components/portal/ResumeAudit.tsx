"use client";

import React, { useMemo, useState } from "react";
import { FileText, Loader2, LogOut } from "lucide-react";
import RoleSelect from "@/components/RoleSelect";
import GapReportView from "@/components/portal/GapReportView";
import TalentOptIn from "@/components/portal/TalentOptIn";
import { GOAL_ROLE_TITLES } from "@/data/goalRoles";
import { buildGapReport } from "@/lib/gapReport";
import { extractResumeText } from "@/lib/resumeText";
import { StoredStudent, buildAcademicView } from "@/lib/sgtStudent";
import { clearStudent } from "@/lib/studentStore";
import { validateResumeFile } from "@/lib/talentPool";

export default function ResumeAudit({ student }: { student: StoredStudent }) {
  const [role, setRole] = useState(GOAL_ROLE_TITLES.includes(student.goal) ? student.goal : "");
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [extra, setExtra] = useState("");
  const [reading, setReading] = useState(false);
  const [fileMsg, setFileMsg] = useState<string | null>(null);

  const groups = useMemo(() => {
    const v = buildAcademicView(student);
    return { completed: v.completed.courses, inProgress: v.inProgress.courses, upcoming: v.upcoming };
  }, [student]);

  const report = useMemo(() => buildGapReport(role, `${resumeText}\n${extra}`, groups), [role, resumeText, extra, groups]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setResumeText("");
    setFile(null);
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
      const text = await extractResumeText(f);
      setResumeText(text);
      if (text.length < 30) setFileMsg("We could not find readable text in this file (it may be a scanned picture). Type your skills in the box below instead.");
    } catch (err) {
      setFileMsg(err instanceof Error ? `${err.message} You can type your skills in the box below instead.` : "We could not read this file. Type your skills in the box below instead.");
    } finally {
      setReading(false);
    }
  }

  const foundLabels = report.match ? report.match.covered.map((s) => s.label) : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E5DFD5] rounded-2xl px-4 py-3">
        <p className="text-xs">
          Signed in: <b>{student.fullName}</b> ({student.registrationNo}{student.program ? `, ${student.program}` : ""})
        </p>
        <button onClick={clearStudent} className="text-xs font-bold text-[#831843] hover:underline flex items-center gap-1 cursor-pointer">
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>

      <section className="bg-white border border-[#E5DFD5] rounded-2xl p-5 space-y-4">
        <div>
          <label htmlFor="ra-role" className="text-xs font-bold text-[#64748B] block mb-1">Career goal</label>
          <RoleSelect id="ra-role" value={role} onChange={setRole} placeholder="Select your target role" />
        </div>
        <div>
          <label htmlFor="ra-file" className="text-xs font-bold text-[#64748B] block mb-1">Resume (PDF or DOCX, up to 5 MB)</label>
          <input
            id="ra-file"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => void onFile(e)}
            className="block w-full text-xs file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#831843] file:text-white file:font-bold file:cursor-pointer"
          />
          {reading && <p className="text-xs text-[#526173] mt-2 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Reading your resume on this device...</p>}
          {file && !reading && resumeText.length >= 30 && (
            <p className="text-xs text-emerald-800 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Read {file.name}. The text stays in your browser until you publish.</p>
          )}
          {fileMsg && <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2" role="status">{fileMsg}</p>}
        </div>
        <div>
          <label htmlFor="ra-extra" className="text-xs font-bold text-[#64748B] block mb-1">Add or correct skills (optional)</label>
          <textarea
            id="ra-extra"
            rows={3}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="e.g. Python, SQL, Git, Docker"
            className="w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
          />
        </div>
      </section>

      {!role && <p className="text-xs text-[#526173]">Choose a career goal to see your gap analysis.</p>}
      {role && !report.hasInput && <p className="text-xs text-[#526173]">Upload your resume or type your skills to see your gap analysis.</p>}

      <GapReportView report={report} role={role} />

      {report.hasInput && (
        <TalentOptIn fullName={student.fullName} registrationNo={student.registrationNo} program={student.program} role={role} file={file} skills={foundLabels} />
      )}
    </div>
  );
}
