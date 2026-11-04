"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FolderGit2, Copy, Check, X, ShieldAlert } from "lucide-react";

interface Milestone {
  phase: string;
  years: string;
  title: string;
  salaryBand: string;
  prerequisites: string[];
  projects: string[];
  interviewRoundFocus: string;
  killerTrap: string;
}

const MILESTONES: Milestone[] = [
  {
    phase: "Phase 1",
    years: "Year 1 - 2",
    title: "Foundation & LeetCode Patterns",
    salaryBand: "₹6 - 12 LPA",
    prerequisites: ["Data Structures & Algorithms", "Time & Space Complexity", "Git Version Control", "SQL Relational Modeling"],
    projects: ["CLI In-Memory Storage Utility", "Developer Portfolio with Automated CI"],
    interviewRoundFocus: "Round 1 Live Coding: Binary Trees, Sliding Window, String Tokenization.",
    killerTrap: "Memorizing solutions rather than pattern derivation; inability to explain space complexity tradeoffs on recursive stacks."
  },
  {
    phase: "Phase 2",
    years: "Year 2 - 3",
    title: "Distributed Backend & Caching Tier",
    salaryBand: "₹18 - 28 LPA",
    prerequisites: ["Microservice Architecture", "Redis In-Memory Caching", "Docker Containerization", "FastAPI / Node.js"],
    projects: ["High-Throughput Rate Limiter Service", "Real-Time WebSocket Message Broker"],
    interviewRoundFocus: "Round 2 Machine Coding: Asynchronous event loops, database indexing, and thread-safe mutex locks.",
    killerTrap: "N+1 database queries under load; failing to protect cache against stampedes with mutex semaphores."
  },
  {
    phase: "Phase 3",
    years: "Year 4 - 5+",
    title: "Scale Architect & Autonomous Systems",
    salaryBand: "₹35 - 55+ LPA",
    prerequisites: ["Kubernetes Clustering", "Event-Driven Queues (Kafka)", "Distributed Sharding", "System Observability"],
    projects: ["Fault-Tolerant Distributed Storage Engine", "Vector Search Semantic Retrieval Pipeline"],
    interviewRoundFocus: "Round 3 High-Level System Design: Multi-region failover, split-brain mitigation, and CAP theorem tradeoffs.",
    killerTrap: "Premature microservices sprawl; neglecting telemetry and distributed tracing across async RPC boundaries."
  }
];

export default function CareerTwinGraph({ currentRoleTitle }: { currentRoleTitle: string; userSkills: string[] }) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [copied, setCopied] = useState(false);

  const copyCheatSheet = () => {
    if (!selectedMilestone) return;
    const text = `--- ${selectedMilestone.title} (${selectedMilestone.years}) Cheat Sheet ---\n` +
      `Salary Band: ${selectedMilestone.salaryBand}\n` +
      `Prerequisites: ${selectedMilestone.prerequisites.join(", ")}\n` +
      `Projects: ${selectedMilestone.projects.join(", ")}\n` +
      `Interview Focus: ${selectedMilestone.interviewRoundFocus}\n` +
      `Trap: ${selectedMilestone.killerTrap}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MILESTONES.map((m, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedMilestone(m)}
            className="p-5 rounded-2xl bg-[#FAF8F5] border-2 border-[#E5DFD5] hover:border-[#831843] cursor-pointer transition shadow-xs relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
                  {m.phase} &bull; {m.years}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono">
                  {m.salaryBand}
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#0E1726] leading-snug">
                {m.title}
              </h4>
              <p className="text-xs text-[#526173] mt-2 line-clamp-2">
                {m.interviewRoundFocus}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE4D9] flex items-center justify-between text-xs font-bold text-[#831843]">
              <span>Click to inspect & prep</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#DDD8CE] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
                    {selectedMilestone.phase} &bull; {selectedMilestone.years}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#0E1726]">
                    {selectedMilestone.title}
                  </h3>
                </div>
                <button onClick={() => setSelectedMilestone(null)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 my-5 text-xs">
                <div className="flex justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-emerald-950">
                  <span className="font-bold">Verified Compensation Band:</span>
                  <span className="font-bold">{selectedMilestone.salaryBand}</span>
                </div>

                <div>
                  <span className="font-bold text-[#0E1726] block mb-1">Non-Negotiable Prerequisites:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMilestone.prerequisites.map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DDD8CE] text-[#0E1726]">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#0E1726] block mb-1">Required Portfolio Implementations:</span>
                  <div className="space-y-1">
                    {selectedMilestone.projects.map((proj) => (
                      <div key={proj} className="flex items-center gap-2 text-[#526173]">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#831843]" />
                        <span>{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-950">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    <span>Interviewer Killer Trap to Avoid:</span>
                  </div>
                  <p className="text-rose-900 leading-relaxed">
                    {selectedMilestone.killerTrap}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE4D9] flex justify-between items-center">
                <button
                  onClick={copyCheatSheet}
                  className="px-4 py-2 bg-[#FAF8F5] border border-[#DDD8CE] hover:bg-white text-[#831843] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Cheat Sheet Copied!" : "Copy Interview Cheat Sheet"}
                </button>
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="px-5 py-2 bg-[#831843] text-white font-bold text-xs rounded-xl"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}