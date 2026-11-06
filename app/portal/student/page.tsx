"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentWorkspace from "@/components/portal/StudentWorkspace";
import { isExternalRecord, useStoredStudent } from "@/lib/studentStore";
import { normalizeStoredStudent } from "@/lib/studentPortalSession";

export default function StudentPortalPage() {
  const { ready, record } = useStoredStudent();
  const student = record && !isExternalRecord(record) ? normalizeStoredStudent(record) : null;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E1726]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/portal" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#831843] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Talent Gateway
        </Link>
        <h1 className="font-serif text-3xl font-bold mt-4">Student: resume and Talent Pool</h1>
        <p className="text-sm text-[#526173] mt-1">Fill in your details and upload your resume. Sign in with Google to unlock the ATS-friendly check.</p>
        <div className="mt-8">{ready ? <StudentWorkspace student={student} /> : <div className="h-40" aria-hidden="true" />}</div>
      </div>
    </main>
  );
}
