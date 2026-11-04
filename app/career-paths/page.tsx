"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Check, DollarSign, MapPin, ArrowRight } from "lucide-react";
import { ALL_500_PLUS_ROLES, getDynamicSalaryIntelligence } from "@/data/salaryAndRolesData";

export default function CareerPathsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Software Development Engineer 1 (SDE 1)");
  const salaryInfo = getDynamicSalaryIntelligence(selectedRole);

  const filteredRoles = ALL_500_PLUS_ROLES.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]">
            <ArrowLeft className="w-4 h-4" /> Back to Academic Dashboard
          </Link>
          <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">
            Page 3: Career Paths & Market Benchmarks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Roles Catalog Column */}
          <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Search Roles (500+ Catalog)</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
              />
            </div>
            <div className="max-h-[460px] overflow-y-auto space-y-1 pr-1">
              {filteredRoles.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                    selectedRole === r ? "bg-[#831843] text-white font-bold" : "hover:bg-[#FAF8F5] text-[#0E1726]"
                  }`}
                >
                  <span>{r}</span>
                  {selectedRole === r && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Intelligence & Details */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">{(salaryInfo as any).category || "Technical Career Track"}</span>
              <h2 className="font-serif text-3xl font-bold text-[#0E1726]">{salaryInfo.role}</h2>
            </div>

            {/* CTC Range & Avg */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B]">Verified Range</span>
                <span className="font-serif text-2xl font-bold text-[#831843] block mt-0.5">{salaryInfo.range}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B]">Market Average</span>
                <span className="font-serif text-2xl font-bold text-emerald-800 block mt-0.5">{salaryInfo.overallAvg}</span>
              </div>
            </div>

            {/* Experience Progression */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-xl border border-[#E5DFD5] text-center bg-[#FAF8F5]">
                <span className="text-[10px] text-[#64748B] block">Fresher</span>
                <span className="font-bold text-xs">{salaryInfo.fresherAvg}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5DFD5] text-center bg-[#FAF8F5]">
                <span className="text-[10px] text-[#64748B] block">5 Years</span>
                <span className="font-bold text-xs">{salaryInfo.mid5Avg}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5DFD5] text-center bg-[#FAF8F5]">
                <span className="text-[10px] text-[#64748B] block">10 Years</span>
                <span className="font-bold text-xs">{salaryInfo.lead10Avg}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5DFD5] text-center bg-[#FAF8F5]">
                <span className="text-[10px] text-[#64748B] block">20 Years</span>
                <span className="font-bold text-xs text-emerald-800">{salaryInfo.exec20Avg}</span>
              </div>
            </div>

            {/* Technical Interview Core Topics (Blueprint Page 3) */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                Technical Interview Core Topics & Focus Areas
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {salaryInfo.interviewRounds?.map((rnd, i) => (
                  <div key={i} className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#831843]">{rnd.round}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">Core Elimination</span>
                    </div>
                    <p className="text-[#0E1726]"><b>Focus:</b> {rnd.focus}</p>
                    {rnd.sampleQuestions && rnd.sampleQuestions.length > 0 && (
                      <p className="text-[11px] text-[#526173]">
                        <b>Sample Topics:</b> {rnd.sampleQuestions.join("; ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hubs & Scope */}
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#0E1726]">
                <MapPin className="w-3.5 h-3.5 text-[#831843]" /> Top Hiring Hubs: <span className="font-normal text-[#526173]">{salaryInfo.topHubs.join(", ")}</span>
              </div>
              <p className="text-[11px] text-[#526173] pt-1"><b>Market Scope:</b> {salaryInfo.scope}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href={`/gap-analysis?role=${encodeURIComponent(selectedRole)}`}
                className="px-6 py-3 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                Analyze Skill Gap <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}