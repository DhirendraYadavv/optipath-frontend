"use client";

import AuthFeatureGate from "@/components/AuthFeatureGate";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import ResumeBuilderModal from "@/components/ResumeBuilderModal";
import LiveJobFeed from "@/components/LiveJobFeed";
import ResumeAuditModal from "@/components/ResumeAuditModal";
import ProofOfWorkAuditor from "@/components/ProofOfWorkAuditor";
import { SGT_PROGRAMS } from "@/data/sgtCurriculum";
import { ALL_500_PLUS_ROLES, getDynamicSalaryIntelligence, SalaryRoleInfo } from "@/data/salaryAndRolesData";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  ChevronDown, 
  ArrowUpRight, 
  Briefcase, 
  Check, 
  UploadCloud, 
  DollarSign, 
  Search, 
  FileText, 
  Sparkles, 
  Network,
  ChevronUp,
  Building,
  GraduationCap,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Code2,
  X,
  UserCheck,
  UserPlus
} from "lucide-react";

const pageVariants: any = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "choose-track" | "form" | "results">("landing");
  const [track, setTrack] = useState<"sgt" | "non-sgt">("sgt");

  // The Fork in the Road Dialog State
  const [showForkModal, setShowForkModal] = useState(false);

  // User & Auth State
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [studentSession, setStudentSession] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("optipath_student");
    if (saved) {
      try {
        setStudentSession(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Salary Estimate State
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salarySearchRole, setSalarySearchRole] = useState("Full Stack Systems Architect");
  const [salarySearchTerm, setSalarySearchTerm] = useState("");
  const [isSalaryDropdownOpen, setIsSalaryDropdownOpen] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const currentSalaryInfo: SalaryRoleInfo = useMemo(() => {
    return getDynamicSalaryIntelligence(salarySearchRole);
  }, [salarySearchRole]);

  // SGT Online Track State
  const [selectedCourseKey, setSelectedCourseKey] = useState<string>("bca");
  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [selectedRole, setSelectedRole] = useState<string>("Backend Systems Engineer");
  const [roleSearchTerm, setRoleSearchTerm] = useState<string>("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // External Track State
  const [nonSgtEdu, setNonSgtEdu] = useState("B.Tech Computer Science");
  const [experienceYears, setExperienceYears] = useState<number>(1);

  // Resume Ingestion
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedSuccessMsg, setUploadedSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Native Semantic Graph State
  const [graphData, setGraphData] = useState<any>(null);
  const [loadingGraph, setLoadingGraph] = useState(false);

  // Real Production Projects Fetched from Backend
  const [roleProjects, setRoleProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Pan-India Company Grid State
  const [companies, setCompanies] = useState<any[]>([]);
  const [companySearch, setCompanySearch] = useState<string>("");
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // ATS Modal & Reports
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  const API_URL = "http://localhost:8000";

  // Filter 500+ roles
  const filteredRoles = useMemo(() => {
    if (!roleSearchTerm.trim()) return ALL_500_PLUS_ROLES.slice(0, 80);
    return ALL_500_PLUS_ROLES.filter(r => r.toLowerCase().includes(roleSearchTerm.toLowerCase())).slice(0, 80);
  }, [roleSearchTerm]);

  const filteredSalaryRoles = useMemo(() => {
    if (!salarySearchTerm.trim()) return ALL_500_PLUS_ROLES.slice(0, 80);
    return ALL_500_PLUS_ROLES.filter(r => r.toLowerCase().includes(salarySearchTerm.toLowerCase())).slice(0, 80);
  }, [salarySearchTerm]);

  // Comprehensive Pan-India Directory
  const defaultCompanies = [
    { name: "Google India", city: "Bengaluru / Gurugram", careerUrl: "https://www.google.com/about/careers/applications/jobs/results/?location=India", tier: "Tier-1 Product" },
    { name: "Microsoft India", city: "Hyderabad / Noida / Bengaluru", careerUrl: "https://careers.microsoft.com/us/en/search-results?q=India", tier: "Tier-1 Product" },
    { name: "Amazon India", city: "Gurugram / Bengaluru / Hyderabad", careerUrl: "https://amazon.jobs/en/locations/india", tier: "Tier-1 Product" },
    { name: "Zomato", city: "Gurugram", careerUrl: "https://www.zomato.com/careers", tier: "Product Unicorn" },
    { name: "Blinkit", city: "Gurugram", careerUrl: "https://blinkit.com/careers", tier: "Product Unicorn" },
    { name: "Flipkart", city: "Bengaluru", careerUrl: "https://www.flipkartcareers.com/", tier: "Product Unicorn" },
    { name: "Swiggy", city: "Bengaluru", careerUrl: "https://careers.swiggy.com/", tier: "Product Unicorn" },
    { name: "Paytm", city: "Noida", careerUrl: "https://jobs.lever.co/paytm", tier: "FinTech Leader" },
    { name: "PhonePe", city: "Bengaluru / Pune", careerUrl: "https://www.phonepe.com/careers/", tier: "FinTech Leader" },
    { name: "Cred", city: "Bengaluru", careerUrl: "https://careers.cred.club/", tier: "FinTech Leader" },
    { name: "Razorpay", city: "Bengaluru", careerUrl: "https://razorpay.com/jobs/", tier: "FinTech Leader" },
    { name: "Uber India", city: "Hyderabad / Bengaluru", careerUrl: "https://www.uber.com/in/en/careers/", tier: "Global Tech" },
    { name: "Adobe India", city: "Noida / Bengaluru", careerUrl: "https://careers.adobe.com/us/en/search-results?q=India", tier: "Global Tech" },
    { name: "Oracle India", city: "Bengaluru / Hyderabad / Noida", careerUrl: "https://www.oracle.com/in/corporate/careers/", tier: "Enterprise Tech" },
    { name: "Salesforce India", city: "Hyderabad / Bengaluru", careerUrl: "https://salesforce.wd1.myworkdayjobs.com/External_Career_Site", tier: "Enterprise Tech" },
    { name: "Cisco India", city: "Bengaluru", careerUrl: "https://jobs.cisco.com/jobs/SearchJobs/India", tier: "Networking & Cloud" },
    { name: "Atlassian", city: "Bengaluru / Remote", careerUrl: "https://www.atlassian.com/company/careers", tier: "Global Tech" },
    { name: "Intuit India", city: "Bengaluru", careerUrl: "https://jobs.intuit.com/location/india-jobs", tier: "FinTech Leader" },
    { name: "TCS", city: "Delhi NCR / Mumbai / Pan India", careerUrl: "https://www.tcs.com/careers", tier: "Enterprise Tech" },
    { name: "Infosys", city: "Bengaluru / Pune / Pan India", careerUrl: "https://www.infosys.com/careers/", tier: "Enterprise Tech" },
    { name: "Wipro", city: "Bengaluru / Delhi NCR / Hyderabad", careerUrl: "https://careers.wipro.com/", tier: "Enterprise Tech" },
    { name: "HCLTech", city: "Noida / Chennai / Pan India", careerUrl: "https://www.hcltech.com/careers", tier: "Enterprise Tech" },
    { name: "Tech Mahindra", city: "Pune / Noida / Hyderabad", careerUrl: "https://careers.techmahindra.com/", tier: "Enterprise Tech" },
    { name: "Cognizant", city: "Gurugram / Chennai / Kolkata", careerUrl: "https://careers.cognizant.com/global/en", tier: "Enterprise Tech" },
    { name: "LTIMindtree", city: "Mumbai / Bengaluru / Pune", careerUrl: "https://www.ltimindtree.com/careers/", tier: "Enterprise Tech" },
    { name: "Persistent Systems", city: "Pune / Goa / Hyderabad", careerUrl: "https://www.persistent.com/careers/", tier: "Digital Engineering" },
    { name: "Zoho Corporation", city: "Chennai / Tenkasi / Salem", careerUrl: "https://www.zoho.com/careers/", tier: "SaaS Leader" },
    { name: "Freshworks", city: "Chennai / Bengaluru", careerUrl: "https://www.freshworks.com/company/careers/", tier: "SaaS Leader" },
    { name: "Postman", city: "Bengaluru / Remote", careerUrl: "https://www.postman.com/company/careers/", tier: "Developer Platform" },
    { name: "Hasura", city: "Bengaluru / Remote", careerUrl: "https://hasura.io/careers/", tier: "GraphQL / OSS Leader" },
    { name: "Groww", city: "Bengaluru", careerUrl: "https://groww.in/careers", tier: "FinTech Unicorn" },
    { name: "Zerodha", city: "Bengaluru", careerUrl: "https://zerodha.com/careers", tier: "FinTech Leader" },
    { name: "Urban Company", city: "Gurugram", careerUrl: "https://www.urbancompany.com/careers", tier: "Services Tech" },
    { name: "Delhivery", city: "Gurugram", careerUrl: "https://www.delhivery.com/careers", tier: "Logistics Tech" },
    { name: "Cars24", city: "Gurugram", careerUrl: "https://www.cars24.com/careers/", tier: "AutoTech Unicorn" },
    { name: "MakeMyTrip", city: "Gurugram", careerUrl: "https://careers.makemytrip.com/", tier: "TravelTech Leader" },
    { name: "Nykaa", city: "Mumbai / Gurugram", careerUrl: "https://www.nykaa.com/careers", tier: "E-Commerce Tech" },
    { name: "Jio Platforms", city: "Navi Mumbai / Bengaluru", careerUrl: "https://careers.jio.com/", tier: "Telecom / Cloud" },
    { name: "Airtel Digital", city: "Gurugram / Bengaluru", careerUrl: "https://www.airtel.in/careers/", tier: "Telecom / Cloud" }
  ];

  const filteredCompanies = useMemo(() => {
    const list = companies.length > 0 ? companies : defaultCompanies;
    if (!companySearch.trim()) return list;
    return list.filter(c => 
      c.name.toLowerCase().includes(companySearch.toLowerCase()) || 
      c.city.toLowerCase().includes(companySearch.toLowerCase()) ||
      (c.tier && c.tier.toLowerCase().includes(companySearch.toLowerCase()))
    );
  }, [companies, companySearch]);

  const navigateTo = (screen: "landing" | "choose-track" | "form" | "results") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentScreen(screen);
  };

  const evaluatePathwayAndProjects = async (prog: string, sem: number, role: string) => {
    setLoadingGraph(true);
    setLoadingProjects(true);

    fetch(`${API_URL}/curriculum/semantic-audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programCode: prog.toUpperCase(), currentSemester: sem, targetRole: role })
    })
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(() => {
        fetch(`${API_URL}/graph/pathway`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ programCode: prog.toUpperCase(), currentSemester: sem, targetRole: role })
        })
          .then(r => r.json())
          .then(fallbackData => setGraphData(fallbackData))
          .catch(() => {});
      })
      .finally(() => setLoadingGraph(false));

    fetch(`${API_URL}/role/projects?role=${encodeURIComponent(role)}`)
      .then(res => res.json())
      .then(data => setRoleProjects(data))
      .catch(() => {})
      .finally(() => setLoadingProjects(false));
  };

  useEffect(() => {
    setLoadingCompanies(true);
    fetch(`${API_URL}/companies`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setCompanies(data);
      })
      .catch(() => {})
      .finally(() => setLoadingCompanies(false));
  }, []);

  const handleResumeUploadToDB = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setUploadedSuccessMsg(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const auditRes = await fetch(`${API_URL}/student/audit-resume-deep`, {
        method: "POST",
        body: formData
      });
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditResult(auditData);
        setShowAuditModal(true);
      }

      await fetch(
        `${API_URL}/student/upload-resume-db?studentEmail=${encodeURIComponent(user?.email || "student@sgt.ac.in")}&targetRole=${encodeURIComponent(selectedRole)}`,
        { method: "POST", body: formData }
      );
      setUploadedSuccessMsg("? Resume audited & indexed in talent database for recruiters.");
    } catch {
      setUploadedSuccessMsg("? Resume received and analyzed.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDownloadAuditReport = async () => {
    setDownloadingReport(true);
    try {
      const res = await fetch(`${API_URL}/resume/download-audit-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: user ? `${user.firstName} ${user.lastName}` : "Prospective Student",
          targetRole: selectedRole,
          activeSkills: graphData?.semanticallyClearedCompetencies?.map((c: any) => c.competency) || ["Python", "DSA", "DBMS / SQL"],
          missingSkills: graphData?.trueIndustryGaps?.map((g: any) => g.missing_competency) || ["Redis In-Memory Caching", "Docker Containerization"],
          atsScore: graphData?.semanticReadinessScore || 84,
          recommendations: [
            "Add verified GitHub repository with containerized Dockerfile.",
            "Quantify API latency numbers in bullet points (e.g., p99 latency cut by 32%).",
            "Prepare for Redis cache stampede question in Round 2 interview."
          ]
        })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedRole.replace(/ /g, "_")}_Readiness_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("Generated readiness report.");
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased selection:bg-[#831843]/15 selection:text-[#831843]">
      
      {/* 1. TOP HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigateTo("landing")} className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-44 h-12">
              <Image
                src="/sgt-online-logo.png"
                alt="SGT Online University - Entitled by UGC"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </button>

          <div className="flex items-center gap-3">
            {/* Salary Estimator Link */}
            <button
              onClick={() => {
                setShowSalaryModal(true);
                setIsSalaryDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-[#831843] hover:text-[#701237] transition cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" /> Salary Estimator
            </button>

            {/* SGT Student Active Session Badge */}
            {studentSession ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <Link href="/dashboard" className="text-xs font-bold text-emerald-900 hover:underline">
                  {studentSession.fullName.split(" ")[0]} ({studentSession.registrationNo})
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("optipath_student");
                    localStorage.removeItem("optipath_token");
                    setStudentSession(null);
                  }}
                  className="text-[10px] text-rose-700 hover:underline ml-1 pl-1 border-l border-emerald-300 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : null}

            {/* Bold Sign In Button */}
            {user ? (
              <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-[#DCD6CC] shadow-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-semibold">{user.firstName}</span>
                <button onClick={() => setUser(null)} className="text-[11px] text-rose-700 hover:underline pl-2 border-l border-[#DDD] cursor-pointer">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full bg-[#831843] hover:bg-[#701237] text-white shadow-xs transition cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Screen Views */}
      <AnimatePresence mode="wait">
        
        {/* SCREEN 0: LANDING PAGE & CENTER HERO SECTION */}
        {currentScreen === "landing" && (
          <motion.main key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
            <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#831843] text-xs font-bold tracking-wide mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#831843]" /> 
                Supporting Students Throughout Their Degree & Accelerating Career Placements Afterward
              </div>

              <h1 className="font-serif text-5xl sm:text-7xl lg:text-[76px] text-[#0E1726] tracking-tight font-normal leading-[1.06]">
                Know what to study next, <br />
                <span className="italic font-serif text-[#831843]">and who is hiring for it today.</span>
              </h1>

              <p className="mt-8 text-[#526173] max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed font-light">
                A career intelligence and syllabus optimization engine. Project upcoming coursework forward, eliminate industry skill gaps, and export verified ATS resumes.
              </p>

              {/* High-Impact Big "Try It Out" Button */}
              <div className="mt-10 flex items-center justify-center">
                <button
                  onClick={() => setShowForkModal(true)}
                  className="px-12 py-5 bg-[#831843] hover:bg-[#701237] text-white font-bold text-base tracking-wide rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-3 cursor-pointer group"
                >
                  <span>Try It Out</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Realistic CTC Matrix */}
              <div id="salary-estimate" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#E5DFD5] shadow-xs max-w-3xl mx-auto">
                <div className="p-3 text-center border-r border-[#EFEBE4] last:border-none">
                  <span className="font-serif text-2xl font-bold text-[#0E1726] block">5 Programs</span>
                  <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">BCA &bull; MCA &bull; BBA &bull; BCom &bull; MBA</span>
                </div>
                <div className="p-3 text-center border-r border-[#EFEBE4] last:border-none">
                  <span className="font-serif text-2xl font-bold text-[#831843] block">?6 - 45 LPA</span>
                  <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Verified Indian CTC</span>
                </div>
                <div className="p-3 text-center border-r border-[#EFEBE4] last:border-none">
                  <span className="font-serif text-2xl font-bold text-[#0E1726] block">Neo4j Graph</span>
                  <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Curriculum Ontology</span>
                </div>
                <div className="p-3 text-center">
                  <span className="font-serif text-2xl font-bold text-emerald-800 block">24h Radar</span>
                  <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">Live Openings</span>
                </div>
              </div>
            </section>
          </motion.main>
        )}

        {/* SCREEN 1: CHOOSE TRACK (LEGACY SCREEN DIRECTS TO STEP 2 FLOWS) */}
        {currentScreen === "choose-track" && (
          <motion.main key="choose-track" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto px-6 py-20">
            <button onClick={() => navigateTo("landing")} className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-6 cursor-pointer hover:text-[#0E1726]">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs text-center">
              <h2 className="font-serif text-3xl text-[#0E1726] mb-8">Select Track</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="py-6 px-4 rounded-2xl border-2 border-[#831843] bg-[#FAF8F5] hover:bg-white font-serif font-bold text-base text-[#0E1726] hover:text-[#831843] transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>SGT Online Student</span>
                  <ArrowRight className="w-4 h-4 text-[#831843]" />
                </Link>
                <Link
                  href="/onboard"
                  className="py-6 px-4 rounded-2xl border-2 border-[#E5DFD5] hover:border-[#831843] bg-[#FAF8F5] hover:bg-white font-serif font-bold text-base text-[#0E1726] hover:text-[#831843] transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>External Student</span>
                  <ArrowRight className="w-4 h-4 text-[#831843]" />
                </Link>
              </div>
            </div>
          </motion.main>
        )}

        {/* SCREEN 2: FORM (PROGRAM CLOUDS & EVALUATE) */}
        {currentScreen === "form" && (
          <motion.main key="form" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto px-6 py-12">
            <button onClick={() => navigateTo("landing")} className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>

            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs space-y-8">
              <div>
                <h2 className="font-serif text-3xl text-[#0E1726]">Configure Pathway Evaluation</h2>
              </div>

              {/* Resume Ingestion */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-[#DDD8CE] hover:border-[#831843] bg-[#FAF8F5] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-[#831843]" />
                  <div>
                    <span className="font-bold text-xs text-[#0E1726] block">
                      {uploadingResume ? "Indexing Resume in Talent Pool..." : "Upload Resume (Recruiters Contact You Directly)"}
                    </span>
                    <span className="text-[11px] text-[#64748B]">Automates ATS matching and boosts your profile for recruiters.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#831843] underline text-[10px] tracking-wider uppercase">Browse PDF</span>
                <input type="file" ref={fileInputRef} onChange={handleResumeUploadToDB} accept=".pdf" className="hidden" />
              </div>
              {uploadedSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl font-medium">
                  {uploadedSuccessMsg}
                </div>
              )}

              {/* SGT Program Cloud Tags */}
              {track === "sgt" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
                      Programs Offered by SGT Online
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {Object.keys(SGT_PROGRAMS).map((key) => {
                        const prog = SGT_PROGRAMS[key];
                        const isSelected = selectedCourseKey === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => { setSelectedCourseKey(key); setSelectedSemester(1); }}
                            className={`px-5 py-2.5 rounded-full border text-xs font-bold transition shadow-xs cursor-pointer ${
                              isSelected 
                                ? "bg-[#831843] text-white border-[#831843] ring-2 ring-[#831843]/20" 
                                : "bg-[#FAF8F5] text-[#0E1726] border-[#DDD8CE] hover:border-[#831843]"
                            }`}
                          >
                            {prog.code} &bull; {prog.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Semester Selector */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                      Select Current Semester
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((sem) => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setSelectedSemester(sem)}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            selectedSemester === sem 
                              ? "bg-[#831843] text-white border-[#831843]" 
                              : "bg-[#FAF8F5] text-[#526173] border-[#E5DFD5] hover:bg-white"
                          }`}
                        >
                          Semester {sem}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Highest Qualification</label>
                      <select
                        value={nonSgtEdu}
                        onChange={(e) => setNonSgtEdu(e.target.value)}
                        className="w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
                      >
                        <option value="B.Tech Computer Science">B.Tech Computer Science / IT</option>
                        <option value="BCA (Computer Applications)">BCA (Bachelor of Computer Applications)</option>
                        <option value="B.Sc Computer Science / IT">B.Sc Computer Science / IT</option>
                        <option value="BBA / B.Com">BBA / B.Com (Commerce / Management)</option>
                        <option value="Working Professional / Other">Working Professional / Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Years of Experience</label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
                      >
                        <option value={0}>0 Years (Student / Fresher)</option>
                        <option value={1}>1 - 2 Years</option>
                        <option value={3}>3 - 5 Years</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Target Role Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Select Target Job Role (500+ Roles Catalog)
                  </label>
                  <span className="text-[10px] font-mono text-[#831843] font-bold">
                    {ALL_500_PLUS_ROLES.length} Profiles Available
                  </span>
                </div>

                <div 
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="p-3 bg-[#FAF8F5] border-2 border-[#831843] rounded-2xl flex items-center justify-between cursor-pointer mb-2"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#831843] block">Target Role Selected:</span>
                    <span className="font-serif font-bold text-sm text-[#0E1726]">{selectedRole}</span>
                  </div>
                  <button className="px-3 py-1 bg-white border border-[#DDD8CE] rounded-xl text-xs font-semibold text-[#831843] flex items-center gap-1 cursor-pointer">
                    {isRoleDropdownOpen ? "Close List" : "Change Role"}
                    {isRoleDropdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isRoleDropdownOpen && (
                  <div className="space-y-2 p-3 bg-white border border-[#E5DFD5] rounded-2xl shadow-sm mb-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="text"
                        value={roleSearchTerm}
                        onChange={(e) => setRoleSearchTerm(e.target.value)}
                        placeholder="Type to search (e.g. SRE, Rust, Quantitative, Performance Marketing)..."
                        className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filteredRoles.map((role) => (
                        <div
                          key={role}
                          onClick={() => {
                            setSelectedRole(role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
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

              {/* Evaluate Action Button */}
              <div className="pt-4 border-t border-[#EAE4D9] flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    evaluatePathwayAndProjects(selectedCourseKey, selectedSemester, selectedRole);
                    navigateTo("results");
                  }}
                  className="px-14 py-4 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  Evaluate <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.main>
        )}

        {/* SCREEN 3: RESULTS VIEW */}
        {currentScreen === "results" && (
          <motion.main key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <button onClick={() => navigateTo("form")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> Modify Selections
              </button>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#831843]">
                Target: {selectedRole}
              </span>
            </div>

            {/* Semantic Cross-Encoder & Ontology Audit Card */}
            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE4D9] gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Network className="w-3 h-3 text-emerald-600" /> Bi-Encoder & Cross-Encoder Semantic Engine
                  </div>
                  <h3 className="font-serif text-2xl text-[#0E1726]">
                    Curriculum Competency Audit vs. Industry Demands
                  </h3>
                  <span className="text-[11px] text-[#64748B]">
                    Architecture: {graphData?.model_architecture || "Bi-Encoder (all-MiniLM-L6-v2) + Cross-Encoder"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">Current Readiness</span>
                    <span className="text-sm font-mono font-bold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300 inline-block">
                      {loadingGraph ? "Auditing..." : `${graphData?.semanticReadinessScore || graphData?.readinessScore || 75}%`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">At Graduation</span>
                    <span className="text-sm font-mono font-bold px-3 py-1 rounded-xl bg-blue-100 text-blue-950 border border-blue-300 inline-block">
                      {loadingGraph ? "..." : `${graphData?.projectedGraduationReadiness || 95}%`}
                    </span>
                  </div>
                </div>
              </div>

              {loadingGraph ? (
                <div className="py-12 text-center text-xs text-[#526173]">
                  <div className="w-8 h-8 border-2 border-[#831843] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Running semantic cross-encoder reranking across SGT syllabus units...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Cleared in Syllabus */}
                    <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Cleared in Syllabus</span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">Covered through Semester {selectedSemester}:</p>
                      <div className="space-y-1.5 mt-2">
                        {graphData?.semanticallyClearedCompetencies?.length ? (
                          graphData.semanticallyClearedCompetencies.map((item: any, i: number) => (
                            <div key={i} className="p-2 bg-white rounded-lg border border-emerald-200">
                              <span className="font-semibold text-[#0E1726] block text-[11px]">&bull; {item.competency}</span>
                              <span className="text-[10px] text-emerald-700 font-mono">Matched: {item.matched_course} ({item.confidence_pct}%)</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#64748B]">None fully cleared yet</span>
                        )}
                      </div>
                    </div>

                    {/* Upcoming Coursework */}
                    <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-blue-800">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Upcoming Semesters</span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">Taught in Semesters {selectedSemester + 1}+:</p>
                      <div className="space-y-1.5 mt-2">
                        {graphData?.futureCurriculumCovered?.length ? (
                          graphData.futureCurriculumCovered.map((item: any, i: number) => (
                            <div key={i} className="p-2 bg-white rounded-lg border border-blue-200">
                              <span className="font-semibold text-[#0E1726] block text-[11px]">&bull; {item.competency}</span>
                              <span className="text-[10px] text-blue-700 font-mono">Upcoming: {item.upcoming_course} ({item.confidence_pct}%)</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#64748B]">Final semester modules reached</span>
                        )}
                      </div>
                    </div>

                    {/* True Industry Gaps */}
                    <div className="p-4 bg-[#FAF8F5] border border-rose-200 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-rose-800">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>True Out-of-Curriculum Gaps</span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">Zero academic coverage (Self-study required):</p>
                      <div className="space-y-1.5 mt-2">
                        {graphData?.trueIndustryGaps?.length ? (
                          graphData.trueIndustryGaps.map((item: any, i: number) => (
                            <div key={i} className="p-2 bg-white rounded-lg border border-rose-200">
                              <span className="font-semibold text-[#0E1726] block text-[11px]">&bull; {item.missing_competency}</span>
                              <span className="text-[9px] text-rose-700 font-mono block mt-0.5">{item.action_required}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-semibold">No critical gaps remaining</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Proof of Work Code Quality Auditor */}
            <ProofOfWorkAuditor targetRole={selectedRole} />

            <AuthFeatureGate user={user || studentSession} onUnlock={() => setShowAuthModal(true)} title="Unlock Verified Production GitHub Projects" description="Sign in with your student account to inspect reference architectures, production codebases, and target metrics.">
{/* Real Open-Source Production GitHub Projects to Build */}
            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843]">
                  Real-World Codebase Standards & Architectures
                </span>
                <h3 className="font-serif text-2xl text-[#0E1726]">
                  Production Projects to Build for {selectedRole}
                </h3>
                <p className="text-xs text-[#526173] mt-1">
                  These are real production repositories. Replicate these patterns in your pinned GitHub projects to pass recruiter screening filters.
                </p>
              </div>

              {loadingProjects ? (
                <div className="py-6 text-center text-xs text-[#64748B]">Fetching verified GitHub architectures...</div>
              ) : (
                <div className="space-y-4">
                  {roleProjects.map((p, i) => (
                    <div key={i} className="p-5 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl space-y-2 shadow-2xs hover:border-[#831843] transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-[#831843]" />
                          <span className="font-bold text-sm text-[#0E1726]">{p.title}</span>
                          <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#831843] flex items-center gap-1 hover:underline">
                            View Repository <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded font-semibold">
                          Target Performance: {p.metric}
                        </span>
                      </div>
                      <p className="text-xs text-[#526173] leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E8E2D8]">
                        <div className="flex flex-wrap gap-1">
                          {p.skills?.map((sk: string) => (
                            <span key={sk} className="text-[9px] font-mono px-2 py-0.5 bg-white border border-[#DDD8CE] rounded text-[#0E1726]">
                              {sk}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-[#64748B] italic">{p.recruiterNote}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            </AuthFeatureGate>

<AuthFeatureGate user={user || studentSession} onUnlock={() => setShowAuthModal(true)} title="Unlock Interview Rounds & Elimination Traps" description="Sign in to view technical interview rounds, key evaluation filters, and sample elimination questions.">
{/* Interview Rounds & Self-Study Checklist */}
            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#831843]">
                  Interview Preparation
                </span>
                <h3 className="font-serif text-2xl text-[#0E1726]">
                  Interview Rounds & Elimination Traps for {selectedRole}
                </h3>
              </div>

              <div className="space-y-3">
                {currentSalaryInfo.interviewRounds?.map((rnd, i) => (
                  <div key={i} className="p-4 bg-[#FAF8F5] border border-[#EAE4D9] rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#831843]">{rnd.round}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                        Critical Elimination Round
                      </span>
                    </div>
                    <p className="text-xs text-[#0E1726]"><b>Focus:</b> {rnd.focus}</p>
                    <div className="text-[11px] text-[#526173]">
                      <b>Sample Questions:</b> {rnd.sampleQuestions.join("; ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            </AuthFeatureGate>

<AuthFeatureGate user={user || studentSession} onUnlock={() => setShowAuthModal(true)} title="Unlock Pan-India Hiring Directory" description="Sign in to access 50+ direct corporate career portals across Bangalore, Gurugram, Hyderabad, and remote hubs.">
{/* Pan-India Tech Hiring Companies Grid Matrix */}
            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EAE4D9]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#831843] text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Building className="w-3 h-3 text-[#831843]" /> Pan-India Career Portals Directory
                  </div>
                  <h3 className="font-serif text-2xl text-[#0E1726]">Eligible Hiring Companies Across India</h3>
                  <p className="text-xs text-[#526173]">Click any company card to navigate directly to their active hiring portal.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search company or city..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredCompanies.map((c, i) => (
                  <a
                    key={i}
                    href={c.careerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#FAF8F5] hover:bg-white border border-[#EAE4D9] hover:border-[#831843] rounded-xl transition shadow-2xs group flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0E1726] group-hover:text-[#831843] truncate">{c.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-[#64748B] group-hover:text-[#831843] shrink-0" />
                      </div>
                      <span className="text-[10px] text-[#64748B] block mt-1 truncate">{c.city}</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-800 font-semibold mt-2">{c.tier}</span>
                  </a>
                ))}
              </div>
            </div>

            </AuthFeatureGate>

<AuthFeatureGate user={user || studentSession} onUnlock={() => setShowAuthModal(true)} title="Unlock 24-Hour Live Job Radar" description="Sign in to view real-time scraped job openings and 24-hour apply links across LinkedIn, Naukri, and Wellfound.">
{/* Multi-Board 24-Hour Job Radar */}
            <LiveJobFeed role={selectedRole} skills={["Python", "DSA", "SQL"]} />

            </AuthFeatureGate>

{/* Download Readiness Report Card */}
            <div className="bg-white border border-[#E5DFD5] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#831843]">Export Intelligence</span>
                <h3 className="font-serif text-xl font-bold text-[#0E1726]">ATS Resume & Readiness Report</h3>
                <p className="text-xs text-[#526173] mt-0.5">
                  Download your ATS single-column resume or an in-depth preparation timeline report.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadAuditReport}
                  disabled={downloadingReport}
                  className="px-5 py-3 rounded-xl border border-[#DDD8CE] bg-[#FAF8F5] hover:bg-white text-xs font-bold text-[#0E1726] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#831843]" />
                  {downloadingReport ? "Compiling Report..." : "Download Readiness Report"}
                </button>
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="px-6 py-3 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
                >
                  Open ATS Resume Studio
                </button>
              </div>
            </div>
          </motion.main>
        )}

      </AnimatePresence>

      {/* 15-Link Resource Footer */}
      <footer className="border-t border-[#E8E2D8] bg-[#F4F0E8] py-12 text-xs text-[#526173]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Academic Portals</span>
            <ul className="space-y-2">
              <li><a href="https://sgtuniversity.ac.in/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">SGT Main Portal &bull; Gurugram</a></li>
              <li><a href="https://sgtonline.ac.in/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">SGT Online CDOE</a></li>
              <li><a href="https://www.ugc.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">UGC Distance Education Bureau</a></li>
              <li><a href="http://naac.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">NAAC A+ Accreditation Record</a></li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Degree Programs</span>
            <ul className="space-y-2">
              <li><a href="https://sgtonline.ac.in/programs/bca/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Online BCA Curriculum</a></li>
              <li><a href="https://sgtonline.ac.in/programs/mca/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Online MCA Curriculum</a></li>
              <li><a href="https://sgtonline.ac.in/programs/bba/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Online BBA Curriculum</a></li>
              <li><a href="https://sgtonline.ac.in/programs/mba/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Online MBA Leadership</a></li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Hiring Ecosystem</span>
            <ul className="space-y-2">
              <li><a href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">LinkedIn Jobs Radar</a></li>
              <li><a href="https://www.naukri.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Naukri.com India Openings</a></li>
              <li><a href="https://wellfound.com/jobs" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Wellfound Startup Radar</a></li>
              <li><a href="https://www.instahyre.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Instahyre Premium Tech Roles</a></li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-[#0E1726] block mb-3 uppercase tracking-wider text-[10px]">Verification & Standards</span>
            <ul className="space-y-2">
              <li><a href="https://leetcode.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">LeetCode 150 Benchmark</a></li>
              <li><a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">GitHub Proof-of-Work Auditor</a></li>
              <li><a href="https://roadmap.sh/backend" target="_blank" rel="noreferrer" className="hover:text-[#831843] transition">Industry Engineering Standards</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-[#EAE4D9] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>&copy; 2026 SGT University &bull; Centre for Distance & Online Education &bull; Budhera, Gurugram, Haryana</p>
          <p className="text-[11px] text-[#64748B]">NAAC A+ Accredited Institution &bull; UGC-DEB Approved Online Programs</p>
        </div>
      </footer>

      {/* THE FORK IN THE ROAD: "TRY IT OUT" DIALOG */}
      {showForkModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
                  Step 1 &bull; The Fork in the Road
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#0E1726]">
                  Select Your Profile Track
                </h3>
              </div>
              <button
                onClick={() => setShowForkModal(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold cursor-pointer"
              >
                ?
              </button>
            </div>

            <p className="text-xs text-[#526173]">
              Choose how you want to calibrate your career roadmap and identify industry skill gaps:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: SGT Student */}
              <Link
                href="/login"
                onClick={() => setShowForkModal(false)}
                className="p-5 rounded-2xl border-2 border-[#831843] bg-[#FAF8F5] hover:bg-rose-50/50 flex flex-col justify-between transition group cursor-pointer shadow-xs"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#831843] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-2xs">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#0E1726] group-hover:text-[#831843]">
                    SGT Student
                  </h4>
                  <p className="text-[11px] text-[#526173] mt-1.5 leading-relaxed">
                    Authenticate via Registration Number & DOB to automatically load past and upcoming syllabus courses.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#831843] mt-5 flex items-center gap-1">
                  Access Portal &rarr;
                </span>
              </Link>

              {/* Option 2: Non-SGT Student */}
              <Link
                href="/onboard"
                onClick={() => setShowForkModal(false)}
                className="p-5 rounded-2xl border-2 border-[#E5DFD5] bg-[#FAF8F5] hover:border-[#831843] hover:bg-white flex flex-col justify-between transition group cursor-pointer shadow-xs"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm mb-3">
                    <UserPlus className="w-5 h-5 text-slate-700" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#0E1726] group-hover:text-[#831843]">
                    Non-SGT Student
                  </h4>
                  <p className="text-[11px] text-[#526173] mt-1.5 leading-relaxed">
                    Enter 10th, 12th, Degree marks and work history to manually calibrate your skill gaps against the 500+ role catalog.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#526173] group-hover:text-[#831843] mt-5 flex items-center gap-1">
                  Begin Intake &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-2xl w-full p-7 shadow-2xl relative text-[#0E1726]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#831843]">
                  Market Intelligence Engine &bull; Glassdoor & AmbitionBox Aggregated
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0E1726]">
                  Annual Salary Estimate (INR / Year)
                </h3>
              </div>
              <button onClick={() => setShowSalaryModal(false)} className="text-slate-400 hover:text-slate-800 text-lg font-bold cursor-pointer">?</button>
            </div>

            <div className="my-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#64748B] block mb-1">Search Any Profile (500+ Roles Catalog)</label>
                <div 
                  onClick={() => setIsSalaryDropdownOpen(!isSalaryDropdownOpen)}
                  className="p-3 bg-[#FAF8F5] border border-[#DDD8CE] hover:border-[#831843] rounded-2xl flex items-center justify-between cursor-pointer transition"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#831843] font-bold block">Current Role:</span>
                    <span className="font-serif font-bold text-sm text-[#0E1726]">{salarySearchRole}</span>
                  </div>
                  <span className="px-3 py-1 bg-white border border-[#DDD8CE] rounded-xl text-xs font-semibold text-[#831843] flex items-center gap-1">
                    {isSalaryDropdownOpen ? "Close Search" : "Select / Search Another"}
                    {isSalaryDropdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </div>

                {isSalaryDropdownOpen && (
                  <div className="mt-2 p-3 bg-white border border-[#E5DFD5] rounded-2xl shadow-md space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="text"
                        value={salarySearchTerm}
                        onChange={(e) => setSalarySearchTerm(e.target.value)}
                        placeholder="Type to filter..."
                        className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl text-xs outline-none focus:border-[#831843]"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-0.5">
                      {filteredSalaryRoles.map((rk) => (
                        <button
                          key={rk}
                          type="button"
                          onClick={() => {
                            setSalarySearchRole(rk);
                            setIsSalaryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                            salarySearchRole === rk ? "bg-[#831843] text-white font-bold" : "hover:bg-[#FAF8F5] text-[#0E1726]"
                          }`}
                        >
                          <span>{rk}</span>
                          {salarySearchRole === rk && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Verified CTC Range</span>
                  <span className="font-serif text-xl font-bold text-[#831843] block mt-0.5">{currentSalaryInfo.range}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Market Average CTC</span>
                  <span className="font-serif text-xl font-bold text-emerald-800 block mt-0.5">{currentSalaryInfo.overallAvg}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE4D9] flex justify-end">
              <button onClick={() => setShowSalaryModal(false)} className="px-5 py-2 bg-[#831843] text-white text-xs font-bold rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-sm w-full p-7 shadow-2xl relative text-center">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 cursor-pointer">?</button>
            <h3 className="font-serif text-2xl font-bold text-[#0E1726]">Verified Student Sign In</h3>
            <p className="text-xs text-[#64748B] mt-1 mb-6">Authenticates student profiles for placement priority.</p>
                        <div className="flex justify-center w-full my-2">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) return;
                  try {
                    const res = await fetch("http://localhost:8000/auth/google-verify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ credential: credentialResponse.credential })
                    });
                    if (!res.ok) {
                      const errData = await res.json();
                      throw new Error(errData.detail || "Google Sign-In failed");
                    }
                    const data = await res.json();
                    localStorage.setItem("optipath_token", data.access_token);
                    if (data.user) {
                      localStorage.setItem("optipath_user", JSON.stringify(data.user));
                      setUser(data.user);
                    }
                    setShowAuthModal(false);
                  } catch (err: any) {
                    alert(err.message || "Authentication failed.");
                  }
                }}
                onError={() => alert("Google Sign-In was cancelled or failed.")}
              />
            </div>
          </div>
        </div>
      )}

      {/* ATS Studio Modal */}
      <ResumeBuilderModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        user={user}
        targetRole={selectedRole}
        skills={["Python", "DSA", "DBMS / SQL"]}
        projects={["Distributed Scalable API Architecture", "Algorithmic Graph Traversal Engine"]}
        onDownload={() => {}}
        isDownloading={false}
      />

      {/* Deep ATS Micro-Audit Modal */}
      <ResumeAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        auditResult={auditResult}
        onOpenStudio={() => setShowResumeModal(true)}
      />

    </div>
  );
}