// data/goalRoles.ts
// The ONLY goal roles a candidate can select. Each one is a career track unlocked by at least one of the five
// SGT Online degrees (BCA, MCA, BBA, MBA, B.Com). Do not add trade, vocational or unrelated roles here.

export type GoalTrack = "tech" | "management" | "finance";
export type GoalProgram = "bca" | "mca" | "bba" | "mba" | "bcom";

export interface GoalRole {
  title: string;
  track: GoalTrack;
  /** Sub-group shown in the picker, for example "Data and AI". */
  category: string;
  /** SGT Online degrees that open this role. */
  programs: GoalProgram[];
}

export const TRACK_LABELS: Record<GoalTrack, string> = {
  tech: "Technology and Software (BCA / MCA)",
  management: "Management, Operations and Marketing (BBA / MBA)",
  finance: "Finance and Commerce (B.Com / MBA)",
};

export const GOAL_ROLES: GoalRole[] = [
  // Software Development
  { title: "Software Engineer / SDE 1", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  { title: "Backend Developer (Python / Java / Node.js)", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  { title: "Frontend Developer (React / Next.js)", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  { title: "Full Stack Developer", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  { title: "Mobile App Developer (Android / Flutter)", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  { title: "Web Developer", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  { title: "Python Developer", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  { title: "Java Developer", track: "tech", category: "Software Development", programs: ["bca", "mca"] },
  // Data and AI
  { title: "Data Analyst", track: "tech", category: "Data and AI", programs: ["bca", "mca"] },
  { title: "Data Engineer", track: "tech", category: "Data and AI", programs: ["bca", "mca"] },
  { title: "Business Intelligence Analyst", track: "tech", category: "Data and AI", programs: ["bca", "mca"] },
  { title: "Machine Learning Engineer", track: "tech", category: "Data and AI", programs: ["bca", "mca"] },
  { title: "Data Scientist", track: "tech", category: "Data and AI", programs: ["bca", "mca"] },
  { title: "AI Engineer", track: "tech", category: "Data and AI", programs: ["bca", "mca"] },
  // Cloud, Security and QA
  { title: "Cloud / DevOps Engineer", track: "tech", category: "Cloud, Security and QA", programs: ["bca", "mca"] },
  { title: "Cybersecurity / Information Security Analyst", track: "tech", category: "Cloud, Security and QA", programs: ["bca", "mca"] },
  { title: "Database Administrator", track: "tech", category: "Cloud, Security and QA", programs: ["bca", "mca"] },
  { title: "QA Automation Engineer", track: "tech", category: "Cloud, Security and QA", programs: ["bca", "mca"] },
  { title: "Software Tester", track: "tech", category: "Cloud, Security and QA", programs: ["bca", "mca"] },
  // Sales and Marketing
  { title: "Business Development Associate / Manager", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  { title: "Digital Marketing Executive / Specialist", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  { title: "Sales Executive", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  { title: "Marketing Executive", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  { title: "Brand Executive", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  { title: "Content Marketing Executive", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  { title: "SEO Specialist", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  { title: "Social Media Executive", track: "management", category: "Sales and Marketing", programs: ["bba", "mba"] },
  // HR and Operations
  { title: "Human Resources (HR) Generalist / Talent Acquisition", track: "management", category: "HR and Operations", programs: ["bba", "mba"] },
  { title: "HR Executive", track: "management", category: "HR and Operations", programs: ["bba", "mba"] },
  { title: "Recruiter", track: "management", category: "HR and Operations", programs: ["bba", "mba"] },
  { title: "Operations & Supply Chain Executive", track: "management", category: "HR and Operations", programs: ["bba", "mba"] },
  { title: "Logistics Executive", track: "management", category: "HR and Operations", programs: ["bba", "mba"] },
  { title: "Procurement Executive", track: "management", category: "HR and Operations", programs: ["bba", "mba"] },
  { title: "Operations Analyst", track: "management", category: "HR and Operations", programs: ["bba", "mba"] },
  // Strategy and Product
  { title: "Product Management Associate", track: "management", category: "Strategy and Product", programs: ["bba", "mba"] },
  { title: "Management Trainee (General Management)", track: "management", category: "Strategy and Product", programs: ["bba", "mba"] },
  { title: "Business Analyst", track: "management", category: "Strategy and Product", programs: ["bba", "mba"] },
  { title: "Retail Operations Executive", track: "management", category: "Strategy and Product", programs: ["bba", "mba"] },
  // Finance and Accounts
  { title: "Financial Analyst", track: "finance", category: "Finance and Accounts", programs: ["bcom", "mba"] },
  { title: "Accounting & Tax Associate", track: "finance", category: "Finance and Accounts", programs: ["bcom", "mba"] },
  { title: "Accounts & Finance Executive", track: "finance", category: "Finance and Accounts", programs: ["bcom", "mba"] },
  { title: "Tax Associate (GST / Income Tax)", track: "finance", category: "Finance and Accounts", programs: ["bcom", "mba"] },
  { title: "Banking Associate", track: "finance", category: "Finance and Accounts", programs: ["bcom", "mba"] },
  { title: "Credit Analyst", track: "finance", category: "Finance and Accounts", programs: ["bcom", "mba"] },
  // Risk, Audit and Investment
  { title: "Risk & Compliance Analyst", track: "finance", category: "Risk, Audit and Investment", programs: ["bcom", "mba"] },
  { title: "Investment Banking / Equity Research Associate", track: "finance", category: "Risk, Audit and Investment", programs: ["bcom", "mba"] },
  { title: "Audit Associate", track: "finance", category: "Risk, Audit and Investment", programs: ["bcom", "mba"] },
  { title: "Insurance Executive", track: "finance", category: "Risk, Audit and Investment", programs: ["bcom", "mba"] },
  { title: "Wealth Management Associate", track: "finance", category: "Risk, Audit and Investment", programs: ["bcom", "mba"] },
];

export const GOAL_ROLE_TITLES: string[] = GOAL_ROLES.map((r) => r.title);

/** Roles open to a given degree. */
export function rolesForProgram(program: GoalProgram): GoalRole[] {
  return GOAL_ROLES.filter((r) => r.programs.includes(program));
}
