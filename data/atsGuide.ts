// data/atsGuide.ts
// The "how to make your resume ATS-friendly" guide. One entry per check in lib/atsCheck.ts, in the same
// order of importance, so the advice a student reads matches the checklist their resume is scored on.
// This is widely shared practice, not the rules of any particular ATS, and the page says so.

import { CHECK_WEIGHTS } from "@/lib/atsCheck";

export interface GuideSection {
  /** Matches a check id in lib/atsCheck.ts. */
  id: keyof typeof CHECK_WEIGHTS;
  title: string;
  why: string;
  points: string[];
}

const SECTIONS: GuideSection[] = [
  {
    id: "keywords",
    title: "Use the keywords your target role asks for",
    why: "An ATS matches the words in your resume against the role. Missing skill names mean you can be filtered out even if you have the skill.",
    points: [
      "Read two or three real job descriptions for your target role and note the skills that repeat.",
      "List the skills you genuinely have under a clear Skills heading, using the standard names (write JavaScript, not only JS).",
      "Show those skills again inside project and internship bullets, so the keyword comes with proof.",
      "Never add a skill you do not have. Interviewers test it, and a keyword you cannot back up hurts you.",
    ],
  },
  {
    id: "text",
    title: "Make sure the text can be read",
    why: "An ATS can only read real text. A scanned page or a screenshot looks blank to it.",
    points: [
      "Write the resume in Word or Google Docs and export it as a text-based PDF or as a DOCX.",
      "Do not scan a paper copy and do not paste a picture of your resume into a document.",
      "Test it: open your file, press Ctrl+A, copy, and paste into Notepad. If the words appear in a sensible order, an ATS can read it.",
    ],
  },
  {
    id: "sections",
    title: "Use the standard section headings",
    why: "ATS software looks for familiar headings to know where your education, skills and experience are.",
    points: [
      "Use plain titles: Education, Skills, Experience (or Internships), Projects.",
      "Avoid creative headings such as \"My Journey\" or \"What I Bring\".",
      "Put each heading on its own line, with the details under it.",
    ],
  },
  {
    id: "contact",
    title: "Put contact details in plain text",
    why: "Details placed in a page header, footer or an image can be missed, and then no one can reach you.",
    points: [
      "Write your email and phone number as plain text at the top of the page body.",
      "Use a simple, professional email address.",
      "If you add LinkedIn or GitHub, write the link as visible text.",
    ],
  },
  {
    id: "layout",
    title: "Keep the layout simple",
    why: "Tables, text boxes and columns can make an ATS read your lines in the wrong order.",
    points: [
      "Use a single column, from top to bottom.",
      "Avoid tables, text boxes, icons, charts and skill-rating bars. Many of these are images, which an ATS cannot read.",
      "Use a standard font and simple round bullet points.",
    ],
  },
  {
    id: "results",
    title: "Show results with numbers",
    why: "Numbers show what you actually achieved, and recruiters who read the resume after the ATS look for them.",
    points: [
      "Start each bullet with an action word, for example built, designed, analysed, reduced.",
      "Add a number where one is true, for example \"cut load time by 30%\" or \"built a tool used by 200 users\".",
      "Only use figures you can explain in an interview.",
    ],
  },
  {
    id: "length",
    title: "Keep it to a sensible length",
    why: "Very short resumes give an ATS little to match, and very long ones bury the important points.",
    points: [
      "Aim for one page, two at most, when you have 0 to 3 years of experience.",
      "If it is too short, add projects, tools you used and what you achieved.",
      "If it is too long, cut older or less relevant items.",
    ],
  },
  {
    id: "dates",
    title: "Add dates",
    why: "Dates tell the ATS and the recruiter when and for how long you studied or worked.",
    points: [
      "Add years to education, internships and projects, for example 2023 - 2026.",
      "Use the same date format everywhere.",
    ],
  },
];

/** Most important first, using the same weights the checklist score uses. */
export const ATS_GUIDE: GuideSection[] = [...SECTIONS].sort((a, b) => CHECK_WEIGHTS[b.id] - CHECK_WEIGHTS[a.id]);

export const ATS_GUIDE_NOTE =
  "This is our own checklist, based on widely shared advice on how applicant-tracking software reads resumes. It is not the score of any real ATS, and following it does not guarantee a shortlist.";
