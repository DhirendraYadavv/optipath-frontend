"use client";

import React, { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Search } from "lucide-react";
import { ALL_500_PLUS_ROLES } from "@/data/salaryAndRolesData";

interface RoleSearchProps {
  value: string;
  onChange: (role: string) => void;
  /** Shown first, e.g. the career roles of the student's own program. */
  suggested?: string[];
  placeholder?: string;
}

export default function RoleSearch({ value, onChange, suggested = [], placeholder = "Search roles (e.g. Backend, Marketing, HR, Data)..." }: RoleSearchProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  const results = useMemo(() => {
    const t = term.trim().toLowerCase();
    const match = (r: string) => !t || r.toLowerCase().includes(t);
    const first = suggested.filter(match);
    const rest = ALL_500_PLUS_ROLES.filter((r) => match(r) && !suggested.includes(r)).slice(0, 60);
    return { first, rest };
  }, [term, suggested]);

  const pick = (r: string) => {
    onChange(r);
    setOpen(false);
    setTerm("");
  };

  const item = (r: string) => (
    <button
      key={r}
      type="button"
      onClick={() => pick(r)}
      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
        value === r ? "bg-[#831843] text-white font-bold" : "hover:bg-[#FAF8F5] text-[#0E1726]"
      }`}
    >
      <span>{r}</span>
      {value === r && <Check className="w-3.5 h-3.5" />}
    </button>
  );

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] hover:border-[#831843] rounded-xl flex items-center justify-between text-left cursor-pointer transition"
      >
        <span className={`text-xs ${value ? "font-semibold text-[#0E1726]" : "text-[#64748B]"}`}>{value || "Select your goal role"}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#831843]" /> : <ChevronDown className="w-4 h-4 text-[#831843]" />}
      </button>

      {open && (
        <div className="p-3 bg-white border border-[#E5DFD5] rounded-xl shadow-md space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg text-xs outline-none focus:border-[#831843]"
            />
          </div>
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {results.first.length > 0 && (
              <>
                <span className="text-[10px] font-mono font-bold uppercase text-[#831843] block px-2 pt-1">Suggested</span>
                {results.first.map(item)}
                <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] block px-2 pt-2">All roles</span>
              </>
            )}
            {results.rest.map(item)}
            {results.first.length === 0 && results.rest.length === 0 && (
              <p className="text-xs text-[#64748B] px-2 py-1">No matching roles. Try a shorter word.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
