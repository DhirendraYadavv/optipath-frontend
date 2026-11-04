"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, Target, User, Wrench } from "lucide-react";
import RoleSearch from "@/components/RoleSearch";
import { QUALIFICATIONS, Qualification } from "@/lib/programRecommend";

const POPULAR_ROLES = [
  "Software Development Engineer 1 (SDE 1)",
  "Backend Developer (Python/FastAPI/Django)",
  "Full Stack Developer (Next.js & Spring Boot)",
  "Frontend Engineer (React / TypeScript)",
  "Cloud & DevOps Engineer (Docker/K8s/AWS)",
  "Data Scientist & AI Engineer",
  "Cybersecurity & SOC Analyst",
  "Blockchain & Smart Contract Developer",
];

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:border-[#831843] bg-white";
const labelCls = "text-xs font-bold text-[#526173] block mb-1";

export default function NonSgtOnboardingPage() {
  const router = useRouter();
  const [existingId, setExistingId] = useState<string>("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    age: "",
    profession: "",
    experienceYears: "0",
    qualification: "" as Qualification | "",
    skills: "",
    targetRole: "",
  });

  // Pre-fill when an external candidate comes back to edit their answers.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("optipath_student");
      if (!saved) return;
      const s = JSON.parse(saved);
      if (!(s?.isExternal || String(s?.registrationNo || "").startsWith("EXT-"))) return;
      setExistingId(s.registrationNo || "");
      setForm({
        name: s.fullName || "",
        age: s.age ? String(s.age) : "",
        profession: s.profession || "",
        experienceYears: s.experienceYears != null ? String(s.experienceYears) : "0",
        qualification: s.qualification || "",
        skills: s.employment?.currentStack || "",
        targetRole: s.targetRole || "",
      });
    } catch {
      // ignore unreadable saved data
    }
  }, []);

  const set = (name: string, value: string) => setForm((f) => ({ ...f, [name]: value }));
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(e.target.name, e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.targetRole) {
      setError("Please choose your goal role.");
      return;
    }
    if (!form.qualification) {
      setError("Please choose your highest qualification.");
      return;
    }
    const age = Number(form.age);
    if (!Number.isFinite(age) || age < 14 || age > 80) {
      setError("Please enter a valid age (14 to 80).");
      return;
    }
    const years = Number(form.experienceYears);
    if (!Number.isFinite(years) || years < 0 || years > 50) {
      setError("Please enter years of experience between 0 and 50.");
      return;
    }

    const registrationNo = existingId || "EXT-" + Math.floor(100000 + Math.random() * 900000);
    const candidate = {
      isExternal: true,
      registrationNo,
      fullName: form.name.trim(),
      age,
      profession: form.profession.trim(),
      experienceYears: years,
      qualification: form.qualification,
      targetRole: form.targetRole,
      employment: {
        status: years > 0 ? "Experienced" : "Fresher",
        experienceYears: years,
        currentStack: form.skills.trim(),
      },
    };

    localStorage.setItem("optipath_student", JSON.stringify(candidate));
    router.push(`/gap-analysis?role=${encodeURIComponent(form.targetRole)}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#831843]">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <span className="text-xs font-mono font-bold text-[#831843] uppercase tracking-wider">Non-SGT candidate</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs">
          <div className="space-y-1 mb-8">
            <h1 className="font-serif text-3xl font-bold">Check how ready you are</h1>
            <p className="text-xs text-[#526173]">Tell us where you are today and where you want to go. It takes about a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* About you */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <User className="w-4 h-4" /> 1. About you
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="name">Full name</label>
                  <input id="name" type="text" name="name" required value={form.name} onChange={onChange} placeholder="e.g. Rahul Sharma" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="age">Age</label>
                  <input id="age" type="number" name="age" required min={14} max={80} value={form.age} onChange={onChange} placeholder="e.g. 22" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Background */}
            <div className="space-y-4 pt-4 border-t border-[#EAE4D9]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> 2. Your background
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="profession">Current profession</label>
                  <input id="profession" type="text" name="profession" required value={form.profession} onChange={onChange} placeholder="e.g. Student, Software tester, Sales executive" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="experienceYears">Years of experience</label>
                  <input id="experienceYears" type="number" step="0.5" min={0} max={50} name="experienceYears" required value={form.experienceYears} onChange={onChange} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="qualification">
                    <GraduationCap className="w-3.5 h-3.5 inline mr-1" />Highest qualification
                  </label>
                  <select id="qualification" name="qualification" required value={form.qualification} onChange={onChange} className={inputCls}>
                    <option value="" disabled>Select your qualification</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4 pt-4 border-t border-[#EAE4D9]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <Wrench className="w-4 h-4" /> 3. Skills and tools you know
              </h3>
              <div>
                <label className={labelCls} htmlFor="skills">List them, separated by commas</label>
                <textarea
                  id="skills"
                  name="skills"
                  rows={3}
                  value={form.skills}
                  onChange={onChange}
                  placeholder="e.g. Python, MySQL, Git, React   |   or   |   Excel, Tally, GST, Digital Marketing"
                  className={inputCls}
                />
                <p className="text-[11px] text-[#64748B] mt-1">Your readiness score is based on these. Leave it empty if you are just starting.</p>
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-4 pt-4 border-t border-[#EAE4D9]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#831843] flex items-center gap-2">
                <Target className="w-4 h-4" /> 4. Your goal
              </h3>
              <RoleSearch value={form.targetRole} onChange={(r) => set("targetRole", r)} suggested={POPULAR_ROLES} />
            </div>

            {error && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3" role="alert">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#831843] hover:bg-[#701237] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Go ahead <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
