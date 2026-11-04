"use client";

import React, { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { ALL_500_PLUS_ROLES, getDynamicSalaryIntelligence } from "@/data/salaryAndRolesData";

// NOTE: This is the interim estimator. The figures come from getDynamicSalaryIntelligence(), which is
// a keyword-based indicative range per role group, not a sourced dataset and not city-specific.
// It will be replaced by the sourced city-wise estimator (Stage 2).

export default function SalaryEstimatorModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState("Full Stack Systems Architect");
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const info = useMemo(() => getDynamicSalaryIntelligence(role), [role]);
  const roles = useMemo(() => {
    const t = term.trim().toLowerCase();
    const list = t ? ALL_500_PLUS_ROLES.filter((r) => r.toLowerCase().includes(t)) : ALL_500_PLUS_ROLES;
    return list.slice(0, 80);
  }, [term]);

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Salary estimator">
      <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-2xl w-full p-7 shadow-2xl relative text-[#0E1726]">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Salary Estimator &bull; Indicative</span>
            <h3 className="font-serif text-2xl font-bold">Annual salary range (INR / year)</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#64748B] block mb-1">Job profile</label>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] hover:border-[#831843] rounded-2xl flex items-center justify-between text-left cursor-pointer transition"
            >
              <span className="font-serif font-bold text-sm">{role}</span>
              <span className="px-3 py-1 bg-white border border-[#DDD8CE] rounded-xl text-xs font-semibold text-[#831843] flex items-center gap-1">
                {open ? "Close" : "Change"}
                {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {open && (
              <div className="mt-2 p-3 bg-white border border-[#E5DFD5] rounded-2xl shadow-md space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Type to filter roles..."
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-0.5">
                  {roles.length === 0 && <p className="text-xs text-[#64748B] px-2 py-1">No matching roles.</p>}
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                        role === r ? "bg-[#831843] text-white font-bold" : "hover:bg-[#FAF8F5] text-[#0E1726]"
                      }`}
                    >
                      <span>{r}</span>
                      {role === r && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Indicative range</span>
              <span className="font-serif text-xl font-bold text-[#831843] block mt-0.5">{info.range}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Indicative average</span>
              <span className="font-serif text-xl font-bold text-emerald-800 block mt-0.5">{info.overallAvg}</span>
            </div>
          </div>

          <p className="text-[11px] text-[#64748B] leading-relaxed">
            These are indicative ranges for the role group, not live market data, and they are not specific to a city.
            City-wise figures with sources are being added.
          </p>
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
