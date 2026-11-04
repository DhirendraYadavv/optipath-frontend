"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Target, 
  Search, 
  ArrowRight,
  LogOut,
  Check,
  ChevronDown,
  ChevronUp,
  Layers
} from "lucide-react";
import { ALL_500_PLUS_ROLES } from "@/data/salaryAndRolesData";

// Canonical Master Curriculum for SGT BCA/MCA structure
const MASTER_CURRICULUM: Record<number, string[]> = {
  1: ["Programming in C", "Mathematical Foundations of Computer Science", "Digital Electronics & Logic Design", "Communication Skills & Professional Ethics"],
  2: ["Data Structures & Algorithms in C++", "Database Management Systems (SQL)", "Computer Organization & Architecture", "Discrete Mathematics"],
  3: ["Object-Oriented Programming with Java", "Operating Systems Concepts", "Computer Networks & Data Communication", "Web Technologies (HTML/CSS/JS)"],
  4: ["Design & Analysis of Algorithms", "Python for Computing & Scripting", "Software Engineering & Agile Methodologies", "Linux System Administration"],
  5: ["Cloud Computing & Virtualization", "Information & Network Security", "Full Stack Web Development", "Elective I: Artificial Intelligence Fundamentals"],
  6: ["Distributed Systems & Big Data", "DevOps & Container Orchestration", "Mobile Application Development", "Major Capstone Industry Project"]
};

