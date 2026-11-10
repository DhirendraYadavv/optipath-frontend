"use client";

import React, { useMemo, useState } from "react";
import { Info, X } from "lucide-react";
import RoleSearch from "@/components/RoleSearch";
import { CITIES, TIER2_FACTOR, ambitionBoxSearchUrl, estimateSalary, formatRangeLpa, lakh } from "@/lib/salaryEstimatorData";


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
            <RoleSearch value={role} onChange={setRole} />
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
                    Entry-level estimate, 0 to 3 years (LPA)
                  </span>
                  {result.range ? (
                    <>
                      <span className="font-serif text-2xl font-bold text-emerald-800 block mt-0.5">{formatRangeLpa(result.range)}</span>
                      {result.median !== null && <span className="text-[11px] text-[#526173] block">Typical (median): {lakh(result.median)}</span>}
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-[#526173] block mt-1">Choose one of the listed job profiles to see a range.</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Typical minimum degree</span>
                  <span className="font-serif text-lg font-bold text-emerald-800 block mt-0.5">
                    {result.degree ?? "Not available for this occupation"}
                  </span>
                </div>
              </div>

              {result.range && result.band && (
                <div className="text-[11px] text-[#526173] leading-relaxed bg-white border border-[#EAE4D9] rounded-xl p-3 space-y-1.5">
                  <p className="flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#831843]" />
                    <span>
                      <b>OptiPath benchmark estimate</b> for {result.band.experience} of experience, based on{" "}
                      {result.band.kind === "role" ? <>the &ldquo;{result.band.title}&rdquo; benchmark</> : <>the broader {result.band.title} benchmark, because we have no role-specific figure</>}. It is not a published statistic.
                    </span>
                  </p>
                  {result.basis === "entry-band-tier2" && (
                    <p>
                      Estimated regional adjustment factor ({TIER2_FACTOR}x of the Tier-1 figures). This is an assumption, not a measured figure for {result.city.name}.
                    </p>
                  )}
                  {result.basis === "entry-band" && <p>The same Tier-1 figures are shown for every Tier-1 city; we have no city-specific figure.</p>}
                  <p>Use the AmbitionBox link below to compare with what employers and employees report there.</p>
                </div>
              )}

              <a
                href={ambitionBoxSearchUrl(role)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#831843] hover:underline"
              >
                Open the source page on AmbitionBox ↗
              </a>
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
