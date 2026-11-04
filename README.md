# OptiPath (SGT Sahayak AI)

A Next.js app that shows a student or candidate how ready they are for a target role, which skills are missing,
and which SGT Online programme could close the gap.

Stack: Next.js 16 (App Router, webpack), React 19, TypeScript, Tailwind CSS 4, `@react-oauth/google`.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run lint
npm test           # unit tests for the matching and recommendation logic
npm run build
```

### Environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client. Add every domain you serve from (including `http://localhost:3000`) as an authorized JavaScript origin in Google Cloud Console. |
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend. Falls back to `http://localhost:8000`, which only works in local development. |

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: header with Google sign-in and Salary Estimator, "Check Yourself" fork, programme cards, FAQ, footer |
| `/login` | SGT student check: registration number, date of birth, goal. Calls the backend. |
| `/dashboard` | SGT student dashboard (profile and goal, topics that matter, completed, in progress, coming up, learn on your own, action buttons) |
| `/onboard` | Non-SGT candidate form |
| `/gap-analysis` | Non-SGT result: readiness percentage, then (after Google sign-in) missing skills, programme recommendation, projects |
| `/live-jobs` | Opens the "last 24 hours" LinkedIn search for the candidate's goal |
| `/analytics`, `/career-paths`, `/recruiter`, `/roadmap` | "Coming soon" placeholders |

## How the logic works

1. **Role family** (`lib/skillMatch.ts`, `detectRoleFamily`): the goal title is matched by keywords to a family such as
   `backend`, `data_ai`, `finance`, `hr`. Titles that match nothing become `generic`, which is scored against general
   software fundamentals and flagged low-confidence.
2. **Required skills** (`REQUIREMENTS` in `lib/skillMatch.ts`): each family lists the skills it needs. The role taxonomy in
   `data/all_roles.json` contains only titles, so these lists are project decisions. Have a domain expert review them.
3. **Skill detection** (`SKILLS` aliases): free text such as "C++, Java, MySQL" or a course title such as "Operating System"
   is matched against skill aliases as whole words. Skills typed by a candidate may imply others (PyTorch implies Python);
   course titles do not imply anything.
4. **External candidates**: `computeSkillMatch(role, skillsText)` gives `Match % = covered / required`. Experience and
   profession are shown but do not change the score.
5. **SGT students**: `lib/sgtStudent.ts` splits coursework into completed (backend list, or the catalogue for earlier
   semesters if the list is empty), in progress (current semester), and upcoming (later mapped semesters). Semesters missing
   from `data/sgtCurriculum.ts` are reported as "not yet loaded", never invented. `analyzeAcademicGap` marks each required
   skill as completed, in progress, upcoming, or learn on your own.
6. **Programme recommendation** (`lib/programRecommend.ts`): by qualification and goal track. 12th pass: BCA (tech),
   B.Com (finance) or BBA (other management). Graduates: MCA (tech) or MBA (management). Postgraduates and unmapped
   occupations get no recommendation. Coverage numbers come from the real syllabus in `data/sgtCurriculum.ts`.

## Content you will edit

| File | What it controls |
| --- | --- |
| `lib/siteConfig.ts` | API URL, programme names, focus lines and guide URLs, FAQ, privacy notice, SGT Online links |
| `lib/skillMatch.ts` | `SKILLS` (aliases), `REQUIREMENTS` (skills per family), `FAMILY_KEYWORDS` (title to family) |
| `lib/careerResources.ts` | Employer career pages per family, project ideas, the LinkedIn 24-hour link builder, city list |
| `lib/salaryEstimatorData.ts` | Salary rows, cities, the Tier-2 factor, typical degree by family |
| `data/sgtCurriculum.ts` | Approved semester-by-semester course lists and career roles per programme |
| `data/all_roles.json` | The 500+ role titles used by the role search |

### Adding a salary row

Open the source page, copy the range it shows, then add an object to `SALARY_ROWS` with the exact page title, the range in
lakh rupees, the experience mix and report count the page states, the page URL, the page's own "updated" date (or `null`),
and today's date. Never type a figure from memory. Run `npm test`: it checks that every row has an https source, a sane range
and a capture date.

## Backend contract (FastAPI)

- `POST /auth/student-login`, body `{ "registrationNo": string, "dob": "YYYY-MM-DD" }`. Success returns
  `{ "status": "success", "access_token": string, "student": { registrationNo, fullName, program, currentSemester, completedCourses[], upcomingCourses[] } }`.
  Failure returns an HTTP error with `{ "detail": string }`.
- `POST /auth/google-verify`, body `{ "credential": string }` (best effort; sign-in still works if it is unreachable).

Student records and dates of birth must stay on the server. Do not put them in this repo.

## Behaviour to know about

- Google sign-in only unlocks interface elements (company links, openings, project ideas, missing-skills section). It is not
  a security boundary: anyone can edit their own browser storage. Do not put sensitive data behind it.
- The SGT login has an offline fallback for the test student `SGT2023BCA1042`. It runs only when `NODE_ENV` is not
  `production` and the server cannot be reached.
- The 24-hour openings button opens a LinkedIn search filtered with `f_TPR=r86400`. Nothing is scraped or cached.
- Salary figures come only from `SALARY_ROWS`. Roles without a row show "No verified data for this role yet". The sources
  publish ranges, not medians, and the captured pages were dated March 2025 or showed no date.

## Tests

`npm test` runs Node's built-in test runner through `tsx` over `tests/*.test.ts`. They cover role-family detection, skill
matching, course analysis, student record handling, programme recommendation, and salary data integrity.

## Before going live

- [ ] Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in the hosting settings; add the live domain in Google Cloud Console.
- [ ] Click-test every external link: five programme guides, employer career pages, footer links.
- [ ] Replace the FAQ and privacy notice in `lib/siteConfig.ts` with official wording.
- [ ] Have a domain expert review `REQUIREMENTS` in `lib/skillMatch.ts` and the project ideas in `lib/careerResources.ts`.
- [ ] Complete `data/sgtCurriculum.ts` (BCA, BBA and B.Com Semesters 5 and 6; B.Com Semesters 3 and 4 look incomplete).
- [ ] Refresh and extend `SALARY_ROWS` from the live source pages.
