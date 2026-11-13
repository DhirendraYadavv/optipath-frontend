"use client";

import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/** One expandable item. The answer grows and fades in, the arrow turns, and it works with keyboard and screen readers. */
export default function Accordion({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="bg-white rounded-2xl border border-[#D5E1EE] shadow-xs">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer px-5 py-4 text-sm font-semibold"
      >
        {title}
        <ChevronDown data-open={open} className="accordion-chevron w-4 h-4 text-[#0060AA] shrink-0" />
      </button>
      <div id={panelId} role="region" data-open={open} className="accordion-panel" aria-hidden={!open}>
        <div>
          <div className="px-5 pb-4 text-xs text-[#526173] leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
