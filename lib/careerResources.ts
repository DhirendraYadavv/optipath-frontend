// lib/careerResources.ts
// Employer career pages, project ideas and the 24-hour LinkedIn search link, grouped by role family.
//
// REVIEW BEFORE GOING LIVE
//  - Employer lists: the six tech employers were already in the project; the others were supplied by
//    the project owner (see the note above the lists). The occupation catalogue's "general" family has none.
//  - Project ideas are suggestions drafted for this site. They contain no performance claims; metrics
//    are phrased as things the student should measure and report, not as facts.

import { RoleFamily } from "@/lib/skillMatch";

export interface Employer {
  name: string;
  type: string;
  url: string;
}

const TECH_EMPLOYERS: Employer[] = [
  { name: "Google", type: "Global tech", url: "https://www.google.com/about/careers/applications/jobs/results" },
  { name: "Microsoft", type: "Global tech", url: "https://careers.microsoft.com" },
  { name: "Amazon", type: "Global tech", url: "https://amazon.jobs" },
  { name: "Zomato", type: "Consumer internet", url: "https://www.zomato.com/careers" },
  { name: "Razorpay", type: "FinTech", url: "https://razorpay.com/jobs" },
  { name: "PhonePe", type: "FinTech", url: "https://www.phonepe.com/careers" },
];

const TECH_FAMILIES: RoleFamily[] = [
  "sde", "backend", "frontend", "fullstack", "devops", "data_ai", "data_eng", "security", "blockchain", "mobile", "qa", "generic",
];

// Non-tech employers. Links were supplied and confirmed by the project owner. Earlier web searches
// independently matched: hdfc.bank.in/careers, careers.ey.com, careers.unilever.com/india,
// careers.nykaa.com, infosys.com/careers, careers.wipro.com, amazon.jobs.
// Click-test the rest before going live.
const FINANCE_EMPLOYERS: Employer[] = [
  { name: "HDFC Bank", type: "Banking", url: "https://hdfc.bank.in/careers" },
  { name: "ICICI Bank", type: "Banking", url: "https://www.icicicareers.com/" },
  { name: "EY India", type: "Professional services", url: "https://careers.ey.com/" },
  { name: "Deloitte India", type: "Professional services", url: "https://jobs2.deloitte.com/in/en" },
  { name: "KPMG India", type: "Professional services", url: "https://kpmg.com/in/en/home/careers.html" },
];

const MARKETING_EMPLOYERS: Employer[] = [
  { name: "Hindustan Unilever (HUL)", type: "FMCG", url: "https://careers.unilever.com/india" },
  { name: "ITC Limited", type: "FMCG & diversified", url: "https://www.itcportal.com/careers/" },
  { name: "Nykaa", type: "Beauty & fashion e-commerce", url: "https://careers.nykaa.com/" },
  { name: "Swiggy", type: "Consumer internet", url: "https://careers.swiggy.com/" },
];

const HR_EMPLOYERS: Employer[] = [
  { name: "TCS", type: "IT services", url: "https://www.tcs.com/careers" },
  { name: "Infosys", type: "IT services", url: "https://www.infosys.com/careers/" },
  { name: "Wipro", type: "IT services", url: "https://careers.wipro.com/" },
];

const CONGLOMERATES: Employer[] = [
  { name: "Reliance Industries", type: "Conglomerate", url: "https://www.ril.com/careers" },
  { name: "Tata Group", type: "Conglomerate", url: "https://www.tata.com/careers" },
  { name: "Aditya Birla Group", type: "Conglomerate", url: "https://careers.adityabirla.com/" },
];

const OPERATIONS_EMPLOYERS: Employer[] = [
  { name: "Amazon (operations roles)", type: "E-commerce & logistics", url: "https://amazon.jobs" },
  { name: "Delhivery", type: "Logistics", url: "https://www.delhivery.com/careers/" },
  { name: "Flipkart", type: "E-commerce", url: "https://www.flipkartcareers.com/" },
  ...CONGLOMERATES,
];

