"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { AtsReport, CheckStatus } from "@/lib/atsCheck";

const STYLE: Record<CheckStatus, { icon: React.ReactNode; box: string }> = {
  pass: { icon: <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />, box: "border-emerald-200 bg-emerald-50/60" },
  warn: { icon: <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />, box: "border-amber-200 bg-amber-50/60" },
  fail: { icon: <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />, box: "border-rose-200 bg-rose-50/60" },
};

export default function AtsReportView({ report }: { report: AtsReport }) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl p-5">
        <p className="text-[10px] uppercase font-bold text-[#64748B]">ATS-readiness checklist</p>
        <p className="font-serif text-3xl font-bold text-[#831843]">{report.score}%</p>
        <p className="text-[11px] text-[#526173]">
          Our own rule-based checklist, built on common ATS guidance. It is not a score from a real ATS and does not guarantee a shortlist.
        </p>
      </div>

      <ul className="space-y-2">
        {report.checks.map((c) => (
          <li key={c.id} className={`flex items-start gap-2.5 border rounded-xl p-3 text-xs ${STYLE[c.status].box}`}>
            {STYLE[c.status].icon}
            <div>
              <p className="font-bold">{c.label} <span className="font-normal text-[#64748B]">(weight {c.weight})</span></p>
              <p className="text-[#334155] mt-0.5">{c.detail}</p>
              {c.fix && <p className="text-[#831843] font-semibold mt-1">Fix: {c.fix}</p>}
            </div>
          </li>
        ))}
      </ul>

      {report.fixes.length > 0 && (
        <section className="bg-white border border-[#E5DFD5] rounded-2xl p-5">
          <h3 className="font-serif text-lg font-bold">How to make it ATS-friendly</h3>
          <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-xs text-[#334155]">
            {report.fixes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
