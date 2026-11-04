"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Building, 
  GraduationCap, 
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [readinessData, setReadinessData] = useState<any>(null);
  const [obsolescenceData, setObsolescenceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [readinessRes, obsolescenceRes] = await Promise.all([
          fetch("http://localhost:8000/analytics/placement-readiness?program=ALL"),
          fetch("http://localhost:8000/analytics/curriculum-obsolescence?programCode=BCA")
        ]);
        setReadinessData(await readinessRes.json());
        setObsolescenceData(await obsolescenceRes.json());
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0E1726]">
              <ArrowLeft className="w-4 h-4" /> Student Portal
            </Link>
            <span className="text-[#DDD8CE]">|</span>
            <span className="font-serif font-bold text-sm text-[#0E1726]">
              University Placement Analytics & Curriculum Obsolescence
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recruiter"
              className="px-3.5 py-1.5 rounded-full border border-[#DDD8CE] bg-white text-xs font-bold text-[#0E1726] hover:bg-[#FAF8F5] flex items-center gap-1.5 shadow-xs"
            >
              <Building className="w-3.5 h-3.5 text-[#831843]" /> Recruiter Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#831843] text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Institutional Intelligence Console &bull; SGT University CDOE
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0E1726]">
            Cohort Placement Readiness & Curriculum Obsolescence Moat
          </h1>
          <p className="text-xs text-[#526173] mt-1">
            Real-time graph metrics linking enrolled student competencies with market demand shifts.
          </p>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Evaluated Cohort</span>
            <span className="font-serif text-3xl font-bold text-[#0E1726] mt-1 block">
              {loading ? "..." : readinessData?.totalCandidatesEvaluated || 48} Students
            </span>
            <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">Across BCA & MCA</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Average ATS Match</span>
            <span className="font-serif text-3xl font-bold text-[#831843] mt-1 block">
              {loading ? "..." : `${readinessData?.averageAtsScore || 81.4}%`}
            </span>
            <span className="text-[11px] text-[#526173] mt-1 block">Tier-1 Product Standard</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Syllabus Health Index</span>
            <span className="font-serif text-3xl font-bold text-emerald-800 mt-1 block">
              {loading ? "..." : `${obsolescenceData?.healthIndexScore || 88.5}/100`}
            </span>
            <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">2026 NAAC A+ Benchmark</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Active Placements</span>
            <span className="font-serif text-3xl font-bold text-[#0E1726] mt-1 block">
              {loading ? "..." : readinessData?.activePlacementCycles?.length || 4} Drives
            </span>
            <span className="text-[11px] text-[#526173] mt-1 block">Google, Microsoft, Zomato</span>
          </div>
        </div>

        {/* Section 1: Curriculum Obsolescence Moat */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE4D9] gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldAlert className="w-3 h-3 text-rose-700" /> Automated Obsolescence Detector
              </div>
              <h3 className="font-serif text-2xl text-[#0E1726]">Curriculum Modernization & Risk Flags</h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl">
              Syllabus: {obsolescenceData?.academicSyllabusVersion || "2026-Rev4"}
            </span>
          </div>

          <div className="space-y-3">
            {obsolescenceData?.obsolescenceFlags?.map((flag: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#FAF8F5] border border-rose-200 rounded-2xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-sm text-[#0E1726]">{flag.course}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-100 text-rose-900 rounded font-bold uppercase">
                    Risk Level: {flag.marketRisk}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">Flagged Legacy Topic:</span>
                    <span className="text-rose-900 font-semibold">{flag.flaggedTopic}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">Recommended Replacement:</span>
                    <span className="text-emerald-900 font-semibold">{flag.recommendedReplacement} ({flag.industryDemandSurge})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
            <span className="text-xs font-bold text-emerald-950 block mb-2">High-Leverage Elective Additions for Next Academic Council:</span>
            <ul className="space-y-1 text-xs text-emerald-900">
              {obsolescenceData?.highLeverageElectiveRecommendations?.map((rec: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 2: Active Placement Drives */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-serif text-2xl text-[#0E1726]">Active Placement Drive Pipelines</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-[#64748B] text-[9px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">Openings</th>
                  <th className="py-2.5 px-3">Average CTC</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F1EB]">
                {readinessData?.activePlacementCycles?.map((p: any, i: number) => (
                  <tr key={i} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-3 font-bold text-[#0E1726]">{p.company}</td>
                    <td className="py-3 px-3 text-[#526173]">{p.tier}</td>
                    <td className="py-3 px-3 font-mono">{p.openings} positions</td>
                    <td className="py-3 px-3 font-bold text-emerald-800">{p.avgPackage}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-bold">
                        Pipeline Open
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}