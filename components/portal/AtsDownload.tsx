"use client";

import React from "react";
import { Download } from "lucide-react";
import { makeDocx } from "@/lib/docxWriter";
import { blocksToText, buildAtsBlocks, isBuildable } from "@/lib/resumeBuild";
import { runAtsChecks } from "@/lib/atsCheck";
import { parseResume } from "@/lib/resumeParse";

interface Props {
  text: string;
  details: { fullName: string; email: string; phone: string };
  role: string;
  beforeScore: number;
}

export default function AtsDownload({ text, details, role, beforeScore }: Props) {
  const parsed = React.useMemo(() => parseResume(text), [text]);
  const blocks = React.useMemo(() => buildAtsBlocks(parsed, details), [parsed, details]);
  const after = React.useMemo(
    () => runAtsChecks({ kind: "docx", text: blocksToText(blocks), hasTables: false, hasImages: false, hasTextBoxes: false }, role).score,
    [blocks, role],
  );

  function download() {
    const bytes = makeDocx(blocks);
    const url = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(details.fullName || "resume").trim().replace(/[^A-Za-z0-9]+/g, "_")}_ATS_Resume.docx`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  if (!isBuildable(blocks)) {
    return (
      <p className="text-xs text-[#526173] bg-white border border-[#E5DFD5] rounded-xl p-4">
        We could not find enough sections (Education, Skills, Experience, Projects) in your resume to rebuild it. Add clear section headings and upload again.
      </p>
    );
  }
  return (
    <section className="bg-white border border-[#E5DFD5] rounded-2xl p-5 space-y-2">
      <h3 className="font-serif text-lg font-bold">Download an ATS-friendly version</h3>
      <p className="text-xs text-[#334155]">
        Same checklist score: {beforeScore}% now, about {after}% after reformatting. We rebuild your own text into a single-column Word file with standard headings and plain bullets.
        We do not add or change any skills, dates or numbers. Read it once before you send it.
      </p>
      <button onClick={download} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#831843] hover:bg-[#701237] text-white text-xs font-bold rounded-full cursor-pointer">
        <Download className="w-4 h-4" /> Download .docx
      </button>
    </section>
  );
}