const ANALYTICS_EMPLOYERS: Employer[] = [
  { name: "Mu Sigma", type: "Analytics", url: "https://www.mu-sigma.com/careers" },
  { name: "Fractal Analytics", type: "Analytics & AI", url: "https://fractal.ai/careers/" },
  { name: "LatentView Analytics", type: "Analytics", url: "https://www.latentview.com/careers/" },
  { name: "Tiger Analytics", type: "Analytics & AI", url: "https://www.tigeranalytics.com/careers/" },
];

export function employersFor(family: RoleFamily): Employer[] {
  if (TECH_FAMILIES.includes(family)) return TECH_EMPLOYERS;
  switch (family) {
    case "finance": return FINANCE_EMPLOYERS;
    case "marketing": return MARKETING_EMPLOYERS;
    case "hr": return HR_EMPLOYERS;
    case "operations": return OPERATIONS_EMPLOYERS;
    case "bizanalytics": return ANALYTICS_EMPLOYERS;
    case "business": return CONGLOMERATES;
    default: return [];
  }
}

/** LinkedIn job search, India-wide, limited to jobs posted in the last 24 hours (f_TPR=r86400). */
export function linkedInJobsUrl(role: string): string {
  const keywords = role.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim() || role;
  const params = new URLSearchParams({ keywords, location: "India", f_TPR: "r86400" });
  return "https://www.linkedin.com/jobs/search/?" + params.toString();
}

export interface ProjectIdea {
  title: string;
  summary: string;
  skills: string[];
}

const BACKEND_IDEAS: ProjectIdea[] = [
  { title: "URL shortener with analytics", summary: "REST API that creates short links, redirects them and records click counts per link. Add caching for hot links and report your measured response times.", skills: ["API design", "SQL", "Redis", "Docker"] },
  { title: "Rate-limited task queue", summary: "A service that accepts jobs over HTTP, processes them with background workers and limits requests per client. Include retries and a dead-letter list.", skills: ["Message queues", "Concurrency", "Docker"] },
  { title: "Order and payments service", summary: "Create orders, reserve stock and record payments with idempotency keys so repeated requests do not double-charge. Write tests for the failure paths.", skills: ["Transactions", "SQL", "Testing", "API design"] },
];

const FRONTEND_IDEAS: ProjectIdea[] = [
  { title: "Job-application tracker", summary: "A board where users add applications, move them between stages and filter them. Persist data and make it fully keyboard accessible.", skills: ["React", "State management", "Accessibility"] },
  { title: "Dashboard with live charts", summary: "A responsive analytics dashboard fed by a public API, with loading, empty and error states. Report your Lighthouse scores.", skills: ["React", "Data fetching", "Performance"] },
  { title: "Component library with tests", summary: "Build 8 to 10 reusable components with documented usage and automated tests, published as a small package.", skills: ["TypeScript", "Testing", "Design systems"] },
];

const FULLSTACK_IDEAS: ProjectIdea[] = [
  { title: "Multi-user notes app with auth", summary: "Sign-up, login, per-user notes, sharing links and search, with a proper database schema and deployment.", skills: ["Auth", "SQL", "React", "Deployment"] },
  { title: "Booking system", summary: "Users book time slots without double-booking. Handle concurrent requests and show a calendar view.", skills: ["Transactions", "REST API", "React"] },
  { title: "Real-time chat rooms", summary: "Rooms, message history and presence using WebSockets, with rate limiting and message persistence.", skills: ["WebSockets", "Node/Python", "Databases"] },
];

const DEVOPS_IDEAS: ProjectIdea[] = [
  { title: "CI/CD pipeline for a sample app", summary: "Build, test, scan and deploy a containerised app automatically on every push, with a rollback step.", skills: ["CI/CD", "Docker", "Cloud"] },
  { title: "Kubernetes deployment with monitoring", summary: "Deploy a multi-service app on a local or cloud cluster with health checks, autoscaling and Prometheus/Grafana dashboards.", skills: ["Kubernetes", "Observability", "Helm"] },
  { title: "Infrastructure as code stack", summary: "Provision a network, a VM group and a database with Terraform, documented so another person can recreate it.", skills: ["Terraform", "Cloud", "Linux"] },
];

