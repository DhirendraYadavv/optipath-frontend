"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, FileText, Loader2, Search, ShieldCheck } from "lucide-react";
import RoleSelect from "@/components/RoleSelect";
import { RECRUITER_VERIFY_URL, TALENT_RESUME_URL, TALENT_SEARCH_URL } from "@/lib/siteConfig";
import { clearRecruiterSession, saveRecruiterSession, useRecruiterSession } from "@/lib/recruiterStore";
import {
  Candidate,
  RecruiterErrors,
  RecruiterFields,
  RecruiterSession,
  SAMPLE_CANDIDATES,
  degreeRouteFor,
  splitHighlight,
  normalizeCompanyUrl,
  parseCandidates,
  rankCandidates,
  sessionFromVerifyResponse,
  validateRecruiter,
} from "@/lib/talentPool";

const EMPTY: RecruiterFields = { name: "", workEmail: "", company: "", designation: "", website: "" };
const TIMEOUT_MS = 15000;
const inputCls = "w-full p-3 bg-[#F4F8FC] border border-[#C8D7E8] rounded-xl text-xs outline-none focus:border-[#0060AA]";

export default function RecruiterPage() {
  const { ready, session } = useRecruiterSession();

  return (
    <main className="min-h-screen bg-[#F4F8FC] text-[#0E1726]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/portal" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0060AA] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to portal
        </Link>
        <h1 className="font-heading text-3xl font-bold mt-4">Recruiter Talent Pool</h1>
        <p className="text-sm text-[#526173] mt-1">Browse the resumes students have chosen to share, and search them by keyword.</p>

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
    <form onSubmit={submit} noValidate className="bg-white border border-[#D5E1EE] rounded-3xl p-7 shadow-xs space-y-3 max-w-xl">
      <div className="flex items-center gap-2 pb-2 border-b border-[#DCE7F2]">
        <ShieldCheck className="w-5 h-5 text-[#0060AA]" />
        <h2 className="font-heading text-xl font-bold">Verify you are a recruiter</h2>
      </div>
      <p className="text-xs text-[#526173]">Candidate profiles are shown only to verified recruiters. Use your official company email.</p>

      <div>
        <label htmlFor="rc-name" className="text-xs font-bold text-[#5B6B80] block mb-1">Recruiter name</label>
        <input id="rc-name" className={inputCls} value={fields.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        {err("name")}
      </div>
      <div>
        <label htmlFor="rc-email" className="text-xs font-bold text-[#5B6B80] block mb-1">Official work email</label>
        <input id="rc-email" type="email" className={inputCls} value={fields.workEmail} onChange={(e) => set("workEmail", e.target.value)} autoComplete="email" />
        {err("workEmail")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="rc-company" className="text-xs font-bold text-[#5B6B80] block mb-1">Company name</label>
          <input id="rc-company" className={inputCls} value={fields.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
          {err("company")}
        </div>
        <div>
          <label htmlFor="rc-desig" className="text-xs font-bold text-[#5B6B80] block mb-1">Designation</label>
          <input id="rc-desig" className={inputCls} value={fields.designation} onChange={(e) => set("designation", e.target.value)} autoComplete="organization-title" />
          {err("designation")}
        </div>
      </div>
      <div>
        <label htmlFor="rc-web" className="text-xs font-bold text-[#5B6B80] block mb-1">Company website or LinkedIn page</label>
        <input id="rc-web" className={inputCls} value={fields.website} onChange={(e) => set("website", e.target.value)} placeholder="example.com or linkedin.com/company/..." />
        {err("website")}
      </div>

      {serverError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{serverError}</p>}

      <button type="submit" disabled={busy} className="w-full py-3 bg-[#0060AA] hover:bg-[#004D8A] disabled:opacity-60 text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer">
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
  | { kind: "ok"; candidates: Candidate[]; query: string; role: string }
  | { kind: "offline"; query: string; role: string }
  | { kind: "error"; message: string };

interface Listed {
  candidate: Candidate;
  /** Null when no role is selected, so there is nothing to score against. */
  percent: number | null;
  matched: string[];
}

const PAGE_LIMIT = 50;

function TalentSearch({ session }: { session: RecruiterSession }) {
  const [role, setRole] = useState("");
  const [keyword, setKeyword] = useState("");
  const [minPercent, setMinPercent] = useState(0);
  const [state, setState] = useState<SearchState>({ kind: "idle" });
  const [resumeError, setResumeError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const q = keyword.trim();
    const r = role;
    setResumeError(null);
    setState({ kind: "loading" });
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (r) params.set("role", r);
      const res = await fetch(`${TALENT_SEARCH_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${session.token}` },
        signal: controller.signal,
      });
      if (res.status === 401 || res.status === 403) {
        clearRecruiterSession(); // token expired or revoked: back to the gate
        return;
      }
      if (!res.ok) {
        setState(res.status >= 500 ? { kind: "offline", query: q, role: r } : { kind: "error", message: "The search was not accepted. Try again." });
        return;
      }
      const body: unknown = await res.json().catch(() => null);
      setState({ kind: "ok", candidates: parseCandidates(body), query: q, role: r });
    } catch {
      if (abortRef.current === controller) setState({ kind: "offline", query: q, role: r });
    } finally {
      clearTimeout(timer);
    }
  }

  async function openResume(id: string) {
    setResumeError(null);
    try {
      const res = await fetch(`${TALENT_RESUME_URL}/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${session.token}` } });
      if (!res.ok) throw new Error("not ok");
      const url = URL.createObjectURL(await res.blob());
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setResumeError("Could not open that resume right now.");
    }
  }

  const listed = (candidates: Candidate[], r: string): Listed[] =>
    r
      ? rankCandidates(candidates, r, { minPercent, skillQuery: "" })
      : candidates.map((candidate) => ({ candidate, percent: null, matched: [] }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#D5E1EE] rounded-2xl px-4 py-3">
        <p className="text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1.5 -mt-0.5" />
          Verified: <b>{session.name || "Recruiter"}</b>{session.company ? `, ${session.company}` : ""}
        </p>
        <button onClick={clearRecruiterSession} className="text-xs font-bold text-[#0060AA] hover:underline cursor-pointer">Sign out</button>
      </div>

      <form onSubmit={(e) => void search(e)} className="bg-white border border-[#D5E1EE] rounded-2xl p-5 space-y-3">
        <div>
          <label htmlFor="rc-key" className="text-xs font-bold text-[#5B6B80] block mb-1">Keyword (leave empty to list all resumes)</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6B80]" />
            <input id="rc-key" className={`${inputCls} pl-9`} value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. python, power bi, tally, recruitment" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="rc-role" className="text-xs font-bold text-[#5B6B80] block mb-1">Career role (optional)</label>
            <RoleSelect id="rc-role" value={role} onChange={setRole} placeholder="All roles" />
          </div>
          <div>
            <label htmlFor="rc-min" className="text-xs font-bold text-[#5B6B80] block mb-1">Minimum skill match (needs a role)</label>
            <select id="rc-min" className={inputCls} value={minPercent} onChange={(e) => setMinPercent(Number(e.target.value))} disabled={!role}>
              <option value={0}>Any</option>
              <option value={30}>30% or more</option>
              <option value={50}>50% or more</option>
              <option value={70}>70% or more</option>
            </select>
          </div>
        </div>
        <button type="submit" className="px-6 py-2.5 bg-[#0060AA] hover:bg-[#004D8A] text-white text-xs font-bold rounded-full cursor-pointer">Search resumes</button>
      </form>

      {state.kind === "loading" && <p className="text-xs text-[#526173] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Searching...</p>}
      {state.kind === "error" && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{state.message}</p>}
      {resumeError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">{resumeError}</p>}

      {state.kind === "offline" && (
        <>
          <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-3" role="status">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>The Talent Pool service cannot be reached right now, so no real resumes are shown. Below is a <b>sample layout only</b>. These are not real people.</span>
          </div>
          <CandidateGrid items={listed(SAMPLE_CANDIDATES.map((c) => ({ ...c, targetRole: state.role || c.targetRole })), state.role)} query={state.query} onOpenResume={openResume} />
        </>
      )}

      {state.kind === "ok" &&
        (() => {
          const items = listed(state.candidates, state.role);
          if (state.candidates.length === 0) return <p className="text-xs text-[#526173] bg-white border border-[#D5E1EE] rounded-xl p-4">{state.query ? `No resumes mention "${state.query}".` : "No resumes have been shared yet."}</p>;
          if (items.length === 0) return <p className="text-xs text-[#526173] bg-white border border-[#D5E1EE] rounded-xl p-4">No resumes match these filters. Try lowering the minimum match.</p>;
          return (
            <>
              <p className="text-xs text-[#526173]">
                {items.length} resume{items.length === 1 ? "" : "s"}{state.query ? ` for "${state.query}"` : ""}
                {items.length > PAGE_LIMIT ? `. Showing the first ${PAGE_LIMIT}; narrow the search to see others.` : ""}
              </p>
              <CandidateGrid items={items.slice(0, PAGE_LIMIT)} query={state.query} onOpenResume={openResume} />
            </>
          );
        })()}
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {splitHighlight(text, query).map((seg, i) =>
        seg.hit ? <mark key={i} className="bg-yellow-200 text-[#0E1726] rounded px-0.5">{seg.text}</mark> : <React.Fragment key={i}>{seg.text}</React.Fragment>
      )}
    </>
  );
}

function CandidateGrid({ items, query, onOpenResume }: { items: Listed[]; query: string; onOpenResume: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map(({ candidate: c, percent, matched }) => {
        const route = degreeRouteFor(c.targetRole);
        const chips = percent === null ? c.skills : matched;
        return (
          <article key={c.id} className="bg-white border border-[#D5E1EE] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-bold">{c.fullName}</h3>
                <p className="text-xs text-[#526173]">{c.targetRole}</p>
              </div>
              {percent !== null && (
                <div className="text-right shrink-0">
                  <span className="font-heading text-2xl font-bold text-[#0060AA]">{percent}%</span>
                  <span className="block text-[10px] uppercase font-bold text-[#5B6B80]">skill match</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#5B6B80]">
              {c.program ? <>Programme: <b>{c.program}</b> &bull; </> : null}
              {route ? <>Degree route: {route} &bull; </> : null}
              Graduation / expected: {c.graduationYear ?? "not given"}
            </p>
            {c.snippet && (
              <p className="text-xs text-[#334155] bg-[#F4F8FC] border border-[#DCE7F2] rounded-xl p-3 leading-relaxed">
                &hellip;<Highlight text={c.snippet} query={query} />&hellip;
              </p>
            )}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5B6B80]">{percent === null ? "Skills" : "Matching skills"}</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {chips.length > 0 ? (
                  chips.map((m) => <span key={m} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"><Highlight text={m} query={query} /></span>)
                ) : (
                  <span className="text-[11px] text-[#5B6B80]">{percent === null ? "No skills listed." : "None of the listed skills match this role's core skills."}</span>
                )}
              </div>
            </div>
            {c.hasResume && !c.isSample && (
              <div>
                <button onClick={() => onOpenResume(c.id)} className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0060AA] text-[#0060AA] hover:bg-[#F4F8FC] text-xs font-bold rounded-full cursor-pointer">
                  <FileText className="w-3.5 h-3.5" /> View resume
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
