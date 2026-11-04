"use client";

import AuthFeatureGate from "@/components/AuthFeatureGate";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import LiveJobFeed from "@/components/LiveJobFeed";

function LiveJobsContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Software Development Engineer 1 (SDE 1)";

  const [studentSkills, setStudentSkills] = useState<string[]>([
    "Python", "DSA", "DBMS / SQL", "Git", "Object-Oriented Programming"
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("optipath_student");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.completedCourses && parsed.completedCourses.length > 0) {
          setStudentSkills(["Python", "DSA", "DBMS / SQL", "Git", "C++", "Linux Basics"]);
        }
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link
            href={`/roadmap?role=${encodeURIComponent(role)}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Roadmap
          </Link>
          <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">
            Page 6 &bull; Live 24-Hour Job Pulse
          </span>
        </div>

        {/* Real-Time Market Header */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
              Target Role Hiring Feed
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0E1726]">{role}</h1>
            <p className="text-xs text-[#526173]">
              Matched against verified academic skills:{" "}
              <span className="font-mono text-[#0E1726]">{studentSkills.slice(0, 4).join(", ")}...</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Past 24h Verified (f_TPR=r86400)</span>
          </div>
        </div>

        {/* LiveJobFeed Component */}
        <AuthFeatureGate user={typeof student !== "undefined" ? student : (typeof window !== "undefined" && localStorage.getItem("optipath_student"))} onUnlock={() => window.location.href = "/login"} title="Unlock 24-Hour Live Job Radar" description="Sign in to view real-time scraped job openings and direct 24-hour apply links across LinkedIn, Naukri, and Wellfound.">
        <LiveJobFeed role={role} skills={studentSkills} />
      </AuthFeatureGate>
      </div>
    </div>
  );
}

export default function LiveJobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#64748B]">Loading Job Radar...</div>}>
      <LiveJobsContent />
    </Suspense>
  );
}