const DATA_AI_IDEAS: ProjectIdea[] = [
  { title: "Prediction model with honest evaluation", summary: "Pick a public dataset, build a baseline and a better model, and report metrics on a held-out set with error analysis.", skills: ["Python", "Machine learning", "Statistics"] },
  { title: "Document question-answering (RAG)", summary: "Index a set of documents, retrieve relevant passages and answer questions with citations. Measure answer quality on a small test set you write.", skills: ["LLMs", "Vector search", "Python"] },
  { title: "Model served as an API", summary: "Wrap a trained model in an API, containerise it and log request latency and prediction drift.", skills: ["MLOps", "Docker", "API design"] },
];

const DATA_ENG_IDEAS: ProjectIdea[] = [
  { title: "Daily ETL pipeline", summary: "Pull data from a public API, clean it, load it into a warehouse table and schedule it with Airflow or cron, with data-quality checks.", skills: ["ETL", "SQL", "Python"] },
  { title: "Streaming events pipeline", summary: "Produce and consume events with a message broker and maintain a running aggregate table.", skills: ["Kafka", "Python", "SQL"] },
  { title: "Analytics dashboard on a star schema", summary: "Design a star schema for a business dataset and build a dashboard answering five real questions.", skills: ["Data modelling", "SQL", "BI tools"] },
];

const SECURITY_IDEAS: ProjectIdea[] = [
  { title: "Vulnerability assessment report", summary: "Scan a deliberately vulnerable app you run locally, document each finding with severity and a fix.", skills: ["OWASP", "Scanning tools", "Reporting"] },
  { title: "Log-based threat detection", summary: "Ingest sample authentication logs, write detection rules for brute force and unusual logins, and report false positives.", skills: ["SIEM", "Python", "Linux"] },
  { title: "Secure login system", summary: "Implement password hashing, rate limiting, MFA and session handling, then attack your own system and document the results.", skills: ["Cryptography", "Web security", "Testing"] },
];

const BLOCKCHAIN_IDEAS: ProjectIdea[] = [
  { title: "Token and vesting contract", summary: "ERC-20 style token with a vesting schedule, fully unit-tested including edge cases.", skills: ["Solidity", "Testing", "Hardhat/Foundry"] },
  { title: "On-chain voting dApp", summary: "A voting contract with a web front end, covering access control and double-vote prevention.", skills: ["Solidity", "Web3", "React"] },
  { title: "Smart-contract audit write-up", summary: "Review an open-source contract, list issues by severity and propose fixes.", skills: ["Security", "Solidity", "Reporting"] },
];

const MOBILE_IDEAS: ProjectIdea[] = [
  { title: "Offline-first task app", summary: "Tasks stored locally and synced when online, with conflict handling.", skills: ["Mobile SDK", "Local storage", "APIs"] },
  { title: "Location-based app", summary: "Use maps and device location to show nearby places from a public API, handling permissions properly.", skills: ["Mobile SDK", "APIs", "Permissions"] },
  { title: "Published beta app", summary: "Ship a small app to a test track, collect feedback from five users and release one update.", skills: ["Release process", "Testing", "UX"] },
];

const QA_IDEAS: ProjectIdea[] = [
  { title: "End-to-end test suite", summary: "Automate the main user journeys of a public web app and run them in CI.", skills: ["Playwright/Cypress", "CI/CD", "Testing"] },
  { title: "API test harness", summary: "Contract and regression tests for a REST API, with test data setup and a readable report.", skills: ["API testing", "Python/JS", "Reporting"] },
  { title: "Test plan and defect report", summary: "Write a test plan for a real app, execute it manually, and log defects with clear steps and severity.", skills: ["Test design", "Bug tracking"] },
];

const MARKETING_IDEAS: ProjectIdea[] = [
  { title: "30-day content plan for a real small business", summary: "Plan, publish and measure social posts for a local business. Report reach and engagement before and after.", skills: ["Content marketing", "Social media", "Analytics"] },
  { title: "SEO audit and fixes", summary: "Audit a small site, fix the top issues and report ranking or traffic changes over several weeks.", skills: ["SEO", "Analytics"] },
  { title: "Consumer survey and report", summary: "Design and run a 20+ response survey on a product category and present segmented findings.", skills: ["Consumer behaviour", "Statistics", "Presentation"] },
];

