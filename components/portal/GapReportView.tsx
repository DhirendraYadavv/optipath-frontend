"use client";

import React from "react";
import { ClipboardList, Hammer, Layers } from "lucide-react";
import { GapAction, StudentGapReport, planText } from "@/lib/gapReport";

function ActionList({ title, hint, icon, items }: { title: string; hint: string; icon: React.ReactNode; items: GapAction[] }) {
  return (
    <section className="bg-white border border-[#E5DFD5] rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-serif text-lg font-bold">{title}</h3>
        <span className="text-[11px] font-mono text-[#64748B]">({items.length})</span>
      </div>
      <p className="text-[11px] text-[#526173]">{hint}</p>
      {items.length === 0 ? (
        <p className="text-xs text-emerald-800">No gaps in this group.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.skill.id} className="text-xs border border-[#EAE4D9] rounded-xl p-3 bg-[#FAF8F5]">
              <span className="font-bold">{a.skill.label}</span>
              <span className="block text-[#526173] mt-0.5">{a.skill.reason}</span>
              <span className="block mt-1 text-[#831843] font-semibold">{planText(a.plan)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function GapReportView({ report, role }: { report: StudentGapReport; role: string }) {
  const m = report.match;
  if (!report.hasInput || !m) return null;
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl p-5">
        <p className="text-[10px] uppercase font-bold text-[#64748B]">Core-skill match for {role}</p>
        <p className="font-serif text-3xl font-bold text-[#831843]">{m.percentage}%</p>
        <p className="text-[11px] text-[#526173]">Share of the role&apos;s core skills found in your resume and typed skills. It does not measure how well you know them.</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {m.covered.length === 0 ? (
            <span className="text-xs text-[#64748B]">No core skills for this role were found yet.</span>
          ) : (
            m.covered.map((s) => (
              <span key={s.id} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">{s.label}</span>
            ))
          )}
        </div>
      </div>

      <ActionList
        title="Foundation gaps"
        hint="Fundamentals a degree normally teaches."
        icon={<Layers className="w-4 h-4 text-[#831843]" />}
        items={report.foundation}
      />
      <ActionList
        title="Production gaps"
        hint="Skills you pick up by building and shipping real projects."
        icon={<Hammer className="w-4 h-4 text-[#831843]" />}
        items={report.production}
      />

      <section className="bg-white border border-[#E5DFD5] rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#831843]" />
          <h3 className="font-serif text-lg font-bold">Project ideas to close the gaps</h3>
        </div>
        <ul className="space-y-2">
          {report.projects.map((p) => (
            <li key={p.title} className="text-xs border border-[#EAE4D9] rounded-xl p-3 bg-[#FAF8F5]">
              <span className="font-bold">{p.title}</span>
              <span className="block text-[#526173] mt-0.5">{p.summary}</span>
              <span className="block mt-1 text-[11px] text-[#831843] font-semibold">Skills: {p.skills.join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
