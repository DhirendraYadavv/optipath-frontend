"use client";

import React, { useMemo, useState } from "react";
import { ExternalLink, Info, X } from "lucide-react";
import RoleSearch from "@/components/RoleSearch";
import { CITIES, TIER2_FACTOR, estimateSalary } from "@/lib/salaryEstimatorData";

const SUGGESTED_ROLES = [
  "Backend Developer (Python/FastAPI/Django)",
  "Data Scientist & AI Engineer",
  "Cloud & DevOps Engineer (Docker/K8s/AWS)",
  "Financial Analyst Associate",
  "Digital Marketing Strategist",
];

const fmt = (n: number) => `₹${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}`;

export default function SalaryEstimatorModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState("");
  const [city, setCity] = useState<string>(CITIES[0].name);

  const result = useMemo(() => (role ? estimateSalary(role, city) : null), [role, city]);

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Salary estimator">
      <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-2xl w-full p-7 shadow-2xl relative text-[#0E1726] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Salary Estimator</span>
            <h3 className="font-serif text-2xl font-bold">Salary and degree for your goal</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#64748B] block mb-1">Job profile</label>
            <RoleSearch value={role} onChange={setRole} suggested={SUGGESTED_ROLES} />
          </div>

          <div>
            <label htmlFor="salary-city" className="text-xs font-bold text-[#64748B] block mb-1">City</label>
            <select
              id="salary-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.tier === "tier1" ? "Tier-1" : "Tier-2"})
                </option>
              ))}
            </select>
          </div>

          {result && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">
                    {result.basis === "tier2-estimate" ? "Estimated range (LPA)" : "Reported range (LPA)"}
                  </span>
                  {result.range ? (
                    <span className="font-serif text-2xl font-bold text-[#831843] block mt-0.5">
                      {fmt(result.range.min)} to {fmt(result.range.max)}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-[#526173] block mt-1">No verified data for this role yet</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Typical minimum degree</span>
                  <span className="font-serif text-lg font-bold text-emerald-800 block mt-0.5">
                    {result.degree ?? "Not available for this occupation"}
                  </span>
                </div>
              </div>

              {result.row && result.range && (
                <div className="text-[11px] text-[#526173] leading-relaxed bg-white border border-[#EAE4D9] rounded-xl p-3 space-y-1.5">
                  <p className="flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#831843]" />
                    <span>
                      Based on the title <b>&ldquo;{result.row.sourceTitle}&rdquo;</b> ({result.row.source}), covering {result.row.experience} of
                      experience{result.row.reports ? `, ${result.row.reports} salary reports` : ""}. This is the closest researched title to your profile.
                    </span>
                  </p>
                  {result.basis === "bengaluru-reported" && <p>City figure: the source lists a Bengaluru range for this title.</p>}
                  {result.basis === "india-reported" && <p>No city-specific figure for {result.city.name}; the India-wide range is shown.</p>}
                  {result.basis === "tier2-estimate" && (
                    <p>
                      Estimated regional adjustment factor ({TIER2_FACTOR}x of the Tier-1 baseline). This is an assumption, not a measured figure for {result.city.name}.
                    </p>
                  )}
                  <p>
                    Source page date: {result.row.sourceDate ?? "not shown in the captured page"} &bull; captured {result.row.capturedOn} &bull; The source does not publish a median.
                  </p>
                  <a href={result.row.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-[#831843] hover:underline">
                    Open source page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {!result.range && (
                <p className="text-[11px] text-[#526173] leading-relaxed bg-white border border-[#EAE4D9] rounded-xl p-3">
                  We only show salary figures we can trace to a source page, and this role family has none yet. The degree guidance above still applies.
                </p>
              )}
            </div>
          )}

          {!result && <p className="text-xs text-[#64748B]">Choose a job profile to see the salary range and typical degree.</p>}
        </div>

        <div className="pt-3 border-t border-[#EAE4D9] flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-[#831843] text-white text-xs font-bold rounded-xl cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
