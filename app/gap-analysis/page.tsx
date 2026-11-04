"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Info, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import CareerActions from "@/components/CareerActions";
import { computeSkillMatch, detectRoleFamily } from "@/lib/skillMatch";
import { Qualification, evaluatePrograms, qualificationLabel } from "@/lib/programRecommend";
import { projectIdeasFor } from "@/lib/careerResources";
import { PROGRAMS, SGT_ONLINE_APPLY } from "@/lib/siteConfig";

interface ExternalCandidate {
  fullName: string;
  registrationNo: string;
  profession?: string;
  experienceYears?: number;
  qualification?: Qualification;
  targetRole?: string;
  employment?: { currentStack?: string };
}

function GapAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready: authReady, openSignIn } = useAuth();

  const [candidate, setCandidate] = useState<ExternalCandidate | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [wantsDetails, setWantsDetails] = useState(false);

  const role = searchParams.get("role") || candidate?.targetRole || "";

  useEffect(() => {
    const saved = localStorage.getItem("optipath_student");
    if (!saved) {
      router.replace("/onboard");
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      const external = Boolean(parsed?.isExternal || String(parsed?.registrationNo || "").startsWith("EXT-"));
      if (!external) {
        router.replace("/dashboard");
        return;
      }
      setCandidate(parsed);
      setLoaded(true);
    } catch {
      router.replace("/onboard");
    }
  }, [router]);

  const analysis = useMemo(() => {
    if (!candidate || !role) return null;
    return computeSkillMatch(role, candidate.employment?.currentStack || "");
  }, [candidate, role]);

  const evaluation = useMemo(() => {
    if (!analysis || !candidate?.qualification) return null;
    return evaluatePrograms(role, candidate.qualification, analysis.missing);
  }, [analysis, candidate, role]);

  const ideas = useMemo(() => (role ? projectIdeasFor(detectRoleFamily(role)).slice(0, 3) : []), [role]);

  if (!loaded || !candidate) {
    return <div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#64748B]">Loading...</div>;
  }
  if (!role || !analysis) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#64748B]">
        No goal selected. <Link href="/onboard" className="font-bold text-[#831843] underline">Choose your goal</Link>
      </div>
    );
  }

  const unlocked = wantsDetails && Boolean(user);
  const remaining = 100 - analysis.percentage;
  const nothingMissing = analysis.missing.length === 0;

  const requestDetails = () => {
    setWantsDetails(true);
    if (!user) openSignIn("Sign in to see the skills you are missing and the programmes that can close the gap.");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link href="/onboard" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]">
            <ArrowLeft className="w-4 h-4" /> Edit my answers
          </Link>
          <Link href="/" className="text-xs font-semibold text-[#64748B] hover:text-[#831843]">Home</Link>
        </div>

        {/* Readiness */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Your readiness</span>
              <h1 className="font-serif text-3xl font-bold leading-tight">
                {analysis.percentage === 0 ? "You are at the starting line for" : `You are ${analysis.percentage}% ready for`}{" "}
                <span className="italic text-[#831843]">{role}</span>
              </h1>
              <p className="text-xs text-[#526173]">
                Based on required core skills match: {analysis.covered.length} of {analysis.required.length} skills for the{" "}
                <b className="text-[#0E1726]">{analysis.familyLabel}</b> template.
                {analysis.confidence === "low" && " This occupation has no dedicated template, so general software fundamentals are used."}
                {analysis.confidence === "medium" && " This is the closest standard template for the role."}
              </p>
              <p className="text-[11px] text-[#64748B]">
                {candidate.fullName}
                {candidate.profession ? ` · ${candidate.profession}` : ""}
                {candidate.experienceYears != null ? ` · ${candidate.experienceYears} yr experience` : ""} · {qualificationLabel(candidate.qualification)}
              </p>
            </div>
            <div className="text-center p-5 bg-[#FAF8F5] rounded-3xl border border-[#EAE4D9] min-w-[140px]">
              <span className="text-5xl font-serif font-bold text-[#831843]">{analysis.percentage}%</span>
              <span className="text-[10px] font-bold text-[#64748B] uppercase block mt-1">Ready</span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-[#EFEBE4] rounded-full overflow-hidden" role="progressbar" aria-valuenow={analysis.percentage} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-[#831843] rounded-full" style={{ width: `${analysis.percentage}%` }} />
          </div>

          {analysis.covered.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Skills you already have for this role
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.covered.map((c) => (
                  <span key={c.id} className="text-[11px] px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg" title={c.evidence ? `From: ${c.evidence}` : undefined}>
                    ✓ {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.unrecognized.length > 0 && (
            <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              We could not map these entries to a known skill: {analysis.unrecognized.join(", ")}. Use standard names (for example &ldquo;PostgreSQL&rdquo; or &ldquo;Google Ads&rdquo;) via &ldquo;Edit my answers&rdquo; if they should count.
            </p>
          )}
        </div>

        {/* The remaining part */}
        {nothingMissing ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-sm text-emerald-900">
            <Sparkles className="w-4 h-4 inline mr-1.5" />
            You list every core skill for this role. Focus on proof: projects and interview practice. Use the buttons at the bottom to find openings.
          </div>
        ) : !unlocked ? (
          <div className="bg-white rounded-3xl border-2 border-[#831843] p-8 shadow-md text-center space-y-4">
            <h2 className="font-serif text-2xl font-bold">
              What about the other {remaining}%?
            </h2>
            <p className="text-xs text-[#526173] max-w-lg mx-auto">
              See exactly which skills are missing, which SGT Online programme could teach them, and what to learn on your own.
            </p>
            <button
              onClick={requestDetails}
              disabled={!authReady}
              className="px-10 py-4 bg-[#831843] hover:bg-[#701237] disabled:opacity-60 text-white font-bold text-sm tracking-wide rounded-full shadow-lg transition inline-flex items-center gap-2 cursor-pointer"
            >
              {!user && <Lock className="w-4 h-4" />} Show me what&apos;s missing <ArrowRight className="w-4 h-4" />
            </button>
            {!user && <p className="text-[11px] text-[#64748B]">You will be asked to sign in with Google first.</p>}
          </div>
        ) : (
          <>
            {/* A. Gaps */}
            <div className="bg-white rounded-3xl border-2 border-rose-300 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-700" />
                  <h3 className="font-serif font-bold text-lg text-rose-950">What is missing ({analysis.missing.length})</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.foundationGaps.map((item) => (
                  <div key={item.id} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-950">✕ {item.label}</span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 shrink-0">Foundational</span>
                    </div>
                    <p className="text-xs text-amber-900">{item.reason}</p>
                  </div>
                ))}
                {analysis.productionGaps.map((item) => (
                  <div key={item.id} className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-rose-950">✕ {item.label}</span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 shrink-0">Industry skill</span>
                    </div>
                    <p className="text-[11px] text-rose-900 leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* B. Programmes */}
            {evaluation && (
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EAE4D9]">
                  <GraduationCap className="w-5 h-5 text-[#831843]" />
                  <h3 className="font-serif font-bold text-lg">SGT Online programmes for your level</h3>
                </div>

                {evaluation.note && <p className="text-xs text-[#526173] bg-[#FAF8F5] border border-[#EAE4D9] rounded-xl p-3">{evaluation.note}</p>}

                <div className="space-y-4">
                  {evaluation.fits.map((fit) => (
                    <div key={fit.key} className={`rounded-2xl p-5 space-y-3 border ${fit.recommended ? "border-2 border-[#831843] bg-rose-50/30" : "border-[#E5DFD5] bg-[#FAF8F5]"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          {fit.recommended && <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#831843] text-white uppercase">Recommended for you</span>}
                          <h4 className="font-serif font-bold text-base mt-1">{fit.program.name}</h4>
                          <p className="text-[11px] text-[#64748B]">{fit.program.duration}</p>
                        </div>
                        <span className="text-xs font-bold text-[#831843]">
                          Teaches {fit.covered.length} of your {analysis.missing.length} gaps
                        </span>
                      </div>

                      {fit.covered.length > 0 ? (
                        <ul className="space-y-1.5">
                          {fit.covered.map((c) => (
                            <li key={c.skill.id} className="text-xs text-[#0E1726] flex items-start gap-2">
                              <span className="text-emerald-700 font-bold">✓</span>
                              <span><b>{c.skill.label}</b> <span className="text-[#526173]">through &ldquo;{c.course}&rdquo; (Semester {c.semester})</span></span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-[#526173]">None of your current gaps appear in this programme&apos;s mapped syllabus.</p>
                      )}

                      {fit.unmappedSemesters.length > 0 && (
                        <p className="text-[11px] text-[#64748B]">
                          Syllabus for Semester{fit.unmappedSemesters.length > 1 ? "s" : ""} {fit.unmappedSemesters.join(", ")} is not loaded here, so the count above may be higher.
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 pt-1">
                        <a href={SGT_ONLINE_APPLY} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs rounded-xl transition">
                          Register on SGT Online
                        </a>
                        <ProgramGuideLink programKey={fit.key} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* C. Do it yourself */}
            {evaluation && (
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-3">
                <h3 className="font-serif font-bold text-lg">Learn on your own</h3>
                {evaluation.selfLearn.length === 0 ? (
                  <p className="text-xs text-emerald-800 font-semibold">The recommended programme&apos;s mapped syllabus teaches every gap listed above.</p>
                ) : (
                  <>
                    <p className="text-xs text-[#526173]">
                      {evaluation.fits.some((f) => f.recommended)
                        ? "The recommended programme's mapped syllabus does not cover these, so plan to learn them yourself:"
                        : "Plan to learn these yourself:"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evaluation.selfLearn.map((s) => (
                        <div key={s.id} className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
                          <span className="text-xs font-bold text-rose-950 block">{s.label}</span>
                          <p className="text-[11px] text-rose-900 mt-1">{s.reason}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* D. Projects */}
            {ideas.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-3">
                <h3 className="font-serif font-bold text-lg">Projects that build the missing skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ideas.map((p, i) => (
                    <div key={p.title} className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl space-y-2">
                      <h4 className="font-serif font-bold text-sm">{i + 1}. {p.title}</h4>
                      <p className="text-xs text-[#526173] leading-relaxed">{p.summary}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.skills.map((s) => (
                          <span key={s} className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-900 border border-purple-200 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Bottom actions */}
        <CareerActions role={role} showProjects={false} />
      </div>
    </div>
  );
}

function ProgramGuideLink({ programKey }: { programKey: string }) {
  const p = PROGRAMS.find((x) => x.key === programKey);
  if (!p) return null;
  return (
    <a href={p.guideUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white border border-[#DCD6CC] hover:border-[#831843] text-[#831843] font-bold text-xs rounded-xl transition">
      Program guide
    </a>
  );
}

export default function GapAnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#64748B]">Loading...</div>}>
      <GapAnalysisContent />
    </Suspense>
  );
}
