"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CareerActions from "@/components/CareerActions";
import { useStoredStudent } from "@/lib/studentStore";

function LiveJobsContent() {
  const searchParams = useSearchParams();
  const { ready, record } = useStoredStudent();

  const fromRecord = record ? String(record.goal || record.targetRole || "") : "";
  const role = searchParams.get("role") || fromRecord;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">Openings in the last 24 hours</span>
        </div>

        {!ready ? (
          <p className="text-xs text-[#64748B] text-center">Loading...</p>
        ) : role ? (
          <>
            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Your goal</span>
              <h1 className="font-serif text-2xl font-bold">{role}</h1>
              <p className="text-xs text-[#526173]">
                The button below opens a LinkedIn search for this role, limited to jobs posted in the last 24 hours. Listings come live from LinkedIn.
              </p>
            </div>
            <CareerActions role={role} showProjects={false} />
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 text-center space-y-3">
            <p className="text-sm text-[#526173]">Choose your goal first so we can search for the right openings.</p>
            <div className="flex justify-center gap-3">
              <Link href="/login" className="px-5 py-2.5 bg-[#831843] text-white text-xs font-bold rounded-xl">I am an SGT student</Link>
              <Link href="/onboard" className="px-5 py-2.5 border border-[#831843] text-[#831843] text-xs font-bold rounded-xl">I am not an SGT student</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LiveJobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#64748B]">Loading...</div>}>
      <LiveJobsContent />
    </Suspense>
  );
}
