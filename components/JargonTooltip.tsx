"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

interface JargonProps {
  term: string;
  meaning: string;
  whyNeeded: string;
  example: string;
}

export default function JargonTooltip({ term, meaning, whyNeeded, example }: JargonProps) {
  const [show, setShow] = useState(false);

  return (
    <span 
      className="relative inline-flex items-center gap-1 cursor-help border-b border-dotted border-[#831843] text-inherit"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="font-semibold">{term}</span>
      <Info className="w-3 h-3 text-[#831843] inline-block opacity-75 hover:opacity-100" />

      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 bg-[#0E1726] text-white text-[11px] rounded-2xl shadow-xl border border-slate-700 pointer-events-none leading-relaxed block animate-in fade-in zoom-in-95 duration-200">
          <span className="block font-bold text-amber-300 text-xs mb-1">{term}</span>
          <span className="block mb-1.5 text-slate-200">
            <b className="text-white">Definition:</b> {meaning}
          </span>
          <span className="block mb-1.5 text-slate-300">
            <b className="text-white">Why it matters:</b> {whyNeeded}
          </span>
          <span className="block text-emerald-300 font-mono text-[10px]">
            <b>Example:</b> {example}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0E1726]" />
        </span>
      )}
    </span>
  );
}