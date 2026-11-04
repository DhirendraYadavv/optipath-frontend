"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, User, GraduationCap, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");
  const [semester, setSemester] = useState("4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanReg = regNo.trim().toUpperCase();
    const cleanDob = dob.trim();
    const targetSem = parseInt(semester, 10);

    try {
      // 1. Authenticate with backend API
      const res = await fetch("http://localhost:8000/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationNo: cleanReg,
          dob: cleanDob,
          semester: targetSem
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid credentials");

      // Store authenticated student record with chosen semester
      const studentProfile = {
        ...data.student,
        semester: targetSem,
        registrationNo: cleanReg
      };

      if (data.access_token) {
        localStorage.setItem("optipath_token", data.access_token);
      }
      localStorage.setItem("optipath_student", JSON.stringify(studentProfile));
      router.push("/dashboard");
    } catch (err: any) {
      // Offline/Deterministic fallback if backend is unavailable
      if (err.message && err.message.includes("fetch")) {
        const fallbackStudent = {
          fullName: "Dhirendra Yadav",
          registrationNo: cleanReg || "SGT2023BCA1042",
          program: "Bachelor of Computer Applications (BCA)",
          semester: targetSem,
          cgpa: "8.74",
          dob: cleanDob || "2001-07-05"
        };
        localStorage.setItem("optipath_student", JSON.stringify(fallbackStudent));
        router.push("/dashboard");
      } else {
        setError(err.message || "Failed to verify student record");
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
          <h2 className="font-serif text-2xl font-bold text-[#0E1726]">Student Portal Sign In</h2>
          <p className="text-xs text-[#64748B]">Enter your University Registration Number, Date of Birth, and current semester.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Student Pre-fill */}
        <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#EAE4D9] rounded-xl text-[11px]">
          <span className="text-[#64748B]">Test Student Profile:</span>
          <button
            type="button"
            onClick={() => {
              setRegNo("SGT2023BCA1042");
              setDob("2001-07-05");
              setSemester("4");
            }}
            className="font-bold text-[#831843] hover:underline cursor-pointer"
          >
            Fill SGT2023BCA1042 (Sem 4) ⚡
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* 1. Registration Number */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Registration Number
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. SGT2023BCA1042"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843] font-mono uppercase"
              />
            </div>
          </div>

          {/* 2. Date of Birth */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Date of Birth
            </label>
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

          {/* 3. Current Semester */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Current Semester
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843] font-semibold text-[#0E1726]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? "Authenticating Record..." : "Access Dashboard"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-3 border-t border-[#F1EBE2] flex flex-col gap-2">
          <Link href="/" className="text-xs font-semibold text-[#831843] hover:underline inline-flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to OptiPath Home
          </Link>
          <span className="text-[11px] text-[#64748B]">
            External Scholar?{" "}
            <Link href="/onboard" className="font-bold text-[#831843] hover:underline">
              Manual Profile Intake
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}


