"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { PLACEMENT_SUMMARY_URL } from "@/lib/siteConfig";
import { PlacementStats, SummaryResponse, Tally, buildPlacementStats, parseSummary } from "@/lib/placementStats";

type State = { kind: "idle" } | { kind: "loading" } | { kind: "denied" } | { kind: "error" } | { kind: "ok"; data: SummaryResponse };

function Bars({ title, rows, max = 8 }: { title: string; rows: Tally[]; max?: number }) {
  const top = rows.slice(0, max);
  const peak = Math.max(1, ...top.map((r) => r.count));
  return (
    <section className="bg-white border border-[#D5E1EE] rounded-2xl p-5">
      <h3 className="font-heading text-lg font-bold mb-3">{title}</h3>
      {top.length === 0 ? (
        <p className="text-xs text-[#526173]">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {top.map((r) => (
            <li key={r.label} className="text-xs">
              <div className="flex justify-between gap-3"><span className="truncate">{r.label}</span><span className="font-bold">{r.count}</span></div>
              <div className="h-2 bg-[#E8F0F8] rounded-full mt-1"><div className="h-2 bg-[#0060AA] rounded-full" style={{ width: `${(r.count / peak) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-white border border-[#D5E1EE] rounded-2xl p-4">
      <p className="text-[10px] uppercase font-bold text-[#5B6B80]">{label}</p>
      <p className="font-heading text-2xl font-bold text-[#0060AA]">{value}</p>
      {note && <p className="text-[11px] text-[#526173]">{note}</p>}
    </div>
  );
}

export default function PlacementDashboard() {
  const { user, ready, openSignIn } = useAuth();
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    const run = async () => {
      let token = "";
      try {
        token = localStorage.getItem("optipath_token") ?? "";
      } catch {
        // storage blocked: the request below will be refused
      }
      setState({ kind: "loading" });
      try {
        const res = await fetch(PLACEMENT_SUMMARY_URL, { headers: { Authorization: `Bearer ${token}` } });
        if (cancelled) return;
        if (res.status === 401 || res.status === 403) return setState({ kind: "denied" });
        const data = parseSummary(await res.json().catch(() => null));
        setState(res.ok && data ? { kind: "ok", data } : { kind: "error" });
      } catch {
        if (!cancelled) setState({ kind: "error" });
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  if (!user) {
    return (
      <div className="bg-white border border-[#D5E1EE] rounded-2xl p-8 text-center space-y-3">
        <Lock className="w-6 h-6 text-[#0060AA] mx-auto" />
        <p className="text-sm font-bold">Placement-cell staff only</p>
        <button onClick={() => openSignIn("Sign in with your staff Google account")} className="px-6 py-2.5 bg-[#0060AA] text-white text-xs font-bold rounded-full cursor-pointer">Sign in with Google</button>
      </div>
    );
  }
  if (state.kind === "loading" || state.kind === "idle") return <p className="text-xs text-[#526173] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading cohort numbers…</p>;
  if (state.kind === "denied") return <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-4">This account is not on the placement-staff list, or the backend has no sign-in token for it. Ask the administrator to add your email.</p>;
  if (state.kind === "error") return <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-4">Could not load the numbers. Check that the backend is running.</p>;

  const s: PlacementStats = buildPlacementStats(state.data);
  const d = state.data;
  const roster: Tally[] = Object.entries(d.roster.byProgram).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  const sems: Tally[] = Object.entries(d.roster.bySemester).map(([label, count]) => ({ label: `Semester ${label}`, count }));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Students on roster" value={String(d.roster.total)} />
        <Stat label="Resumes in talent pool" value={String(d.pool.total)} note={`${s.coverage}% of the roster`} />
        <Stat label="Average checklist score" value={s.averageScore === null ? "n/a" : `${s.averageScore}%`} note={`${d.pool.withScore} resumes checked`} />
        <Stat label="Compared with target role" value={String(s.analysed)} note="resumes with listed skills" />
      </div>
      <p className="text-[11px] text-[#526173]">
        Pool figures cover only students who chose to upload, not the whole cohort. The score is OptiPath&apos;s own checklist, not a real ATS score. Semester figures are only as accurate as the roster file.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <Bars title="Roster by programme" rows={roster} />
        <Bars title="Roster by semester" rows={sems} />
        <Bars title="Pool by programme" rows={s.byProgram} />
        <Bars title="Most common target roles" rows={s.byRole} />
      </div>
      <section className="bg-white border border-[#D5E1EE] rounded-2xl p-5">
        <h3 className="font-heading text-lg font-bold">Most common skill gaps</h3>
        <p className="text-[11px] text-[#526173] mb-3">Skills a role needs that students did not list, counted across {s.analysed} resumes.</p>
        {s.gaps.length === 0 ? (
          <p className="text-xs text-[#526173]">Not enough uploaded resumes yet.</p>
        ) : (
          <ul className="space-y-2">
            {s.gaps.map((g) => (
              <li key={`${g.kind}-${g.skill}`} className="text-xs flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-bold ${g.kind === "foundation" ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900"}`}>{g.kind}</span>
                <span className="font-bold">{g.skill}</span>
                <span className="text-[#526173]">missing in {g.count} of {s.analysed} · {g.roles.slice(0, 2).join(", ")}{g.roles.length > 2 ? ` +${g.roles.length - 2}` : ""}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
