"use client";

import React from "react";
import { ClipboardList, Hammer, Layers } from "lucide-react";
import { GapAction, StudentGapReport, planText } from "@/lib/gapReport";

function ActionList({ title, hint, icon, items, showPlans }: { title: string; hint: string; icon: React.ReactNode; items: GapAction[]; showPlans: boolean }) {
  return (
    <section className="reveal bg-white border border-[#D5E1EE] rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-heading text-lg font-bold">{title}</h3>
        <span className="text-[11px] font-mono text-[#5B6B80]">({items.length})</span>
      </div>
      <p className="text-[11px] text-[#526173]">{hint}</p>
      {items.length === 0 ? (
        <p className="text-xs text-emerald-800">No gaps in this group.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.skill.id} className="text-xs border border-[#DCE7F2] rounded-xl p-3 bg-[#F4F8FC]">
              <span className="font-bold">{a.skill.label}</span>
              <span className="block text-[#526173] mt-0.5">{a.skill.reason}</span>
              {showPlans && <span className="block mt-1 text-[#0060AA] font-semibold">{planText(a.plan)}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function GapReportView({ report, role, showPlans }: { report: StudentGapReport; role: string; showPlans: boolean }) {
  const m = report.match;
  if (!report.hasInput || !m) return null;
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#D5E1EE] rounded-2xl p-5">
        <p className="text-[10px] uppercase font-bold text-[#5B6B80]">Core-skill match for {role}</p>
        <p className="font-heading text-3xl font-bold text-[#0060AA]">{m.percentage}%</p>
        <p className="text-[11px] text-[#526173]">Share of the role&apos;s core skills found in your resume and typed skills. It does not measure how well you know them.</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {m.covered.length === 0 ? (
            <span className="text-xs text-[#5B6B80]">No core skills for this role were found yet.</span>
          ) : (
            m.covered.map((s) => (
              <span key={s.id} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">{s.label}</span>
            ))
          )}
        </div>
      </div>

      {!showPlans && (
        <p className="text-xs text-[#526173] bg-white border border-[#D5E1EE] rounded-xl p-3">
          To see which SGT course covers each gap, <a href="/login" className="font-bold text-[#0060AA] underline">check your SGT student record</a> first.
        </p>
      )}
      <ActionList
        title="Foundation gaps"
        hint="Fundamentals a degree normally teaches."
        icon={<Layers className="w-4 h-4 text-[#0060AA]" />}
        items={report.foundation}
        showPlans={showPlans}
      />
      <ActionList
        title="Production gaps"
        hint="Skills you pick up by building and shipping real projects."
        icon={<Hammer className="w-4 h-4 text-[#0060AA]" />}
        items={report.production}
        showPlans={showPlans}
      />

      <section className="bg-white border border-[#D5E1EE] rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#0060AA]" />
          <h3 className="font-heading text-lg font-bold">Project ideas to close the gaps</h3>
        </div>
        <ul className="space-y-2">
          {report.projects.map((p) => (
            <li key={p.title} className="text-xs border border-[#DCE7F2] rounded-xl p-3 bg-[#F4F8FC]">
              <span className="font-bold">{p.title}</span>
              <span className="block text-[#526173] mt-0.5">{p.summary}</span>
              <span className="block mt-1 text-[11px] text-[#0060AA] font-semibold">Skills: {p.skills.join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