const FINANCE_IDEAS: ProjectIdea[] = [
  { title: "Company financial statement analysis", summary: "Pick a listed company, compute key ratios over five years and write a one-page assessment.", skills: ["Accounting", "Excel", "Analysis"] },
  { title: "Three-statement model", summary: "Build a linked income statement, balance sheet and cash flow model with a scenario switch.", skills: ["Financial modelling", "Excel"] },
  { title: "Personal tax computation tool", summary: "A spreadsheet that computes income tax under the current rules from entered income and deductions, with a checklist.", skills: ["Taxation", "Excel"] },
];

const HR_IDEAS: ProjectIdea[] = [
  { title: "Hiring process design", summary: "Design a structured interview process for one role, with scorecards and a job description.", skills: ["Recruitment", "Assessment design"] },
  { title: "Attrition analysis", summary: "Analyse a public HR dataset to find the main drivers of attrition and recommend actions.", skills: ["HR analytics", "Excel", "Statistics"] },
  { title: "Onboarding and training plan", summary: "Create a 30-60-90 day onboarding plan with training modules and feedback checkpoints.", skills: ["Training", "Process design"] },
];

const OPS_IDEAS: ProjectIdea[] = [
  { title: "Inventory policy simulation", summary: "Model demand for one product and compare reorder policies on stock-outs and holding cost.", skills: ["Inventory", "Excel", "Analytics"] },
  { title: "Process map and waste analysis", summary: "Map a real process (for example a canteen or a service desk), find waste and propose changes.", skills: ["Lean", "Process improvement"] },
  { title: "Logistics route comparison", summary: "Compare delivery route options for a set of locations on cost and time.", skills: ["Logistics", "Optimisation"] },
];

const BIZ_ANALYTICS_IDEAS: ProjectIdea[] = [
  { title: "Sales dashboard", summary: "Build an interactive dashboard from a public sales dataset answering five defined business questions.", skills: ["Power BI/Tableau", "SQL", "Excel"] },
  { title: "Customer segmentation", summary: "Segment customers by behaviour and describe each segment with a recommended action.", skills: ["Analytics", "Statistics"] },
  { title: "KPI framework for a business", summary: "Define KPIs for a business, document how each is calculated and build the tracking sheet.", skills: ["Business analysis", "Excel"] },
];

const BUSINESS_IDEAS: ProjectIdea[] = [
  { title: "Business plan with unit economics", summary: "Write a plan for a small venture with pricing, costs and a break-even calculation.", skills: ["Entrepreneurship", "Finance basics"] },
  { title: "Competitor and market study", summary: "Compare five competitors on offer, pricing and positioning, and recommend a niche.", skills: ["Market research", "Presentation"] },
  { title: "Sales pipeline playbook", summary: "Design a lead-to-close process with stages, scripts and metrics for a chosen product.", skills: ["Sales", "Communication"] },
];

const IDEAS: Record<RoleFamily, ProjectIdea[]> = {
  sde: BACKEND_IDEAS,
  backend: BACKEND_IDEAS,
  frontend: FRONTEND_IDEAS,
  fullstack: FULLSTACK_IDEAS,
  devops: DEVOPS_IDEAS,
  data_ai: DATA_AI_IDEAS,
  data_eng: DATA_ENG_IDEAS,
  security: SECURITY_IDEAS,
  blockchain: BLOCKCHAIN_IDEAS,
  mobile: MOBILE_IDEAS,
  qa: QA_IDEAS,
  marketing: MARKETING_IDEAS,
  finance: FINANCE_IDEAS,
  hr: HR_IDEAS,
  operations: OPS_IDEAS,
  bizanalytics: BIZ_ANALYTICS_IDEAS,
  business: BUSINESS_IDEAS,
  generic: BACKEND_IDEAS,
};

export function projectIdeasFor(family: RoleFamily): ProjectIdea[] {
  return IDEAS[family] ?? [];
}
