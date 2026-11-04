// lib/siteConfig.ts
// Single place for landing-page facts. Edit here, not in the page.
//
// REVIEW BEFORE GOING LIVE:
//  - Program guide URLs were taken from the existing footer in app/page.tsx. The B.Com URL was not
//    in the project, so it points to the SGT Online home page until you provide the real one.
//  - Program focus lines come from the project owner's brief, not from the SGT Online website.
//  - FAQ answers are deliberately conservative. Replace with official wording where you have it.

export const SGT_ONLINE_HOME = "https://sgtonline.ac.in/";
export const SGT_ONLINE_APPLY = "https://sgtonline.ac.in/apply/";
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
    guideUrl: "https://sgtonline.ac.in/programs/bca/",
  },
  {
    key: "mca",
    name: "Online MCA",
    fullName: "Master of Computer Applications",
    focus: "Advanced Cloud Computing, AI & Full Stack",
    guideUrl: "https://sgtonline.ac.in/programs/mca/",
  },
  {
    key: "bba",
    name: "Online BBA",
    fullName: "Bachelor of Business Administration",
    focus: "Business Operations & Digital Strategy",
    guideUrl: "https://sgtonline.ac.in/programs/bba/",
  },
  {
    key: "mba",
    name: "Online MBA",
    fullName: "Master of Business Administration",
    focus: "Tech Management, Marketing & Finance",
    guideUrl: "https://sgtonline.ac.in/programs/mba/",
  },
  {
    key: "bcom",
    name: "Online B.Com (Hons)",
    fullName: "Bachelor of Commerce (Honours)",
    focus: "Financial Markets & Accounting",
    guideUrl: SGT_ONLINE_HOME, // TODO: replace with the real B.Com program-guide URL
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
    a: "Eligibility is different for each programme (for example, an undergraduate programme and a postgraduate programme ask for different prior qualifications). Open the programme guide for the exact criteria, or apply directly on sgtonline.ac.in.",
  },
];
