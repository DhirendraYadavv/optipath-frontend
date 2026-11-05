// data/goalRoles.ts
// The ONLY goal roles a candidate can select. Each one is a career track unlocked by at least one of the five
// SGT Online degrees (BCA, MCA, BBA, MBA, B.Com). Do not add trade, vocational or unrelated roles here.

export type GoalTrack = "tech" | "management" | "finance";

export interface GoalRole {
  title: string;
  track: GoalTrack;
  /** SGT Online degrees that open this role. */
  programs: ("bca" | "mca" | "bba" | "mba" | "bcom")[];
}

export const TRACK_LABELS: Record<GoalTrack, string> = {
  tech: "Technology and Software (BCA / MCA)",
  management: "Management, Operations and Marketing (BBA / MBA)",
  finance: "Finance and Commerce (B.Com / MBA)",
};

export const GOAL_ROLES: GoalRole[] = [
  // BCA / MCA
  { title: "Software Engineer / SDE 1", track: "tech", programs: ["bca", "mca"] },
  { title: "Backend Developer (Python / Java / Node.js)", track: "tech", programs: ["bca", "mca"] },
  { title: "Frontend Developer (React / Next.js)", track: "tech", programs: ["bca", "mca"] },
  { title: "Full Stack Developer", track: "tech", programs: ["bca", "mca"] },
  { title: "Data Analyst", track: "tech", programs: ["bca", "mca"] },
  { title: "Cloud / DevOps Engineer", track: "tech", programs: ["bca", "mca"] },
  { title: "Cybersecurity / Information Security Analyst", track: "tech", programs: ["bca", "mca"] },
  { title: "Database Administrator / QA Automation Engineer", track: "tech", programs: ["bca", "mca"] },
  // BBA / MBA
  { title: "Business Development Associate / Manager", track: "management", programs: ["bba", "mba"] },
  { title: "Digital Marketing Executive / Specialist", track: "management", programs: ["bba", "mba"] },
  { title: "Human Resources (HR) Generalist / Talent Acquisition", track: "management", programs: ["bba", "mba"] },
  { title: "Operations & Supply Chain Executive", track: "management", programs: ["bba", "mba"] },
  { title: "Product Management Associate", track: "management", programs: ["bba", "mba"] },
  { title: "Management Trainee (General Management)", track: "management", programs: ["bba", "mba"] },
  // B.Com / MBA
  { title: "Financial Analyst", track: "finance", programs: ["bcom", "mba"] },
  { title: "Accounting & Tax Associate", track: "finance", programs: ["bcom", "mba"] },
  { title: "Risk & Compliance Analyst", track: "finance", programs: ["bcom", "mba"] },
  { title: "Investment Banking / Equity Research Associate", track: "finance", programs: ["bcom", "mba"] },
  { title: "Audit Associate", track: "finance", programs: ["bcom", "mba"] },
];

export const GOAL_ROLE_TITLES: string[] = GOAL_ROLES.map((r) => r.title);
