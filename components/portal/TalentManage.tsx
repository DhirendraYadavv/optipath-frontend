"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { TALENT_ME_URL } from "@/lib/siteConfig";
import { PoolEntry, deleteMyEntry, fetchMyEntry, readGoogleToken } from "@/lib/talentAccount";

type View = { kind: "loading" } | { kind: "none" } | { kind: "in"; entry: PoolEntry } | { kind: "removed" };

/** Shows whether the signed-in person's resume is in the Talent Pool and lets them remove it at any time. */
export default function TalentManage({ refreshKey }: { refreshKey: number }) {
  const [view, setView] = useState<View>({ kind: "loading" });
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetchMyEntry((u, i) => fetch(u, i), TALENT_ME_URL, readGoogleToken());
      if (cancelled) return;
      // A failed lookup shows nothing: the publish form already reports server problems, and a delete error is shown when it happens.
      setView(res.ok && res.value.inPool ? { kind: "in", entry: res.value } : { kind: "none" });
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function remove() {
    setBusy(true);
    setProblem(null);
    const res = await deleteMyEntry((u, i) => fetch(u, i), TALENT_ME_URL, readGoogleToken());
    setBusy(false);
    if (!res.ok) {
      setProblem(res.message);
      return;
    }
    setConfirming(false);
    setView({ kind: "removed" });
  }

  if (view.kind === "loading" || view.kind === "none") return null;

  if (view.kind === "removed") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-2" role="status">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Your resume has been removed from the Talent Pool. Recruiters can no longer find or open it.
      </div>
    );
  }

  const when = view.entry.uploadedAt ? new Date(view.entry.uploadedAt) : null;
  const date = when && !Number.isNaN(when.getTime()) ? when.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

  return (
    <div className="reveal bg-white border border-[#D5E1EE] rounded-2xl p-5 space-y-3">
      <h3 className="font-heading text-lg font-bold">Your Talent Pool entry</h3>
      <p className="text-xs text-[#334155]">
        Your resume is visible to verified recruiters{view.entry.targetRole ? <> for <b>{view.entry.targetRole}</b></> : null}
        {date ? <>, published {date}</> : null}. You can remove it at any time.
      </p>
      {problem && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{problem}</p>}
      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold rounded-full cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" /> Remove my resume
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2" role="alertdialog" aria-label="Confirm removal">
          <p className="text-xs text-red-900">This permanently deletes your resume file and the details you shared from the Talent Pool. You can upload again later.</p>
          <div className="flex gap-2">
            <button onClick={remove} disabled={busy} className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white text-xs font-bold rounded-full cursor-pointer">
              {busy ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Removing...</> : "Yes, remove it"}
            </button>
            <button onClick={() => setConfirming(false)} disabled={busy} className="px-4 py-2 border border-[#C8D7E8] text-xs font-bold rounded-full cursor-pointer">Keep it</button>
          </div>
        </div>
      )}
    </div>
  );
}
