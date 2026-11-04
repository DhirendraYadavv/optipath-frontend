"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Layers, 
  Terminal, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

function RoadmapContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Software Development Engineer 1 (SDE 1)";

  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<any>({
    upstreamCompleted: [
      "Programming in C",
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Python for Computing"
    ],
    midstreamActive: [
      "Operating Systems",
      "Design & Analysis of Algorithms",
      "Computer Networks"
    ],
    recommendedElectives: [
      {
        semester: 5,
        elective: "Cloud Native Microservices Architecture",
        bridges: "Docker Containerization & Redis In-Memory Caching",
        roleRelevance: "Essential for clearing Round 2 machine coding assessments."
      },
      {
        semester: 6,
        elective: "High-Performance Distributed Systems",
        bridges: "Kafka Event Streams & DB Sharding",
        roleRelevance: "Required for High-Level System Design (HLD) interviews."
      }
    ],
    externalBridgeNodes: [
      {
        task: "Production Asynchronous Task Broker",
        techStack: ["FastAPI", "Redis", "Docker", "PostgreSQL"],
        description: "Containerized microservice featuring rate limiting, JWT auth, and worker queues.",
        targetMetric: "Sustains 10k req/min with sub-30ms p99 latency."
      },
      {
        task: "LeetCode Blind 75 Pattern Mastery",
        techStack: ["Two-Pointer", "Sliding Window", "Trees", "Dynamic Programming"],
        description: "Focus on medium/hard graph traversals, interval merging, and monotonic stacks.",
        targetMetric: "Solve 75 patterns under 25 mins per question."
      }
    ]
  });

  useEffect(() => {
    let regNo = "SGT2023BCA1042";
    const saved = localStorage.getItem("optipath_student");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.registrationNo) regNo = parsed.registrationNo;
      } catch {}
    }

    setLoading(true);
    fetch(`http://localhost:8000/graph/roadmap/${encodeURIComponent(regNo)}?targetRole=${encodeURIComponent(role)}`)
      .then((res) => {
        if (!res.ok) throw new Error("API call failed");
        return res.json();
      })
      .then((data) => {
        if (data.upstreamCompleted) {
          setRoadmap(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link
            href={`/gap-analysis?role=${encodeURIComponent(role)}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Gap Analysis
          </Link>
          <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">
            Page 5 &bull; Curriculum-Integrated Learning Roadmap
          </span>
        </div>

        {/* Roadmap Header */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
              Career Pathway Graph
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#0E1726]">{role}</h1>
            <p className="text-xs text-[#526173]">
              Curriculum bridge connecting university credits, upcoming semester electives, and production labs.
            </p>
          </div>
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9] text-center min-w-[150px]">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Pathway Velocity</span>
            <span className="font-serif text-xl font-bold text-emerald-800">2 Semesters</span>
            <span className="text-[10px] text-[#526173] block mt-0.5">To 100% Industry Fit</span>
          </div>
        </div>

        {/* 3 Graph Stream Phases */}
        <div className="space-y-6">
          {/* Phase 1: Upstream Completed Nodes */}
          <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1EBE2]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif font-bold text-sm text-[#0E1726]">
                  Upstream Nodes: Passed University Courses
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded">
                Foundation Verified
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {roadmap.upstreamCompleted?.map((c: string) => (
                <span key={c} className="px-3 py-1.5 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl text-xs font-medium">
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>

          {/* Phase 2: Midstream Recommended University Electives */}
          <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1EBE2]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#831843]" />
                <h3 className="font-serif font-bold text-sm text-[#0E1726]">
                  Midstream Nodes: Recommended Upcoming University Electives
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                Syllabus Integration
              </span>
            </div>
            <p className="text-xs text-[#526173]">
              Selecting these accredited SGT university electives automatically covers your critical red-zone gaps within your degree:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap.recommendedElectives?.map((el: any, i: number) => (
                <div key={i} className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#831843] uppercase">
                      Semester {el.semester} Elective
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-950 px-2 py-0.5 rounded">
                      High Leverage
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#0E1726]">{el.elective}</h4>
                  <p className="text-xs text-[#526173]">
                    <b>Bridges Skill Gap:</b> <span className="text-[#831843] font-semibold">{el.bridges}</span>
                  </p>
                  <p className="text-[11px] text-[#64748B] italic">{el.roleRelevance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: External Bridge Nodes */}
          <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1EBE2]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-700" />
                <h3 className="font-serif font-bold text-sm text-[#0E1726]">
                  External Bridge Nodes: Non-Academic Production Tasks
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-purple-50 text-purple-900 border border-purple-200 rounded">
                ATS Proof-of-Work
              </span>
            </div>
            <p className="text-xs text-[#526173]">
              Direct software engineering implementations to attach to your resume and GitHub:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap.externalBridgeNodes?.map((item: any, i: number) => (
                <div key={i} className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#0E1726]">{item.task}</h4>
                  <p className="text-xs text-[#526173]">{item.description}</p>
                  <div className="flex flex-wrap gap-1 py-1">
                    {item.techStack?.map((t: string) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#DDD8CE] rounded text-[#0E1726]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                    Target Metric: {item.targetMetric}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/gap-analysis?role=${encodeURIComponent(role)}`}
            className="px-6 py-3 rounded-xl border border-[#DDD8CE] bg-white text-xs font-bold text-[#526173] hover:bg-[#FAF8F5] transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Review Gap Matrix
          </Link>
          <Link
            href={`/live-jobs?role=${encodeURIComponent(role)}`}
            className="px-6 py-3 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            Inspect 24h Live Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] p-12 text-center text-xs text-[#64748B]">Loading Roadmap Graph...</div>}>
      <RoadmapContent />
    </Suspense>
  );
}