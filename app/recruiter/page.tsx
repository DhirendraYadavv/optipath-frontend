"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import { GOAL_ROLES, TRACK_LABELS, type GoalTrack } from "@/data/goalRoles";
import { RECRUITER_VERIFY_URL, TALENT_SEARCH_URL } from "@/lib/siteConfig";
import { clearRecruiterSession, saveRecruiterSession, useRecruiterSession } from "@/lib/recruiterStore";
import {
  Candidate,
  RecruiterErrors,
  RecruiterFields,
  RecruiterSession,
  SAMPLE_CANDIDATES,
  buildMailto,
  matchingSkills,
  normalizeCompanyUrl,
  parseCandidates,
  sessionFromVerifyResponse,
  validateRecruiter,
} from "@/lib/talentPool";

const EMPTY: RecruiterFields = { name: "", workEmail: "", company: "", designation: "", website: "" };
const TIMEOUT_MS = 15000;
const tracks = Object.keys(TRACK_LABELS) as GoalTrack[];
const inputCls = "w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]";

export default function RecruiterPage() {
  const { ready, session } = useRecruiterSession();

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E1726]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#831843] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>
        <h1 className="font-serif text-3xl font-bold mt-4">Recruiter Talent Pool</h1>
        <p className="text-sm text-[#526173] mt-1">Find SGT Online candidates who have chosen to share their profile with verified recruiters.</p>

        <div className="mt-8">
          {!ready ? <div className="h-40" aria-hidden="true" /> : session ? <TalentSearch session={session} /> : <VerificationGate />}
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Gate
// ---------------------------------------------------------------------------
function VerificationGate() {
  const [fields, setFields] = useState<RecruiterFields>(EMPTY);
  const [errors, setErrors] = useState<RecruiterErrors>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof RecruiterFields, v: string) => setFields((f) => ({ ...f, [k]: v }));
  const err = (k: keyof RecruiterFields) => (errors[k] ? <p className="text-[11px] text-red-700 mt-1" role="alert">{errors[k]}</p> : null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const found = validateRecruiter(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(RECRUITER_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          workEmail: fields.workEmail.trim().toLowerCase(),
          company: fields.company.trim(),
          designation: fields.designation.trim(),
          website: normalizeCompanyUrl(fields.website),
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        setServerError(
          res.status >= 400 && res.status < 500
            ? "We could not verify these details. Check that you used your official company email and website."
            : "The verification service had a problem. Please try again shortly."
        );
        return;
      }
      const body: unknown = await res.json().catch(() => null);
      const created = sessionFromVerifyResponse(body, fields);
      if (!created) {
        setServerError("Verification did not complete. Please try again.");
        return;
      }
      saveRecruiterSession(created);
    } catch {
      // Fail closed: if the service cannot be reached, nobody is treated as verified.
      setServerError("Could not reach the verification service, so access was not granted. Please try again later.");
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="bg-white border border-[#E5DFD5] rounded-3xl p-7 shadow-xs space-y-3 max-w-xl">
      <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4D9]">
        <ShieldCheck className="w-5 h-5 text-[#831843]" />
        <h2 className="font-serif text-xl font-bold">Verify you are a recruiter</h2>
      </div>
      <p className="text-xs text-[#526173]">Candidate profiles are shown only to verified recruiters. Use your official company email.</p>

      <div>
        <label htmlFor="rc-name" className="text-xs font-bold text-[#64748B] block mb-1">Recruiter name</label>
        <input id="rc-name" className={inputCls} value={fields.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        {err("name")}
      </div>
      <div>
        <label htmlFor="rc-email" className="text-xs font-bold text-[#64748B] block mb-1">Official work email</label>
        <input id="rc-email" type="email" className={inputCls} value={fields.workEmail} onChange={(e) => set("workEmail", e.target.value)} autoComplete="email" />
        {err("workEmail")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="rc-company" className="text-xs font-bold text-[#64748B] block mb-1">Company name</label>
          <input id="rc-company" className={inputCls} value={fields.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
          {err("company")}
        </div>
        <div>
          <label htmlFor="rc-desig" className="text-xs font-bold text-[#64748B] block mb-1">Designation</label>
          <input id="rc-desig" className={inputCls} value={fields.designation} onChange={(e) => set("designation", e.target.value)} autoComplete="organization-title" />
          {err("designation")}
        </div>
      </div>
      <div>
        <label htmlFor="rc-web" className="text-xs font-bold text-[#64748B] block mb-1">Company website or LinkedIn page</label>
        <input id="rc-web" className={inputCls} value={fields.website} onChange={(e) => set("website", e.target.value)} placeholder="example.com or linkedin.com/company/..." />
        {err("website")}
      </div>

      {serverError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{serverError}</p>}

      <button type="submit" disabled={busy} className="w-full py-3 bg-[#831843] hover:bg-[#701237] disabled:opacity-60 text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer">
        {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify and continue"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Verified view
// ---------------------------------------------------------------------------
type SearchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; candidates: Candidate[] }
  | { kind: "offline" }
  | { kind: "error"; message: string };

function TalentSearch({ session }: { session: RecruiterSession }) {
  const [role, setRole] = useState("");
  const [state, setState] = useState<SearchState>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  async function search(nextRole: string) {
    setRole(nextRole);
    abortRef.current?.abort();
    if (!nextRole) {
      setState({ kind: "idle" });
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    setState({ kind: "loading" });
    try {
      const res = await fetch(`${TALENT_SEARCH_URL}?role=${encodeURIComponent(nextRole)}`, {
        headers: { Authorization: `Bearer ${session.token}` },
        signal: controller.signal,
      });
      if (res.status === 401 || res.status === 403) {
        clearRecruiterSession(); // token expired or revoked: back to the gate
        return;
      }
      if (!res.ok) {
        setState(res.status >= 500 ? { kind: "offline" } : { kind: "error", message: "The search was not accepted. Try again." });
        return;
      }
      const body: unknown = await res.json().catch(() => null);
      setState({ kind: "ok", candidates: parseCandidates(body) });
    } catch {
      if (!controller.signal.aborted || abortRef.current === controller) setState({ kind: "offline" });
    } finally {
      clearTimeout(timer);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E5DFD5] rounded-2xl px-4 py-3">
        <p className="text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1.5 -mt-0.5" />
          Verified: <b>{session.name || "Recruiter"}</b>{session.company ? `, ${session.company}` : ""}
        </p>
        <button onClick={clearRecruiterSession} className="text-xs font-bold text-[#831843] hover:underline cursor-pointer">Sign out</button>
      </div>

      <div>
        <label htmlFor="rc-role" className="text-xs font-bold text-[#64748B] block mb-1">Career role</label>
        <select id="rc-role" className={inputCls} value={role} onChange={(e) => void search(e.target.value)}>
          <option value="">Select a role to search</option>
          {tracks.map((t) => (
            <optgroup key={t} label={TRACK_LABELS[t]}>
              {GOAL_ROLES.filter((r) => r.track === t).map((r) => (
                <option key={r.title} value={r.title}>{r.title}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {state.kind === "loading" && <p className="text-xs text-[#526173] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Searching...</p>}
      {state.kind === "error" && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{state.message}</p>}

      {state.kind === "offline" && (
        <>
          <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-3" role="status">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>The Talent Pool service cannot be reached right now, so no real candidates are shown. Below is a <b>sample layout only</b>. These are not real people.</span>
          </div>
          <CandidateGrid candidates={SAMPLE_CANDIDATES.map((c) => ({ ...c, targetRole: role }))} role={role} session={session} />
        </>
      )}

      {state.kind === "ok" &&
        (state.candidates.length === 0 ? (
          <p className="text-xs text-[#526173] bg-white border border-[#E5DFD5] rounded-xl p-4">No candidates have shared a profile for this role yet.</p>
        ) : (
          <CandidateGrid candidates={state.candidates} role={role} session={session} />
        ))}
    </div>
  );
}

function CandidateGrid({ candidates, role, session }: { candidates: Candidate[]; role: string; session: RecruiterSession }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {candidates.map((c) => {
        const matched = matchingSkills(role, c.skills);
        const mailto = c.isSample ? null : buildMailto(c, session);
        return (
          <article key={c.id} className="bg-white border border-[#E5DFD5] rounded-2xl p-5 shadow-xs space-y-3">
            <div>
              <h3 className="font-serif text-lg font-bold">{c.fullName}</h3>
              <p className="text-xs text-[#526173]">{c.targetRole}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Graduation / expected: {c.graduationYear ?? "not given"}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Matching skills</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {matched.length > 0 ? (
                  matched.map((m) => <span key={m} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">{m}</span>)
                ) : (
                  <span className="text-[11px] text-[#64748B]">None of the listed skills match this role&apos;s core skills.</span>
                )}
              </div>
            </div>
            {mailto ? (
              <a href={mailto} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#831843] hover:bg-[#701237] text-white text-xs font-bold rounded-full">
                <Mail className="w-3.5 h-3.5" /> Contact Candidate
              </a>
            ) : (
              <button disabled className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 text-slate-500 text-xs font-bold rounded-full cursor-not-allowed" title={c.isSample ? "Sample card" : "No contact email was shared"}>
                <Mail className="w-3.5 h-3.5" /> Contact Candidate
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
