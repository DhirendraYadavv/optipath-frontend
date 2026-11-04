"use client";

import AuthFeatureGate from "@/components/AuthFeatureGate";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Briefcase, 
  Cpu, 
  ExternalLink, 
  X, 
  Calculator,
  ArrowRight
} from "lucide-react";

// Top Hiring Companies directory with direct links to official careers portals
const HIRING_COMPANIES = [
  { name: "Google", domain: "google.com/about/careers", type: "Tier-1 Tech", openings: "SDE / Systems Infrastructure", url: "https://www.google.com/about/careers/applications/jobs/results" },
  { name: "Microsoft", domain: "careers.microsoft.com", type: "Tier-1 Tech", openings: "Software Engineer / Cloud & AI", url: "https://careers.microsoft.com" },
  { name: "Amazon", domain: "amazon.jobs", type: "Tier-1 Tech", openings: "SDE 1 / AWS Distributed Services", url: "https://amazon.jobs" },
  { name: "Zomato / Blinkit", domain: "zomato.com/careers", type: "High-Growth Scaleup", openings: "Backend (Golang/Python/Redis)", url: "https://www.zomato.com/careers" },
  { name: "Razorpay", domain: "razorpay.com/jobs", type: "FinTech Scaleup", openings: "Core Payment Engine / Microservices", url: "https://razorpay.com/jobs" },
  { name: "PhonePe", domain: "phonepe.com/careers", type: "FinTech Scaleup", openings: "High-Throughput Distributed Architecture", url: "https://www.phonepe.com/careers" }
];

// Production-grade project blueprints tailored specifically to bridge Tier 3 external gaps
const PROJECT_BLUEPRINTS = [
  {
    title: "Distributed Asynchronous Task Broker & Sliding-Window Rate Limiter",
    tech: ["FastAPI", "Redis In-Memory", "Docker", "PostgreSQL"],
    solvesGap: "Redis Caching, Docker Containerization, Token Bucket Concurrency",
    description: "Build a multi-worker distributed task processing engine capable of sustaining 10,000 requests/minute with sliding window rate limiting and dead-letter queues.",
    architecture: [
      "API Gateway with sliding-window Redis token bucket middleware",
      "Asynchronous task ingestion pushing jobs to Redis streams",
      "Dockerized Python worker pools processing batches with exponential backoff",
      "Persistent ledger in PostgreSQL with composite indexing on execution status"
    ],
    resumeBullet: "Engineered a distributed task engine using Redis and Docker sustaining 10k req/min, reducing p99 response latency by 45%."
  },
  {
    title: "Real-Time Telemetry Streaming Pipeline with Kafka & WebSockets",
    tech: ["Apache Kafka", "WebSockets", "Docker Compose", "Node.js / Python"],
    solvesGap: "Kafka Streams, Event-Driven Architecture, Microservices",
    description: "Implement a low-latency telemetry data streaming engine that ingests high-frequency server metrics, partitions topics, and broadcasts updates to a live dashboard.",
    architecture: [
      "Kafka multi-broker cluster orchestrated via Docker Compose",
      "Consumer groups computing 5-second tumbling window aggregations",
      "Bi-directional WebSocket server relaying metrics to frontend clients with sub-40ms latency",
      "Circuit-breaker mechanism handling upstream broker partitions gracefully"
    ],
    resumeBullet: "Architected real-time streaming pipeline processing 50k events/sec with Kafka consumer groups and sub-40ms WebSocket telemetry."
  }
];

function GapAnalysisContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Software Development Engineer 1 (SDE 1)";

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const isExternal = Boolean(student?.registrationNo?.startsWith("EXT-") || student?.isExternal);
  const [matchPercentage, setMatchPercentage] = useState(68);

  const [showCompaniesModal, setShowCompaniesModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);

  // Tier 1: Passed courses that feed the target role
  const [tier1Covered, setTier1Covered] = useState([
    { subject: "Data Structures & Algorithms", skill: "Arrays, Trees, Graphs, Sorting & Complexity Analysis" },
    { subject: "Database Management Systems", skill: "Relational Modeling, SQL Joins, ACID Properties & Indexing" },
    { subject: "Programming with C++ & Python", skill: "Object-Oriented Programming, Memory Management Basics" }
  ]);

  // Tier 2: Upcoming university syllabus courses that will teach needed skills
  const [tier2Upcoming, setTier2Upcoming] = useState([
    { subject: "Operating Systems & Linux Kernel", semester: "Semester 5", skill: "Process Scheduling, Virtual Memory, Multithreading & POSIX Sockets" },
    { subject: "Computer Networks & Protocols", semester: "Semester 5", skill: "TCP/IP Stack, HTTP 1.1/2, DNS Resolution & Socket Programming" },
    { subject: "Design & Analysis of Algorithms", semester: "Semester 6", skill: "Dynamic Programming, Greedy Strategies & NP-Completeness" }
  ]);

  // Tier 3: Critical competencies missing from university syllabus entirely
  const [tier3SelfLearning, setTier3SelfLearning] = useState([
    { skill: "Redis In-Memory Caching", reason: "Not part of university syllabus; mandatory for industry latency optimization & caching layers." },
    { skill: "Docker & Container Orchestration", reason: "Degree covers virtualization theory; production containerization must be learned through hands-on labs." },
    { skill: "Microservice & Event Streams (Kafka/RabbitMQ)", reason: "Academic projects use monoliths; industry assessments test distributed asynchronous patterns." },
    { skill: "System Observability & APM (Prometheus/Grafana)", reason: "Telemetry, distributed tracing, and p99 SLA monitoring are exclusively production disciplines." }
  ]);

  useEffect(() => {
    let regNo = "SGT2023BCA1042";
    const saved = localStorage.getItem("optipath_student");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudent(parsed);
        if (parsed.registrationNo) regNo = parsed.registrationNo;
      } catch {}
    }

    setLoading(true);
    fetch("http://localhost:8000/analysis/calculate-gap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationNo: regNo, targetRole: role })
    })
      .then((res) => {
        if (!res.ok) throw new Error("API call failed");
        return res.json();
      })
      .then((data) => {
        if (typeof data.matchPercentage === "number") {
          setMatchPercentage(data.matchPercentage);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]">
            <ArrowLeft className="w-4 h-4" /> Return to Student Profile
          </Link>
          <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">
            Step 4: 3-Tier Skill Gap Engine
          </span>
        </div>

        {/* Target Role & Match Overview Banner */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
              Curriculum Calibration Engine
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#0E1726]">{role}</h1>
            <p className="text-xs text-[#526173]">
              {student 
                ? `Calibrated against ${student.fullName} (${student.registrationNo})` 
                : isExternal 
                  ? "Calibrated against industry baseline (Independent Candidate)" 
                  : "Cross-referenced with university syllabus."}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-[11px] text-[#526173] font-mono">
              <Calculator className="w-3.5 h-3.5 text-[#831843]" />
              Match % = (|Acquired Skills ∩ Mandatory Skills| / |Mandatory Skills|) × 100
            </div>
          </div>
          <div className="text-center p-5 bg-[#FAF8F5] rounded-3xl border border-[#EAE4D9] min-w-[140px]">
            <span className="text-4xl font-serif font-bold text-[#831843]">
              {loading ? "..." : `${matchPercentage}%`}
            </span>
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mt-1">Syllabus Fit</span>
          </div>
        </div>

        {/* The 3-Tier Breakdown */}
        <div className="space-y-6">

          {/* Tier 1: Already Covered */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif font-bold text-base text-emerald-950">
                  {isExternal ? "Verified Foundation / Prior Background" : "Tier 1: Already Covered in Passed Syllabus"}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Completed & Verified
              </span>
            </div>
            <p className="text-xs text-[#526173]">
              {isExternal
                ? "Foundational prerequisites verified from your submitted technical background:"
                : "University subjects you have already completed that directly satisfy foundational role prerequisites:"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {tier1Covered.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">✓ {item.subject}</span>
                  <p className="text-xs text-emerald-950 font-medium">{item.skill}</p>
                </div>
              ))}
            </div>
          </div>

          {!isExternal ? (
            <>
              {/* Tier 2: Coming Soon in University Syllabus */}
              <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <h3 className="font-serif font-bold text-base text-amber-950">
                      Tier 2: Coming Soon in University Syllabus
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                    Scheduled Coursework
                  </span>
                </div>
                <p className="text-xs text-[#526173]">
                  Skills that will be formally taught in your upcoming semesters. You do not need external courses for these:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {tier2Upcoming.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">{item.subject}</span>
                        <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">{item.semester}</span>
                      </div>
                      <p className="text-xs text-amber-950 font-medium">{item.skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 3: University External Gaps */}
              <div className="bg-white rounded-3xl border-2 border-rose-300 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <h3 className="font-serif font-bold text-base text-rose-950">
                      Tier 3: Self-Learning Required (The True External Gap)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-rose-100 text-rose-900 uppercase">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-[#526173]">
                  Industry-critical competencies that <b>neither past nor future university syllabus</b> covers. You must master these independently:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {tier3SelfLearning.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
                      <span className="text-xs font-bold text-rose-950 block">✕ {item.skill}</span>
                      <p className="text-[11px] text-rose-900 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Non-SGT External: Unified Independent Gap Breakdown */}
              <div className="bg-white rounded-3xl border-2 border-rose-300 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-700" />
                    <div>
                      <h3 className="font-serif font-bold text-lg text-rose-950">
                        Total Industry Skill Gap (Self-Learning Required)
                      </h3>
                      <p className="text-xs text-[#526173]">
                        As an independent candidate, you have no active university curriculum covering these topics. You must master every prerequisite independently:
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 uppercase shrink-0">
                    Independent Study Roadmap
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tier2Upcoming.map((item, idx) => (
                    <div key={`ext-up-${idx}`} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950">✕ {item.subject}</span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">Foundational Gap</span>
                      </div>
                      <p className="text-xs text-amber-900">{item.skill}</p>
                      <p className="text-[10px] text-amber-700 italic">Requires self-directed coursework and hands-on implementation.</p>
                    </div>
                  ))}

                  {tier3SelfLearning.map((item, idx) => (
                    <div key={`ext-self-${idx}`} className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-950 block">✕ {item.skill}</span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">Production Gap</span>
                      </div>
                      <p className="text-[11px] text-rose-900 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SGT Online Fast-Track Degree Registration Banner */}
              <div className="bg-gradient-to-r from-[#831843] via-[#6e1338] to-[#450a22] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-rose-300/30">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-rose-200 border border-white/20">
                      <span>Fast-Track Degree Accreditation</span> &bull; <span>UGC-DEB Approved</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      Fill the Academic Gap with SGT Online
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                      Self-study requires immense discipline, and tier-1 recruiters filter out applicants without accredited CS credentials. Bridge foundational gaps with structured faculty mentorship, semester projects, and campus placement access in the <b>SGT Online BCA, MCA, or MBA</b> degree programs.
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://sgtonline.ac.in/"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 bg-white hover:bg-rose-50 text-[#831843] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition text-center hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Explore SGT Online &rarr;
                    </a>
                    <a
                      href="https://sgtonline.ac.in/apply/"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 bg-rose-950/70 hover:bg-rose-950 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition text-center"
                    >
                      Direct Admission
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Step 5: Action Hub (3 Interactive Launch Buttons) */}
        <div className="bg-[#FAF8F5] border border-[#DDD8CE] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
              Action Hub &bull; Career Launchpad
            </span>
            <h3 className="font-serif font-bold text-lg text-[#0E1726]">
              Bridge the Gap & Transition into Industry
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Button 1: Top Hiring Companies */}
            <button
              onClick={() => setShowCompaniesModal(true)}
              className="p-4 bg-white border border-[#DCD6CC] hover:border-[#831843] rounded-2xl text-left transition shadow-xs group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-1">
                <Building2 className="w-5 h-5 text-[#831843] group-hover:scale-110 transition" />
                <h4 className="font-serif font-bold text-xs text-[#0E1726]">Top Hiring Companies</h4>
                <p className="text-[11px] text-[#526173]">Direct portals to active employers.</p>
              </div>
              <span className="text-[10px] font-bold text-[#831843] mt-3 block">View Directory &rarr;</span>
            </button>

            {/* Button 2: Apply Now (LinkedIn 24-Hour Pulse) */}
            <Link
              href={`/live-jobs?role=${encodeURIComponent(role)}`}
              className="p-4 bg-[#831843] hover:bg-[#701237] text-white rounded-2xl text-left transition shadow-xs flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <Briefcase className="w-5 h-5 text-white/90 group-hover:scale-110 transition" />
                <h4 className="font-serif font-bold text-xs text-white">Apply Now (24h Pulse)</h4>
                <p className="text-[11px] text-white/80">Real-time jobs posted in last 24h.</p>
              </div>
              <span className="text-[10px] font-bold text-white/90 mt-3 block">Inspect Openings &rarr;</span>
            </Link>

            {/* Button 3: Related Project Ideas */}
            <button
              onClick={() => setShowProjectsModal(true)}
              className="p-4 bg-white border border-[#DCD6CC] hover:border-purple-600 rounded-2xl text-left transition shadow-xs group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-1">
                <Cpu className="w-5 h-5 text-purple-700 group-hover:scale-110 transition" />
                <h4 className="font-serif font-bold text-xs text-[#0E1726]">Related Project Ideas</h4>
                <p className="text-[11px] text-[#526173]">Tailored architectures bridging Tier 3.</p>
              </div>
              <span className="text-[10px] font-bold text-purple-700 mt-3 block">Explore Architectures &rarr;</span>
            </button>

          </div>
        </div>

      </div>

      {/* Modal 1: Top Hiring Companies with Direct Careers Links */}
      {showCompaniesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
                  Direct Employer Directory
                </span>
                <h3 className="font-serif font-bold text-xl text-[#0E1726]">
                  Top Companies Hiring for {role}
                </h3>
              </div>
              <button onClick={() => setShowCompaniesModal(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {HIRING_COMPANIES.map((comp) => (
                <div key={comp.name} className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#0E1726]">{comp.name}</h4>
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-white border border-[#DDD8CE] rounded text-[#526173]">
                        {comp.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#526173]">Roles: <span className="font-semibold text-[#0E1726]">{comp.openings}</span></p>
                    <span className="text-[10px] font-mono text-[#831843]">{comp.domain}</span>
                  </div>
                  <a
                    href={comp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    Careers Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Related Production Project Blueprints */}
      {showProjectsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700">
                  Portfolio Engineering Blueprints
                </span>
                <h3 className="font-serif font-bold text-xl text-[#0E1726]">
                  Production Projects Bridging Tier 3 Gaps
                </h3>
              </div>
              <button onClick={() => setShowProjectsModal(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {PROJECT_BLUEPRINTS.map((proj, i) => (
                <div key={i} className="p-5 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-serif font-bold text-sm text-[#0E1726]">{proj.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-900 border border-purple-200 rounded shrink-0">
                      Production Grade
                    </span>
                  </div>
                  <p className="text-xs text-[#526173] leading-relaxed">{proj.description}</p>
                  
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-950">
                    <b>Directly Bridges Tier 3 Gap:</b> {proj.solvesGap}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#0E1726] block">Architecture Specification:</span>
                    {proj.architecture.map((arch: string, aIdx: number) => (
                      <div key={aIdx} className="text-xs text-[#526173] flex items-center gap-1.5">
                        <span className="text-purple-700 font-bold">&bull;</span> {arch}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#EAE4D9] text-[11px] text-emerald-950 font-mono bg-emerald-50 p-2.5 rounded-xl">
                    <b>ATS Resume Metric:</b> &ldquo;{proj.resumeBullet}&rdquo;
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

export default function GapAnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#64748B]">Loading Gap Analysis Engine...</div>}>
      <GapAnalysisContent />
    </Suspense>
  );
}