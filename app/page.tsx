'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const API_BASE = "https://optipath-mbw7.onrender.com";

export default function OptiPathDashboard() {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'drift'>('A');
  const [targetRole, setTargetRole] = useState('AI & Data Scientist');
  const [rollNo, setRollNo] = useState('SGT10023');
  const [completedCourses, setCompletedCourses] = useState('Code-OL130102');
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Metrics
  const [readiness, setReadiness] = useState(0);
  const [projectedLpa, setProjectedLpa] = useState(4.5);
  const [salaryRange, setSalaryRange] = useState({ baseline: 4.5, post_degree: 12.0 });
  const [timelineStages, setTimelineStages] = useState<any[]>([]);
  const [driftReport, setDriftReport] = useState<any[]>([]);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const buildReactFlowDAG = (role: string, courses: string[], gapData: any) => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    // 1. Course Nodes (Column 1: x = 30)
    if (courses.length > 0) {
      courses.forEach((code, idx) => {
        flowNodes.push({
          id: `course-${idx}`,
          position: { x: 30, y: 60 + idx * 80 },
          data: { label: code },
          style: {
            background: '#0f172a',
            color: '#38bdf8',
            border: '1px solid #0284c7',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            padding: '10px',
            width: 140,
          },
        });
      });
    }

    // 2. Job Role Node (Column 3: x = 520)
    flowNodes.push({
      id: 'target-role',
      position: { x: 520, y: 120 },
      data: { label: role },
      style: {
        background: '#312e81',
        color: '#ffffff',
        border: '2px solid #6366f1',
        borderRadius: '10px',
        fontWeight: 'bold',
        fontSize: '12px',
        padding: '12px',
        width: 150,
        textAlign: 'center',
      },
    });

    // 3. Skills (Column 2: x = 240)
    const allSkills = [
      ...(gapData.verified_skills || []).map((s: any) => ({ ...s, status: 'verified' })),
      ...(gapData.partial_skills || []).map((s: any) => ({ ...s, status: 'partial' })),
      ...(gapData.skill_gaps || []).map((s: any) => ({ ...s, status: 'gap' })),
    ];

    let yOffset = 30;
    allSkills.forEach((s: any, idx: number) => {
      const sId = `skill-${idx}`;
      let bg = '#450a0a';
      let border = '#ef4444';
      let text = '#fca5a5';

      if (s.status === 'verified') {
        bg = '#022c22';
        border = '#10b981';
        text = '#6ee7b7';
      } else if (s.status === 'partial') {
        bg = '#451a03';
        border = '#f59e0b';
        text = '#fcd34d';
      }

      flowNodes.push({
        id: sId,
        position: { x: 240, y: yOffset },
        data: { label: `${s.skill}\n(${Math.round((s.confidence || 0) * 100)}%)` },
        style: {
          background: bg,
          color: text,
          border: `1.5px solid ${border}`,
          borderRadius: '8px',
          fontSize: '10px',
          padding: '8px',
          textAlign: 'center',
          width: 150,
          whiteSpace: 'pre-line',
        },
      });

      flowEdges.push({
        id: `edge-${sId}-role`,
        source: sId,
        target: 'target-role',
        animated: s.status === 'verified',
        style: { stroke: border, strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: border },
      });

      if (s.confidence > 0 && courses.length > 0) {
        flowEdges.push({
          id: `edge-course-${sId}`,
          source: 'course-0',
          target: sId,
          style: { stroke: '#0284c7', strokeDasharray: '4,4' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
        });
      }

      yOffset += 70;
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  };

  const fetchAnalysis = useCallback(async (role: string, courses: string[]) => {
    try {
      const [gapRes, timeRes] = await Promise.all([
        fetch(`${API_BASE}/graph/skill-gap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target_role: role, completed_courses: courses }),
        }),
        fetch(`${API_BASE}/graph/timeline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target_role: role, completed_courses: courses }),
        })
      ]);

      const gapData = await gapRes.json();
      const timeData = await timeRes.json();

      setReadiness(gapData.readiness_percentage ?? 0);
      setProjectedLpa(gapData.projected_lpa ?? 4.5);
      setSalaryRange(gapData.salary_range ?? { baseline: 4.5, post_degree: 12.0 });
      setTimelineStages(timeData.timeline_stages ?? []);

      buildReactFlowDAG(role, courses, gapData);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, []);

  const triggerRun = useCallback(() => {
    const list = activeTab === 'B'
      ? (isEnrolled ? ['Code-OL130102', 'Code-OL130202', 'Code-OL130221'] : [])
      : completedCourses.split(',').map((s) => s.trim()).filter(Boolean);
    fetchAnalysis(targetRole, list);
  }, [activeTab, targetRole, completedCourses, isEnrolled, fetchAnalysis]);

  useEffect(() => {
    triggerRun();
  }, [triggerRun]);

  const handleStudentLookup = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/student-lookup/${rollNo}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setCompletedCourses(data.completed_courses.join(', '));
      const list = data.completed_courses;
      fetchAnalysis(targetRole, list);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDriftScan = async () => {
    try {
      const res = await fetch(`${API_BASE}/market/drift?role=${encodeURIComponent(targetRole)}`);
      const data = await res.json();
      setDriftReport(data.emerging_skills || []);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPdf = async () => {
    const courses = completedCourses.split(',').map((s) => s.trim()).filter(Boolean);
    const res = await fetch(`${API_BASE}/resume/export-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_role: targetRole, completed_courses: courses }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SGT_Verified_Profile_${targetRole.replace(/\s+/g, '_')}.pdf`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              OptiPath
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Next.js + React Flow + Neo4j Aura &bull; SGT CDOE Career Engine
            </p>
          </div>
          <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('A')}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'A' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Flow A: Enrolled Student
            </button>
            <button
              onClick={() => setActiveTab('B')}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'B' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Flow B: Prospective Pivot
            </button>
            <button
              onClick={() => { setActiveTab('drift'); handleDriftScan(); }}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'drift' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Market Drift (Mechanic #3)
            </button>
          </div>
        </header>

        {/* Tab Controls */}
        {activeTab === 'A' && (
          <section className="bg-slate-900 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
              >
                <option value="AI & Data Scientist">AI & Data Scientist</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="Cloud Architect">Cloud Architect</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Synthetic ERP Lookup</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm uppercase text-slate-100"
                />
                <button
                  onClick={handleStudentLookup}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200"
                >
                  Lookup
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Completed Courses</label>
              <input
                type="text"
                value={completedCourses}
                onChange={(e) => setCompletedCourses(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <button
                onClick={triggerRun}
                className="w-full bg-sky-600 hover:bg-sky-500 py-2.5 rounded-lg text-xs font-semibold text-white transition"
              >
                Run Skill-Gap Analysis
              </button>
            </div>
          </section>
        )}

        {activeTab === 'B' && (
          <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Prospective Pivot</span>
              <h3 className="text-lg font-bold text-white">Degree Value & Employability Projection</h3>
              <p className="text-xs text-slate-400">Toggle SGT CDOE enrollment to resolve foundational market deficits.</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
              <label htmlFor="pivotCheck" className="text-xs font-medium cursor-pointer">Enroll in SGT Online MCA</label>
              <input
                id="pivotCheck"
                type="checkbox"
                checked={isEnrolled}
                onChange={(e) => setIsEnrolled(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>
          </section>
        )}

        {/* Salary Slider (Flow B) */}
        {activeTab === 'B' && (
          <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Projected Compensation</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">₹ {projectedLpa} LPA</div>
              <p className="text-xs text-slate-400 mt-0.5">Calculated from verified curriculum confidence against industry standard.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Baseline: ₹{salaryRange.baseline}L</span>
                <span>Degree Target: ₹{salaryRange.post_degree}L</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${readiness}%` }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Novel Mechanic #3: Market Drift Section */}
        {activeTab === 'drift' && (
          <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Curriculum Advisory Engine</span>
              <h3 className="text-lg font-bold text-white">Market Drift Detector (2023 vs 2026 Snapshot Diff)</h3>
              <p className="text-xs text-slate-400">Flags newly demanded technical competencies that SGT's syllabus committee must adopt.</p>
            </div>
            <div className="space-y-2">
              {driftReport.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-amber-300 text-xs">{s.skill}</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                    s.curriculum_status.includes('Covered')
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {s.curriculum_status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Primary Visual: React Flow Canvas */}
        {activeTab !== 'drift' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  React Flow DAG &bull; Left-to-Right Progression
                </h2>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Partial</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Gap</span>
                </div>
              </div>
              
              <div className="h-[440px] w-full rounded-xl overflow-hidden bg-[#060b18] border border-slate-800/80">
                <ReactFlow 
                  nodes={nodes} 
                  edges={edges} 
                  onNodesChange={onNodesChange} 
                  onEdgesChange={onEdgesChange}
                  defaultViewport={{ x: 20, y: 30, zoom: 0.85 }}
                >
                  <Background color="#1e293b" gap={16} />
                  <Controls />
                </ReactFlow>
              </div>

              <div className="pt-2">
                <button
                  onClick={downloadPdf}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-lg"
                >
                  Download ATS-Verified Competency PDF
                </button>
              </div>
            </div>

            {/* Readout Sidebar */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Curriculum Market Readiness</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-sky-400">{readiness}%</span>
                  <span className="text-xs text-slate-400">weighted confidence</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Timeline-to-Close</span>
                <div className="space-y-2 text-xs text-slate-300 max-h-64 overflow-y-auto">
                  {timelineStages.length === 0 ? (
                    <p className="text-emerald-400 font-medium">All prerequisite competencies resolved!</p>
                  ) : (
                    timelineStages.map((stage, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                        <div className="font-bold text-sky-400 mb-1">Closes in Semester {stage.semester}</div>
                        {stage.resolutions.map((r: any, rIdx: number) => (
                          <div key={rIdx} className="text-slate-300 ml-1 mb-1">
                            &bull; <strong className="text-white">{r.skill}</strong> via <span className="text-slate-400">{r.course}</span>
                            <span className="text-emerald-400 font-mono text-[10px] ml-1">(+{Math.round(r.projected_confidence * 100)}%)</span>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}