"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, AlertCircle, Lock, Target, User } from "lucide-react";
import RoleSearch from "@/components/RoleSearch";
import { TEST_REG_NO, buildDevTestStudent, normalizeBackendStudent } from "@/lib/sgtStudent";
import { API_URL } from "@/lib/siteConfig";

const IS_DEV = process.env.NODE_ENV !== "production";

export default function LoginPage() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finish = (student: ReturnType<typeof buildDevTestStudent>, token?: string) => {
    if (token) localStorage.setItem("optipath_token", token);
    localStorage.setItem("optipath_student", JSON.stringify(student));
    router.push("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!goal) {
      setError("Please choose your goal role.");
      return;
    }
    setLoading(true);

    const cleanReg = regNo.trim().toUpperCase();

    try {
      const res = await fetch(`${API_URL}/auth/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNo: cleanReg, dob: dob.trim() }),
      });

      let data: Record<string, unknown> | null = null;
      try {
        const parsed: unknown = await res.json();
        data = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
      } catch {
        // non-JSON response
      }

      if (!res.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : "Invalid registration number or date of birth.";
        setError(detail);
        return;
      }

      const student = normalizeBackendStudent(data?.student, goal);
      if (!student) {
        setError("The university record is incomplete (name, registration number or semester missing). Please contact your coordinator.");
        return;
      }
      finish(student, typeof data?.access_token === "string" ? data.access_token : undefined);
    } catch {
      // Network failure: the server could not be reached.
      if (IS_DEV && cleanReg === TEST_REG_NO) {
        finish(buildDevTestStudent(goal));
      } else {
        setError("Cannot reach the server right now. Please try again in a little while.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-6 text-[#0E1726]">
      <div className="w-full max-w-md bg-white border border-[#E5DFD5] rounded-3xl p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-40 h-12 mx-auto">
            <Image src="/sgt-online-logo.png" alt="SGT Online" fill className="object-contain" priority />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0E1726]">SGT Student Check</h2>
          <p className="text-xs text-[#64748B]">Enter your registration number, date of birth and the role you are aiming for.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-medium flex items-start gap-2" role="alert">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {IS_DEV && (
          <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px]">
            <span className="text-amber-900">Development only:</span>
            <button
              type="button"
              onClick={() => {
                setRegNo(TEST_REG_NO);
                setDob("2001-07-05");
              }}
              className="font-bold text-[#831843] hover:underline cursor-pointer"
            >
              Fill test student {TEST_REG_NO}
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Registration number</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. SGT2023BCA1042"
                autoComplete="off"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843] font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">Date of birth</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Your goal role
            </label>
            <RoleSearch value={goal} onChange={setGoal} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? "Checking your record..." : "Open my dashboard"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-3 border-t border-[#F1EBE2] flex flex-col gap-2">
          <Link href="/" className="text-xs font-semibold text-[#831843] hover:underline inline-flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
          <span className="text-[11px] text-[#64748B]">
            Not an SGT student?{" "}
            <Link href="/onboard" className="font-bold text-[#831843] hover:underline">Check yourself here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
