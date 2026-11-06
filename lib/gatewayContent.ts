// lib/gatewayContent.ts
// Text and numbers for the home-page Talent & Career Gateway. Counts come from the real data files,
// so the page cannot drift from what the site actually offers.

import { GOAL_ROLES } from "@/data/goalRoles";
import { PROGRAMS } from "@/lib/siteConfig";

export const TRACK_COUNT = GOAL_ROLES.length;
export const PROGRAM_COUNT = PROGRAMS.length;
export const PROGRAM_LABELS = ["BCA", "MCA", "BBA", "MBA", "B.Com"] as const;

export const GATEWAY_HEADING = "Unified Talent & Career Gateway";
export const GATEWAY_SUBTITLE = "Direct verification bridge between enterprise hiring partners and SGT University's degree talent.";

export interface GatewayCard {
  href: string;
  title: string;
  badges: string[];
  points: string[];
  cta: string;
}

export const RECRUITER_CARD: GatewayCard = {
  href: "/recruiter",
  title: "For Enterprise Recruiters & Corporate Partners",
  badges: ["Verified Enterprise Access", `${TRACK_COUNT} Degree Tracks`],
  points: [
    "Sign in with your official company email only. Free email domains such as Gmail and Yahoo are blocked.",
    "Browse uploaded resumes and search them by keyword.",
    "Optionally narrow by career track and rank candidates by skill match.",
    "One-click outreach to opted-in candidates through a mailto: link.",
  ],
  cta: "Enter Recruiter Portal",
};

export const STUDENT_CARD: GatewayCard = {
  href: "/portal/student",
  title: "For SGT Students & Alumni",
  badges: ["Google Sign-in Unlocks ATS Check", "SGT CDOE Syllabi"],
  points: [
    "Upload your resume and details, then join the corporate Talent Pool.",
    `ATS-readiness check with concrete fixes, against ${TRACK_COUNT} career-track roles (Google sign-in required).`,
    "Skill breakdown into Foundation Gaps and Production Gaps.",
    "Course recommendations mapped to your SGT syllabus once your SGT record is checked.",
  ],
  cta: "Audit Resume & Join Talent Pool",
};

export interface GatewayMetric {
  title: string;
  detail: string;
}

export const GATEWAY_METRICS: GatewayMetric[] = [
  { title: `${PROGRAM_COUNT} SGT Online Programs`, detail: PROGRAM_LABELS.join(", ") },
  { title: `${TRACK_COUNT} Curated Career Tracks`, detail: "Entry-level (0-3 yrs) salary estimates on selected roles" },
  { title: "Enterprise Verification Gate", detail: "Company-email check for recruiters" },
  { title: "Syllabus-Mapped Matching", detail: "Gaps matched to real SGT course titles" },
];
