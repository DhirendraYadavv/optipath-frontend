"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, GraduationCap, Briefcase, Target, ArrowRight } from "lucide-react";

const POPULAR_ROLES = [
  "Software Development Engineer 1 (SDE 1)",
  "Backend Developer (Python/FastAPI/Django)",
  "Full Stack Developer (Next.js & Spring Boot)",
  "Frontend Engineer (React / TypeScript)",
  "Cloud & DevOps Engineer (Docker/K8s/AWS)",
  "Data Scientist & AI Engineer",
  "Cybersecurity & SOC Analyst",
  "Blockchain & Smart Contract Developer"
];

export default function NonSgtOnboardingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    marks10: "",
    marks12: "",
    graduationDegree: "",
    graduationMarks: "",
    postGradDegree: "",
    postGradMarks: "",
    employmentStatus: "Fresher",
    experienceYears: "0",
    currentStack: "",
    targetRole: POPULAR_ROLES[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map external academic profile to match OptiPath student format
    const guestStudent = {
      isExternal: true,
      fullName: formData.name || "External Scholar",
      age: formData.age,
      registrationNo: "EXT-" + Math.floor(100000 + Math.random() * 900000),
      program: formData.graduationDegree || "B.Tech / BCA Computer Science",
      semester: formData.employmentStatus === "Fresher" ? "Graduated (Entry Level)" : "Working Professional",
      academicProfile: {
        tenth: formData.marks10,
        twelfth: formData.marks12,
        graduation: `${formData.graduationDegree} (${formData.graduationMarks}%)`,
        postGrad: formData.postGradDegree ? `${formData.postGradDegree} (${formData.postGradMarks}%)` : null
      },
      employment: {
        status: formData.employmentStatus,
        experienceYears: formData.experienceYears,
        currentStack: formData.currentStack
      },
      completedCourses: [
        "Core Programming & OOP",
        "Data Structures & Relational Databases",
        "Operating System Concepts",
        formData.currentStack || "Web Architecture"
      ],
      upcomingCourses: []
    };

    localStorage.setItem("optipath_student", JSON.stringify(guestStudent));
    router.push(`/gap-analysis?role=${encodeURIComponent(formData.targetRole)}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]">
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
          <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">
            Step 2B &bull; Non-SGT Scholar Onboarding
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs">
          <div className="space-y-1 mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#0E1726]">Academic & Career Calibration</h1>
            <p className="text-xs text-[#526173]">
              Calibrate your educational milestones and background against real industry role requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Basic Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <User className="w-4 h-4" /> 1. Personal Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 22"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Academic Milestones */}
            <div className="space-y-4 pt-4 border-t border-[#EAE4D9]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> 2. Academic Milestones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">10th Grade Score (% or CGPA)</label>
                  <input
                    type="text"
                    name="marks10"
                    required
                    value={formData.marks10}
                    onChange={handleChange}
                    placeholder="e.g. 88%"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">12th Grade Score (% or CGPA)</label>
                  <input
                    type="text"
                    name="marks12"
                    required
                    value={formData.marks12}
                    onChange={handleChange}
                    placeholder="e.g. 85%"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">Graduation Degree & Major</label>
                  <input
                    type="text"
                    name="graduationDegree"
                    required
                    value={formData.graduationDegree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science / BCA"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">Graduation Score (% or CGPA)</label>
                  <input
                    type="text"
                    name="graduationMarks"
                    required
                    value={formData.graduationMarks}
                    onChange={handleChange}
                    placeholder="e.g. 8.2 CGPA"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">Post-Graduation (Optional)</label>
                  <input
                    type="text"
                    name="postGradDegree"
                    value={formData.postGradDegree}
                    onChange={handleChange}
                    placeholder="e.g. MCA / M.Tech"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">Post-Grad Score (Optional)</label>
                  <input
                    type="text"
                    name="postGradMarks"
                    value={formData.postGradMarks}
                    onChange={handleChange}
                    placeholder="e.g. 8.5 CGPA"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Professional Standing */}
            <div className="space-y-4 pt-4 border-t border-[#EAE4D9]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> 3. Current Professional Standing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#526173] block mb-1">Status</label>
                  <select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs bg-white focus:outline-none focus:border-[#831843]"
                  >
                    <option value="Fresher">Fresher / Final Year Student</option>
                    <option value="Employed">Currently Working / Employed</option>
                  </select>
                </div>
                {formData.employmentStatus === "Employed" && (
                  <div>
                    <label className="text-xs font-bold text-[#526173] block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      step="0.5"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      placeholder="e.g. 1.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#526173] block mb-1">Primary Tech Stack & Tools Known</label>
                  <input
                    type="text"
                    name="currentStack"
                    value={formData.currentStack}
                    onChange={handleChange}
                    placeholder="e.g. C++, Java, React, Python, MySQL"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Goal Selection */}
            <div className="space-y-4 pt-4 border-t border-[#EAE4D9]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <Target className="w-4 h-4" /> 4. Target Career Role
              </h3>
              <div>
                <label className="text-xs font-bold text-[#526173] block mb-1">Select Desired Role</label>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#831843] bg-[#FAF8F5] text-xs font-bold text-[#0E1726] focus:outline-none"
                >
                  {POPULAR_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Calibrate & Run 3-Tier Gap Analysis <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
