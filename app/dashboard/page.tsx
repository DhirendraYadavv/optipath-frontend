"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, Hourglass, Info, ListChecks, LogOut, Target } from "lucide-react";
import RoleSearch from "@/components/RoleSearch";
import CareerActions from "@/components/CareerActions";
import { analyzeAcademicGap, goalSkillsInCourse, AcademicStatus } from "@/lib/skillMatch";
import { StoredStudent, buildAcademicView } from "@/lib/sgtStudent";
import { clearStudent, isExternalRecord, saveStudent, useStoredStudent } from "@/lib/studentStore";

const STATUS_STYLE: Record<AcademicStatus, { label: string; chip: string; box: string }> = {
  completed: { label: "Completed", chip: "bg-emerald-100 text-emerald-900", box: "bg-emerald-50/70 border-emerald-200" },
  in_progress: { label: "This semester", chip: "bg-amber-100 text-amber-900", box: "bg-amber-50/70 border-amber-200" },
  upcoming: { label: "Upcoming", chip: "bg-sky-100 text-sky-900", box: "bg-sky-50/70 border-sky-200" },
  self_learn: { label: "Learn on your own", chip: "bg-rose-100 text-rose-900", box: "bg-rose-50/70 border-rose-200" },
};

function CourseRow({ course, role, tone }: { course: string; role: string; tone: string }) {
  const tags = goalSkillsInCourse(role, course);
  return (
    <div className={`p-2.5 border rounded-xl text-xs ${tone}`}>
      <span className="font-medium text-[#0E1726]">{course}</span>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {tags.map((t) => (
            <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#C8D7E8] text-[#0060AA]">
              Helps: {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { ready, record } = useStoredStudent();
  const external = isExternalRecord(record);
  const student = !external && record ? (record as unknown as StoredStudent) : null;

  useEffect(() => {
    if (!ready) return;
    if (!record) {
      router.replace("/login");
      return;
    }
    if (external) {
      const role = String(record.targetRole || record.goal || "");
      router.replace(role ? `/gap-analysis?role=${encodeURIComponent(role)}` : "/onboard");
    }
  }, [ready, record, external, router]);

  const view = useMemo(() => (student ? buildAcademicView(student) : null), [student]);

  const analysis = useMemo(() => {
    if (!student || !view || !student.goal) return null;
    return analyzeAcademicGap(student.goal, {
      completed: view.completed.courses,
      inProgress: view.inProgress.courses,
      upcoming: view.upcoming,
    });
  }, [student, view]);

  const setGoal = (goal: string) => {
    if (!student) return;
    saveStudent({ ...student, goal });
  };

  const signOut = () => {
    clearStudent();
    router.push("/");
  };

  if (!ready || !student || !view) {
    return <div className="min-h-screen bg-[#F4F8FC] p-12 text-center text-xs text-[#5B6B80]">Loading your dashboard...</div>;
  }

  const selfLearn = analysis?.rows.filter((r) => r.status === "self_learn") ?? [];

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0E1726] font-sans antialiased p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D9E4F0]">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B6B80] hover:text-[#0060AA]">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-1 text-xs text-rose-700 hover:underline font-semibold cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> End session
          </button>
        </div>

        {student.dataSource === "dev-fallback" && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            Local test data: the server was not reachable, so this is a sample student. This never happens in production.
          </div>
        )}

        {/* 1. Profile & goal */}
        <div className="bg-white rounded-3xl border border-[#D5E1EE] p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-mono font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> SGT student record
              </div>
              <h1 className="font-heading text-3xl font-bold">{student.fullName}</h1>
              <p className="text-xs text-[#526173]">
                Registration No: <b className="font-mono text-[#0E1726]">{student.registrationNo}</b> &bull; Program:{" "}
                <b className="text-[#0E1726]">{view.program ? view.program.name : student.program || "Not available"}</b>
              </p>
            </div>
            <div className="text-center p-4 bg-[#F4F8FC] rounded-2xl border border-[#DCE7F2] min-w-[130px]">
              <span className="text-[10px] text-[#5B6B80] uppercase font-bold block">Current semester</span>
              <span className="font-heading text-2xl font-bold text-[#0060AA]">
                {student.currentSemester}
                {view.totalSemesters > 0 && <span className="text-sm text-[#5B6B80]"> / {view.totalSemesters}</span>}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#DCE7F2]">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0060AA] flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Your goal
            </label>
            <RoleSearch value={student.goal} onChange={setGoal} suggested={view.program?.careerRoles ?? []} />
          </div>

          {analysis && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F4F8FC] rounded-2xl border border-[#DCE7F2]">
                <span className="text-[10px] text-[#5B6B80] uppercase font-bold block">Covered by completed courses</span>
                <span className="font-heading text-3xl font-bold text-emerald-800">{analysis.readyNowPercent}%</span>
                <span className="text-[11px] text-[#526173] block mt-0.5">{analysis.counts.completed} of {analysis.total} skills this goal needs</span>
              </div>
              <div className="p-4 bg-[#F4F8FC] rounded-2xl border border-[#DCE7F2]">
                <span className="text-[10px] text-[#5B6B80] uppercase font-bold block">After your mapped syllabus</span>
                <span className="font-heading text-3xl font-bold text-[#0060AA]">{analysis.afterSyllabusPercent}%</span>
                <span className="text-[11px] text-[#526173] block mt-0.5">
                  includes this semester and upcoming semesters we have the syllabus for
                </span>
              </div>
            </div>
          )}
        </div>

        {!view.program && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            The program &ldquo;{student.program || "unknown"}&rdquo; is not in the syllabus catalogue yet, so we cannot map your courses to your goal.
          </div>
        )}

        {analysis && (
          <>
            {/* 2. Important topics */}
            <div className="bg-white rounded-3xl border border-[#D5E1EE] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-[#0060AA]" />
                  <h3 className="font-heading font-bold text-base">Topics that matter for this goal</h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#F4F8FC] border border-[#C8D7E8] text-[#526173]">
                  {analysis.familyLabel}
                </span>
              </div>
              <p className="text-xs text-[#526173]">
                Each topic is checked against your course titles. {analysis.confidence === "medium" && "This goal is matched to the closest standard role template. "}
                {analysis.confidence === "low" && "There is no dedicated template for this occupation, so general fundamentals are used. "}
                Matching is by keywords in course titles, so a course can teach more than its title says.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.rows.map((r) => {
                  const st = STATUS_STYLE[r.status];
                  return (
                    <div key={r.skill.id} className={`p-3.5 border rounded-2xl space-y-1 ${st.box}`}>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#0E1726]">{r.skill.label}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${st.chip}`}>
                          {r.status === "upcoming" && r.semester ? `Sem ${r.semester}` : st.label}
                        </span>
                      </div>
                      {r.viaCourse && <p className="text-[11px] text-[#526173]">Through: {r.viaCourse}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 3. Completed */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <h3 className="font-heading font-bold text-base text-emerald-950">Completed ({view.completed.courses.length})</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
              {view.completed.source === "backend" ? "Verified record" : view.completed.source === "catalog" ? "From syllabus" : "None yet"}
            </span>
          </div>
          {view.completed.note && <p className="text-xs text-[#526173]">{view.completed.note}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {view.completed.courses.map((c, i) => (
              <CourseRow key={`${c}-${i}`} course={c} role={student.goal} tone="bg-emerald-50/70 border-emerald-100" />
            ))}
          </div>
        </div>

        {/* 4. In progress */}
        <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="font-heading font-bold text-base text-amber-950">In progress &bull; Semester {student.currentSemester}</h3>
            </div>
          </div>
          {view.inProgress.loaded ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {view.inProgress.courses.map((c, i) => (
                <CourseRow key={`${c}-${i}`} course={c} role={student.goal} tone="bg-amber-50/80 border-amber-200" />
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#526173]">Syllabus for Semester {student.currentSemester} not yet loaded.</p>
          )}
        </div>

        {/* 5. Coming up */}
        <div className="bg-white rounded-3xl border border-sky-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-sky-100">
            <Hourglass className="w-4 h-4 text-sky-700" />
            <h3 className="font-heading font-bold text-base text-sky-950">Coming up in later semesters</h3>
          </div>
          {view.upcoming.map((g) => (
            <div key={g.semester} className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-sky-900 uppercase block">Semester {g.semester}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {g.courses.map((c, i) => (
                  <CourseRow key={`${c}-${i}`} course={c} role={student.goal} tone="bg-sky-50/70 border-sky-200" />
                ))}
              </div>
            </div>
          ))}
          {view.unmappedSemesters.length > 0 && (
            <p className="text-xs text-[#526173] bg-[#F4F8FC] border border-[#DCE7F2] rounded-xl p-3">
              Syllabus for Semester{view.unmappedSemesters.length > 1 ? "s" : ""} {view.unmappedSemesters.join(", ")} not yet loaded.
              Topics from those semesters are not counted above, so some items listed under &ldquo;learn on your own&rdquo; may be covered later in your degree.
            </p>
          )}
          {view.upcoming.length === 0 && view.unmappedSemesters.length === 0 && (
            <p className="text-xs text-emerald-800 font-semibold">You are in the final semester of the mapped syllabus.</p>
          )}
        </div>

        {/* 6. Self-learning */}
        {analysis && (
          <div className="bg-white rounded-3xl border-2 border-rose-300 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <h3 className="font-heading font-bold text-base text-rose-950">Learn on your own ({selfLearn.length})</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-rose-100 text-rose-900 uppercase">Action needed</span>
            </div>
            {selfLearn.length === 0 ? (
              <p className="text-xs text-emerald-800 font-semibold">Every topic for this goal appears in your mapped syllabus.</p>
            ) : (
              <>
                <p className="text-xs text-[#526173]">No course in your mapped syllabus covers these topics. Plan to learn them yourself:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selfLearn.map((r) => (
                    <div key={r.skill.id} className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
                      <span className="text-xs font-bold text-rose-950 block">&#10005; {r.skill.label}</span>
                      <p className="text-[11px] text-rose-900 leading-relaxed">{r.skill.reason}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 7. Locked actions */}
        {student.goal && <CareerActions role={student.goal} />}
      </div>
    </div>
  );
}
