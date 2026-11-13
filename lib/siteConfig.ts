// lib/siteConfig.ts
// Single place for landing-page facts. Edit here, not in the page.
//
// REVIEW BEFORE GOING LIVE:
//  - Program guide URLs follow the owner-confirmed pattern https://sgtonline.in/<program>. The owner
//    corrected the domain from sgtonline.ac.in to sgtonline.in. Only /bba was opened by me; click-test
//    the other four before going live.
//  - Program focus lines come from the project owner's brief, not from the SGT Online website.
//  - FAQ answers are deliberately conservative. Replace with official wording where you have it.

/** Backend base URL. Set NEXT_PUBLIC_API_URL in .env.local / hosting settings; the fallback is for local development only. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Shown in the footer. REVIEW with your university's data-protection owner before going live. */
export const PRIVACY_NOTICE =
  "Details you enter as a non-SGT candidate stay in your browser on this device. SGT student logins are checked against the university record service. Google sign-in shares your name, email and photo with this site. If you choose to upload a resume to the Talent Pool, your resume and contact details are sent to our servers and, only with your consent, shown to verified recruiters.";

/** Talent Pool and recruiter endpoints. All go through API_URL (NEXT_PUBLIC_API_URL). */
export const TALENT_UPLOAD_URL = `${API_URL}/talent/upload`;
export const TALENT_ME_URL = `${API_URL}/talent/me`;
export const RECRUITER_VERIFY_URL = `${API_URL}/recruiter/verify`;
export const TALENT_SEARCH_URL = `${API_URL}/talent/search`;
/** GET {TALENT_RESUME_URL}/{candidateId} returns the resume file for a verified recruiter. */
export const TALENT_RESUME_URL = `${API_URL}/talent/resume`;
/** GET with a placement-staff Google token: anonymous cohort numbers. */
export const PLACEMENT_SUMMARY_URL = `${API_URL}/placement/summary`;

export const SGT_ONLINE_HOME = "https://sgtonline.in/";
export const SGT_ONLINE_APPLY = "https://apply.sgtonline.in/";
export const UGC_URL = "https://www.ugc.gov.in/";

export interface Program {
  key: "mca" | "mba" | "bca" | "bba" | "bcom";
  name: string;
  fullName: string;
  focus: string;
  guideUrl: string;
}

export const PROGRAMS: Program[] = [
  {
    key: "bca",
    name: "Online BCA",
    fullName: "Bachelor of Computer Applications",
    focus: "Software Foundations & Web Engineering",
    guideUrl: "https://sgtonline.in/bca",
  },
  {
    key: "mca",
    name: "Online MCA",
    fullName: "Master of Computer Applications",
    focus: "Advanced Cloud Computing, AI & Full Stack",
    guideUrl: "https://sgtonline.in/mca",
  },
  {
    key: "bba",
    name: "Online BBA",
    fullName: "Bachelor of Business Administration",
    focus: "Business Operations & Digital Strategy",
    guideUrl: "https://sgtonline.in/bba",
  },
  {
    key: "mba",
    name: "Online MBA",
    fullName: "Master of Business Administration",
    focus: "Tech Management, Marketing & Finance",
    guideUrl: "https://sgtonline.in/mba",
  },
  {
    key: "bcom",
    name: "Online B.Com (Hons)",
    fullName: "Bachelor of Commerce (Honours)",
    focus: "Financial Markets & Accounting",
    guideUrl: "https://sgtonline.in/bcom",
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Are SGT Online programmes UGC-DEB approved?",
    a: "SGT Online offers its degrees with UGC-DEB approval. You can check the current approval status on the UGC website, or ask the SGT Online admissions team for the approval details of the specific programme you are considering.",
  },
  {
    q: "Can I study while working?",
    a: "The programmes are delivered online with live faculty interaction and structured projects, so you can study from where you are. Ask the admissions team about class timings and the exam schedule for your programme.",
  },
  {
    q: "Will I get access to placement support?",
    a: "Placement support differs by programme and changes over time. Please confirm what is currently included for your programme with the SGT Online admissions team before you enrol.",
  },
  {
    q: "Is an online degree equivalent to a regular degree?",
    a: "UGC regulations allow degrees from approved online programmes to be recognised. If you plan to use the degree for a government job or for higher studies abroad, confirm acceptance with the relevant employer or institution first.",
  },
  {
    q: "What are the eligibility requirements?",
    a: "Eligibility is different for each programme (for example, an undergraduate programme and a postgraduate programme ask for different prior qualifications). Open the programme guide for the exact criteria, or apply directly on sgtonline.in.",
  },
];