export default function DashboardPage() {
  const router = useRouter();

  const [student, setStudent] = useState<any>({
    fullName: "Dhirendra Yadav",
    registrationNo: "SGT2023BCA1042",
    program: "Bachelor of Computer Applications (BCA)",
    semester: 4,
    cgpa: "8.74"
  });

  const [canonicalSkills, setCanonicalSkills] = useState<string[]>([
    "Python", "DSA", "DBMS / SQL", "Git", "Object-Oriented Programming", "Linux Basics"
  ]);

  const [selectedRole, setSelectedRole] = useState<string>("Software Development Engineer 1 (SDE 1)");
  const [roleSearchTerm, setRoleSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("optipath_student");
    let currentSem = 4;
    let reg = "SGT2023BCA1042";

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        currentSem = Number(parsed.semester) || 4;
        reg = parsed.registrationNo || reg;

        setStudent({
          fullName: parsed.fullName || "Dhirendra Yadav",
          registrationNo: parsed.registrationNo || reg,
          program: parsed.program || "Bachelor of Computer Applications (BCA)",
          semester: currentSem,
          cgpa: parsed.cgpa || "8.74"
        });
      } catch {}
    } else {
      router.push("/login");
    }

    // Attempt backend sync
    fetch(`http://localhost:8000/students/academic-profile/${encodeURIComponent(reg)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.acquiredSkills && data.acquiredSkills.length > 0) {
          setCanonicalSkills(data.acquiredSkills);
        }
      })
      .catch(() => {});
  }, [router]);

  // Dynamically compute coursework according to the student's exact semester
  const pastSubjects = useMemo(() => {
    const sem = Number(student.semester) || 1;
    const courses: string[] = [];
    for (let s = 1; s < sem; s++) {
      if (MASTER_CURRICULUM[s]) courses.push(...MASTER_CURRICULUM[s]);
    }
    return courses;
  }, [student.semester]);

  const activeSubjects = useMemo(() => {
    const sem = Number(student.semester) || 1;
    return MASTER_CURRICULUM[sem] || [];
  }, [student.semester]);

  const upcomingSubjects = useMemo(() => {
    const sem = Number(student.semester) || 1;
    const courses: { name: string; sem: number }[] = [];
    for (let s = sem + 1; s <= 6; s++) {
      if (MASTER_CURRICULUM[s]) {
        MASTER_CURRICULUM[s].forEach((c) => courses.push({ name: c, sem: s }));
      }
    }
    return courses;
  }, [student.semester]);

  const filteredRoles = useMemo(() => {
    const catalog = ALL_500_PLUS_ROLES && ALL_500_PLUS_ROLES.length > 0 
      ? ALL_500_PLUS_ROLES 
      : [
          "Software Development Engineer 1 (SDE 1)",
          "Backend Developer (Python/FastAPI/Django)",
          "Full Stack Developer (Next.js & Spring Boot)",
          "Frontend Engineer (React / TypeScript)",
          "Cloud & DevOps Engineer (Docker/K8s/AWS)",
          "Data Scientist & AI Engineer",
          "Cybersecurity & SOC Analyst",
          "Distributed Systems Architect"
        ];
    if (!roleSearchTerm.trim()) return catalog.slice(0, 50);
    return catalog.filter((r: string) => r.toLowerCase().includes(roleSearchTerm.toLowerCase())).slice(0, 50);
  }, [roleSearchTerm]);

  const handleProceed = () => {
    router.push(`/gap-analysis?role=${encodeURIComponent(selectedRole)}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]">
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">
              Step 2A &bull; Semester {student.semester} Academic Hub
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("optipath_student");
                localStorage.removeItem("optipath_token");
                router.push("/login");
              }}
              className="inline-flex items-center gap-1 text-xs text-rose-700 hover:underline font-semibold cursor-pointer border-l border-[#DDD8CE] pl-3"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* 1. Academic Overview & Verification Badge */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-mono font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              SGT Verified Student Record
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#0E1726]">{student.fullName}</h1>
            <p className="text-xs text-[#526173]">
              Registration No: <b className="font-mono text-[#0E1726]">{student.registrationNo}</b> &bull; Program: <span className="font-semibold text-[#0E1726]">{student.program}</span>
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE4D9]">
            <div className="text-center pr-4 border-r border-[#DDD8CE]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Current Standing</span>
              <span className="font-serif text-xl font-bold text-[#831843]">Semester {student.semester}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Academic CGPA</span>
              <span className="font-serif text-xl font-bold text-emerald-800">{student.cgpa}</span>
            </div>
          </div>
        </div>

        {/* 2. Subjects Breakdown (Past vs Active vs Upcoming) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Subjects Studied Till Now (Semesters < Current) */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif font-bold text-base text-emerald-950">
                  Subjects Studied Till Now ({pastSubjects.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Semesters 1 to {Math.max(1, student.semester - 1)}
              </span>
            </div>
            <p className="text-xs text-[#526173]">
              Passed courses verified by completed academic transcripts:
            </p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {pastSubjects.length > 0 ? (
                pastSubjects.map((c: string) => (
                  <div key={c} className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs text-emerald-950 font-medium">
                    <span>✓ {c}</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">Passed</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-[#64748B] bg-[#FAF8F5] rounded-xl">
                  First semester in progress. No prior degree semesters recorded.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Subjects (Semesters > Current) & Active Semester */}
          <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <h3 className="font-serif font-bold text-base text-amber-950">
                  Active & Scheduled Subjects
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                Semester {student.semester}+
              </span>
            </div>

            {/* Currently Active Semester */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-amber-900 uppercase block">
                Currently Enrolled &bull; Semester {student.semester}:
              </span>
              {activeSubjects.map((c: string) => (
                <div key={c} className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-950 font-medium">
                  <span>⏱ {c}</span>
                  <span className="text-[9px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Active</span>
                </div>
              ))}
            </div>

            {/* Future Semesters */}
            <div className="space-y-1.5 pt-2 border-t border-amber-100">
              <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase block">
                Scheduled for Future Semesters:
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {upcomingSubjects.length > 0 ? (
                  upcomingSubjects.map((item, idx) => (
                    <div key={idx} className="p-2 bg-[#FAF8F5] border border-[#EAE4D9] rounded-xl flex items-center justify-between text-xs text-[#526173]">
                      <span>&bull; {item.name}</span>
                      <span className="text-[9px] font-mono bg-white border border-[#DDD8CE] text-[#831843] px-1.5 py-0.5 rounded font-bold">
                        Sem {item.sem}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-emerald-800 font-semibold block pt-1">
                    Final semester reached. All degree coursework active or completed.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Choose Your Career Path Selection (Bottom Section) */}
        <div className="bg-white rounded-3xl border-2 border-[#831843] p-8 shadow-md space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Step 3: Choose Your Career Path
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#0E1726]">
              Select Your Target Professional Destination
            </h2>
            <p className="text-xs text-[#526173]">
              The gap engine will cross-reference your past coursework and upcoming semesters against this exact industry specification.
            </p>
          </div>

          <div className="space-y-2">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-4 bg-[#FAF8F5] border-2 border-[#831843] rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white transition"
            >
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#831843] block">Target Role Selected:</span>
                <span className="font-serif font-bold text-base text-[#0E1726]">{selectedRole}</span>
              </div>
              <button 
                type="button"
                className="px-4 py-1.5 bg-white border border-[#DDD8CE] rounded-xl text-xs font-bold text-[#831843] flex items-center gap-1 cursor-pointer"
              >
                {isDropdownOpen ? "Close Search" : "Change Role"}
                {isDropdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isDropdownOpen && (
              <div className="p-4 bg-white border border-[#E5DFD5] rounded-2xl shadow-lg space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    value={roleSearchTerm}
                    onChange={(e) => setRoleSearchTerm(e.target.value)}
                    placeholder="Search roles (e.g. SDE, AI Engineer, Backend, DevOps, Cyber)..."
                    className="w-full pl-8 pr-4 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                  {filteredRoles.map((role: string) => (
                    <div
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setIsDropdownOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
                        selectedRole === role ? "bg-[#831843] text-white font-bold" : "hover:bg-[#FAF8F5] text-[#0E1726]"
                      }`}
                    >
                      <span>{role}</span>
                      {selectedRole === role && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#EAE4D9]">
            <span className="text-xs text-[#526173]">
              Ready to evaluate against <b className="text-[#0E1726]">{selectedRole}</b>?
            </span>
            <button
              onClick={handleProceed}
              className="px-8 py-3.5 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              Run 3-Tier Skill Gap Engine <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
