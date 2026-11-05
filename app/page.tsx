"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, DollarSign, LogOut, Sparkles, Target, UserCheck, UserPlus, X, Briefcase, GraduationCap, Upload } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import SalaryEstimatorModal from "@/components/SalaryEstimatorModal";
import TalentGateway from "@/components/TalentGateway";
import TalentPoolUploadModal from "@/components/TalentPoolUploadModal";
import { FAQS, PRIVACY_NOTICE, PROGRAMS, SGT_ONLINE_APPLY, SGT_ONLINE_HOME, UGC_URL } from "@/lib/siteConfig";

export default function Home() {
  const { user, ready, openSignIn, signOut } = useAuth();
  const [showFork, setShowFork] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [showTalent, setShowTalent] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased selection:bg-[#831843]/15 selection:text-[#831843]">
      {/* ------------------------------ HEADER ------------------------------ */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center" aria-label="SGT Online home">
            <div className="relative w-36 sm:w-44 h-12">
              <Image src="/sgt-online-logo.png" alt="SGT Online University" fill className="object-contain object-left" priority />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#526173]">
            <a href="#programs" className="hover:text-[#831843] transition">Programs</a>
            <a href="#how-it-works" className="hover:text-[#831843] transition">How it works</a>
            <a href="#faq" className="hover:text-[#831843] transition">FAQ</a>
            <a href="#talent-gateway" className="hover:text-[#831843] transition">Talent Gateway</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSalary(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#831843] hover:text-[#701237] transition cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" /> <span>Salary Estimator</span>
            </button>

            {!ready ? (
              <span className="w-24 h-8" aria-hidden="true" />
            ) : user ? (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#DCD6CC] shadow-xs">
                {user.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
                <span className="text-xs font-semibold max-w-[110px] truncate">{user.firstName}</span>
                <button onClick={signOut} className="text-[11px] text-rose-700 hover:underline pl-2 border-l border-[#DDD] flex items-center gap-1 cursor-pointer">
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full bg-[#831843] hover:bg-[#701237] text-white shadow-xs transition cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ------------------------------- HERO ------------------------------- */}
        <section className="relative max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#831843] text-xs font-bold tracking-wide mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#831843]" />
            Supporting Students Throughout Their Degree &amp; Accelerating Career Placements Afterward
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[72px] text-[#0E1726] tracking-tight font-normal leading-[1.06]">
            Know what to study next, <br />
            <span className="italic font-serif text-[#831843]">and who is hiring for it today.</span>
          </h1>

          <p className="mt-8 text-[#526173] max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed font-light">
            A career intelligence and syllabus optimization engine. See which skills your target role needs, what your
            coursework already covers, and what is still missing.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowFork(true)}
              className="px-12 py-5 bg-[#831843] hover:bg-[#701237] text-white font-bold text-base tracking-wide rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-3 cursor-pointer group"
            >
              <span>Check Yourself</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setShowTalent(true)}
              className="px-8 py-5 bg-white border border-[#831843] text-[#831843] hover:bg-[#FAF8F5] font-bold text-sm tracking-wide rounded-full transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> <span>Upload Resume to Talent Pool</span>
            </button>
          </div>
        </section>

        {/* ------------------- TALENT & CAREER GATEWAY (CENTERPIECE) ------------------- */}
        <TalentGateway />

        {/* --------------------------- HOW IT WORKS --------------------------- */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-12 scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">How it works</span>
            <h2 className="font-serif text-3xl font-bold mt-1">Three steps from where you are to where you want to be</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Target, title: "1. Tell us your goal", text: "Pick the role you are aiming for and tell us where you stand today: SGT student or not." },
              { icon: GraduationCap, title: "2. See your skill gap", text: "We compare your skills or coursework with what the role asks for and show what is covered and what is missing." },
              { icon: Briefcase, title: "3. Act on it", text: "Open fresh job listings, company career pages and project ideas for your role, and find the SGT Online programme that closes the gap." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#831843]" />
                </div>
                <h3 className="font-serif font-bold text-base">{title}</h3>
                <p className="text-xs text-[#526173] mt-1.5 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------ PROGRAMS ---------------------------- */}
        <section id="programs" className="max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">SGT Online programmes</span>
            <h2 className="font-serif text-3xl font-bold mt-1">Close the gap with a degree</h2>
            <p className="text-xs text-[#526173] mt-2 max-w-xl mx-auto">
              Live faculty interaction and structured projects. Open a programme guide for syllabus, fees and eligibility.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROGRAMS.map((p) => (
              <div key={p.key} className="bg-white rounded-3xl border border-[#E5DFD5] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#831843]">{p.name}</h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{p.fullName}</p>
                  <p className="text-xs text-[#0E1726] mt-3 leading-relaxed">{p.focus}</p>
                </div>
                <a
                  href={p.guideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#831843] hover:bg-[#701237] text-white text-xs font-bold transition"
                >
                  Program guide <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <a href={SGT_ONLINE_APPLY} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#831843] hover:underline">
              Ready to apply? Go to direct admission &rarr;
            </a>
          </div>
        </section>

        {/* -------------------------------- FAQ ------------------------------- */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-12 scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">FAQ</span>
            <h2 className="font-serif text-3xl font-bold mt-1">Questions we hear most</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group bg-white rounded-2xl border border-[#E5DFD5] shadow-xs">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-sm font-semibold">
                  {f.q}
                  <ChevronDown className="w-4 h-4 text-[#831843] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-4 text-xs text-[#526173] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ------------------------------ FOOTER ------------------------------ */}
      <footer className="border-t border-[#E8E2D8] bg-[#F4F0E8] py-12 text-xs text-[#526173]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Academic Portals</span>
            <ul className="space-y-2">
              <li><a href="https://sgtuniversity.ac.in/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">SGT Main Portal &bull; Gurugram</a></li>
              <li><a href={SGT_ONLINE_HOME} target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">SGT Online CDOE</a></li>
              <li><a href={UGC_URL} target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">UGC Distance Education Bureau</a></li>
              <li><a href="http://naac.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">NAAC A+ Accreditation Record</a></li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Degree Programs</span>
            <ul className="space-y-2">
              {PROGRAMS.map((p) => (
                <li key={p.key}><a href={p.guideUrl} target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">{p.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Hiring Ecosystem</span>
            <ul className="space-y-2">
              <li><a href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">LinkedIn Jobs</a></li>
              <li><a href="https://www.naukri.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Naukri.com</a></li>
              <li><a href="https://wellfound.com/jobs" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Wellfound</a></li>
              <li><a href="https://www.instahyre.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Instahyre</a></li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Verification &amp; Standards</span>
            <ul className="space-y-2">
              <li><a href="https://leetcode.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">LeetCode</a></li>
              <li><a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">GitHub</a></li>
              <li><a href="https://roadmap.sh/backend" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Developer Roadmaps</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-[#EAE4D9] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>&copy; 2026 SGT University &bull; Centre for Distance &amp; Online Education &bull; Budhera, Gurugram, Haryana</p>
          <p className="text-[11px] text-[#64748B]">NAAC A+ Accredited Institution &bull; UGC-DEB Approved Online Programs</p>
        </div>
        <p className="max-w-7xl mx-auto px-6 mt-4 text-[11px] text-[#64748B] leading-relaxed">
          <b className="text-[#526173]">Privacy:</b> {PRIVACY_NOTICE}
        </p>
      </footer>

      {/* ---------------------- "CHECK YOURSELF" FORK MODAL ---------------------- */}
      {showFork && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Choose your track">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">Step 1 &bull; The Fork in the Road</span>
                <h3 className="font-serif font-bold text-2xl text-[#0E1726]">Select Your Profile Track</h3>
              </div>
              <button onClick={() => setShowFork(false)} aria-label="Close" className="text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#526173]">Choose how you want to check your readiness and find your skill gaps:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/login"
                onClick={() => setShowFork(false)}
                className="p-5 rounded-2xl border-2 border-[#831843] bg-[#FAF8F5] hover:bg-rose-50/50 flex flex-col justify-between transition group cursor-pointer shadow-xs"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#831843] text-white flex items-center justify-center mb-3">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#0E1726] group-hover:text-[#831843]">SGT Student</h4>
                  <p className="text-[11px] text-[#526173] mt-1.5 leading-relaxed">
                    Enter your registration number, date of birth and semester to load your coursework and see what is covered, upcoming and missing for your goal.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#831843] mt-5">Continue &rarr;</span>
              </Link>

              <Link
                href="/onboard"
                onClick={() => setShowFork(false)}
                className="p-5 rounded-2xl border-2 border-[#E5DFD5] bg-[#FAF8F5] hover:border-[#831843] hover:bg-white flex flex-col justify-between transition group cursor-pointer shadow-xs"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mb-3">
                    <UserPlus className="w-5 h-5 text-slate-700" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#0E1726] group-hover:text-[#831843]">Non-SGT Student</h4>
                  <p className="text-[11px] text-[#526173] mt-1.5 leading-relaxed">
                    Tell us your qualification, skills and goal to see how ready you are and which SGT Online programme could close the gap.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#526173] group-hover:text-[#831843] mt-5">Continue &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {showSalary && <SalaryEstimatorModal onClose={() => setShowSalary(false)} />}
      {showTalent && <TalentPoolUploadModal onClose={() => setShowTalent(false)} />}
    </div>
  );
}
