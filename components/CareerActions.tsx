"use client";

import React, { useMemo, useState } from "react";
import { Briefcase, Building2, Cpu, ExternalLink, Lock, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { detectRoleFamily } from "@/lib/skillMatch";
import { CITIES, employersFor, linkedInJobsUrl, projectIdeasFor } from "@/lib/careerResources";

interface CareerActionsProps {
  role: string;
  /** Hide the project-ideas button when projects are shown elsewhere on the page. */
  showProjects?: boolean;
}

export default function CareerActions({ role, showProjects = true }: CareerActionsProps) {
  const { user, openSignIn } = useAuth();
  const [city, setCity] = useState<string>("India");
  const [showCompanies, setShowCompanies] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);

  const family = useMemo(() => detectRoleFamily(role), [role]);
  const employers = useMemo(() => employersFor(family), [family]);
  const ideas = useMemo(() => projectIdeasFor(family).slice(0, 3), [family]);

  const guard = (reason: string, action: () => void) => () => {
    if (!user) {
      openSignIn(reason);
      return;
    }
    action();
  };

  const locked = !user;
  const cols = showProjects ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="bg-[#FAF8F5] border border-[#DDD8CE] rounded-3xl p-6 shadow-sm space-y-4">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Action Hub &bull; Career Launchpad</span>
        <h3 className="font-serif font-bold text-lg text-[#0E1726]">Turn your gap into applications</h3>
        {locked && <p className="text-xs text-[#526173]">Sign in with Google to unlock these.</p>}
      </div>

      <div className={`grid grid-cols-1 ${cols} gap-4`}>
        {/* Top companies */}
        <button
          type="button"
          onClick={guard("Sign in to see career pages of employers hiring for your goal.", () => setShowCompanies(true))}
          className="p-4 bg-white border border-[#DCD6CC] hover:border-[#831843] rounded-2xl text-left transition shadow-xs group cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Building2 className="w-5 h-5 text-[#831843]" />
              {locked && <Lock className="w-3.5 h-3.5 text-[#64748B]" />}
            </div>
            <h4 className="font-serif font-bold text-xs text-[#0E1726]">Top companies to apply</h4>
            <p className="text-[11px] text-[#526173]">Official career pages.</p>
          </div>
          <span className="text-[10px] font-bold text-[#831843] mt-3 block">View career pages &rarr;</span>
        </button>

        {/* 24h openings */}
        <div className="p-4 bg-[#831843] text-white rounded-2xl flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Briefcase className="w-5 h-5 text-white/90" />
              {locked && <Lock className="w-3.5 h-3.5 text-white/80" />}
            </div>
            <h4 className="font-serif font-bold text-xs">Openings in the last 24 hours</h4>
            <p className="text-[11px] text-white/80">Opens LinkedIn, filtered to the past 24 hours.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="job-city">City</label>
            <select
              id="job-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-[11px] text-[#0E1726] bg-white outline-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c === "India" ? "All India" : c}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={guard("Sign in to open fresh job listings for your goal.", () =>
                window.open(linkedInJobsUrl(role, city), "_blank", "noopener,noreferrer")
              )}
              className="px-3 py-1.5 bg-white text-[#831843] font-bold text-[11px] rounded-lg cursor-pointer hover:bg-rose-50 whitespace-nowrap"
            >
              Apply now &rarr;
            </button>
          </div>
        </div>

        {/* Project ideas */}
        {showProjects && (
          <button
            type="button"
            onClick={guard("Sign in to see project ideas for your goal.", () => setShowProjectsModal(true))}
            className="p-4 bg-white border border-[#DCD6CC] hover:border-purple-600 rounded-2xl text-left transition shadow-xs group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Cpu className="w-5 h-5 text-purple-700" />
                {locked && <Lock className="w-3.5 h-3.5 text-[#64748B]" />}
              </div>
              <h4 className="font-serif font-bold text-xs text-[#0E1726]">Project ideas</h4>
              <p className="text-[11px] text-[#526173]">Three ideas for your goal.</p>
            </div>
            <span className="text-[10px] font-bold text-purple-700 mt-3 block">See ideas &rarr;</span>
          </button>
        )}
      </div>

      {/* Companies modal */}
      {showCompanies && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Employer career pages">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Employer career pages</span>
                <h3 className="font-serif font-bold text-xl text-[#0E1726]">For: {role}</h3>
              </div>
              <button onClick={() => setShowCompanies(false)} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {employers.length > 0 ? (
              <div className="space-y-3">
                {employers.map((e) => (
                  <div key={e.name} className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0E1726]">{e.name}</h4>
                      <span className="text-[10px] font-mono text-[#526173]">{e.type}</span>
                    </div>
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
                    >
                      Careers page <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
                <p className="text-[11px] text-[#64748B]">
                  These are starting points, not a ranking. Hiring needs change; use the 24-hour openings button for fresh listings.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#526173]">
                A verified employer list for this field has not been added yet. Use the 24-hour openings button to see current listings for your goal.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Projects modal */}
      {showProjectsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Project ideas">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700">Project ideas</span>
                <h3 className="font-serif font-bold text-xl text-[#0E1726]">For: {role}</h3>
              </div>
              <button onClick={() => setShowProjectsModal(false)} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {ideas.map((p, i) => (
                <div key={p.title} className="p-5 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#0E1726]">{i + 1}. {p.title}</h4>
                  <p className="text-xs text-[#526173] leading-relaxed">{p.summary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.skills.map((s) => (
                      <span key={s} className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-900 border border-purple-200 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
