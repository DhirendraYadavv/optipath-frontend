"use client";

import React from "react";
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface ResumeAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: any;
  onOpenStudio: () => void;
}

export default function ResumeAuditModal({
  isOpen,
  onClose,
  auditResult,
  onOpenStudio
}: ResumeAuditModalProps) {
  if (!isOpen || !auditResult) return null;

  const score = auditResult.ats_score || 78;

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#DDD8CE] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#0E1726]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D9]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" /> Deep ATS Micro-Audit Completed
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0E1726]">
              Resume Layout & Parsing Report
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#DDD8CE] flex items-center justify-center hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Score Banner */}
        <div className="p-5 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#64748B] block">Current ATS Compatibility Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`font-serif text-4xl font-bold ${score >= 85 ? "text-emerald-800" : score >= 70 ? "text-amber-800" : "text-rose-800"}`}>
                {score}
              </span>
              <span className="text-xs font-bold text-[#64748B]">/ 100 ATS Score</span>
            </div>
            <span className="text-xs text-[#526173] block mt-1">
              {score >= 85 ? "✓ Excellent single-column ATS hierarchy." : "Requires minor layout & metric tuning to clear Tier-1 filters."}
            </span>
          </div>

          <button
            onClick={() => { onClose(); onOpenStudio(); }}
            className="px-5 py-2.5 bg-[#831843] hover:bg-[#701237] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            Fix in Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Vector Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="p-3 bg-white border border-[#E5DFD5] rounded-xl">
            <span className="text-[10px] text-[#64748B] block">Layout & Structure</span>
            <span className="font-bold text-[#0E1726] text-sm mt-0.5 block">{auditResult.breakdown?.layout_and_headers}</span>
          </div>
          <div className="p-3 bg-white border border-[#E5DFD5] rounded-xl">
            <span className="text-[10px] text-[#64748B] block">Action Verbs</span>
            <span className="font-bold text-[#0E1726] text-sm mt-0.5 block">{auditResult.breakdown?.action_verb_strength}</span>
          </div>
          <div className="p-3 bg-white border border-[#E5DFD5] rounded-xl">
            <span className="text-[10px] text-[#64748B] block">Impact Metrics</span>
            <span className="font-bold text-[#0E1726] text-sm mt-0.5 block">{auditResult.breakdown?.metric_density}</span>
          </div>
          <div className="p-3 bg-white border border-[#E5DFD5] rounded-xl">
            <span className="text-[10px] text-[#64748B] block">Keyword Match</span>
            <span className="font-bold text-[#0E1726] text-sm mt-0.5 block">{auditResult.breakdown?.keyword_relevance}</span>
          </div>
        </div>

        {/* Actionable Steps to Reach 100 ATS */}
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-[#0E1726] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#831843]" /> Steps to Reach 100/100 ATS Compliance:
          </span>
          <ul className="space-y-1.5 text-xs text-[#526173]">
            {auditResult.steps_to_100_ats?.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#831843] font-bold">&bull;</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#FAF8F5] border border-[#DDD8CE] text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}