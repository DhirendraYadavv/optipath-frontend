"use client";

import React, { useState } from "react";
import { Loader2, Lock, User } from "lucide-react";
import { loginSgtStudent, validateStudentLogin, StudentLoginErrors } from "@/lib/studentPortal";
import { saveStudent, saveStudentToken } from "@/lib/studentStore";

export default function StudentGate() {
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");
  const [errors, setErrors] = useState<StudentLoginErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const found = validateStudentLogin({ registrationNo: regNo, dob });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    const result = await loginSgtStudent(regNo, dob);
    setBusy(false);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    if (result.token) saveStudentToken(result.token);
    saveStudent(result.student);
  }

  const input = "w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]";

  return (
    <form onSubmit={submit} noValidate className="bg-white border border-[#E5DFD5] rounded-3xl p-7 shadow-xs space-y-4 max-w-md">
      <h2 className="font-serif text-xl font-bold">SGT student sign-in</h2>
      <p className="text-xs text-[#526173]">This area is for enrolled SGT students and alumni. Use the same details as the student check.</p>
      <div>
        <label htmlFor="sp-reg" className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Registration number</label>
        <div className="relative">
          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input id="sp-reg" className={`${input} font-mono uppercase`} value={regNo} onChange={(e) => setRegNo(e.target.value)} autoComplete="off" placeholder="e.g. SGT2023BCA1042" />
        </div>
        {errors.registrationNo && <p className="text-[11px] text-red-700 mt-1" role="alert">{errors.registrationNo}</p>}
      </div>
      <div>
        <label htmlFor="sp-dob" className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Date of birth</label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input id="sp-dob" type="date" className={input} value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        {errors.dob && <p className="text-[11px] text-red-700 mt-1" role="alert">{errors.dob}</p>}
      </div>
      {serverError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{serverError}</p>}
      <button type="submit" disabled={busy} className="w-full py-3 bg-[#831843] hover:bg-[#701237] disabled:opacity-60 text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer">
        {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : "Sign in"}
      </button>
    </form>
  );
}
