import React from "react";
import { ListChecks } from "lucide-react";
import { ATS_GUIDE, ATS_GUIDE_NOTE } from "@/data/atsGuide";
import { CHECK_WEIGHTS } from "@/lib/atsCheck";

/** A plain how-to: what to change in your own resume so an applicant-tracking system can read it. */
export default function AtsGuide() {
  return (
    <div className="reveal bg-white border border-[#D5E1EE] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <ListChecks className="w-5 h-5 text-[#0060AA]" />
        <h3 className="font-heading text-lg font-bold">How to make your resume ATS-friendly</h3>
      </div>
      <p className="text-xs text-[#526173]">Make these changes in your own resume, then upload it again to see your checklist score improve. The points are listed from most to least important.</p>
      <ol className="space-y-4">
        {ATS_GUIDE.map((g, i) => (
          <li key={g.id} className="rounded-xl border border-[#DCE7F2] bg-[#F4F8FC] p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[#0E1726]">{i + 1}. {g.title}</h4>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0060AA]">Counts {CHECK_WEIGHTS[g.id]} of 100</span>
            </div>
            <p className="text-xs text-[#526173]">{g.why}</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#334155]">
              {g.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </li>
        ))}
      </ol>
      <p className="text-[11px] text-[#5B6B80]">{ATS_GUIDE_NOTE}</p>
    </div>
  );
}
