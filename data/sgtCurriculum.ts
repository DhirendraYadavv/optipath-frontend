export interface CourseData {
  id: string;
  name: string;
  code: string;
  duration: string;
  totalSemesters: number;
  description: string;
  semesters: Record<number, string[]>;
  /** Official CDOE course code by course title (from the program guides). Present only where verified. */
  courseCodes?: Record<string, string>;
  careerRoles: string[];
}

export const SGT_PROGRAMS: Record<string, CourseData> = {
  bca: {
    id: "bca",
    name: "Bachelor of Computer Applications (BCA)",
    code: "BCA",
    duration: "3 Years (6 Semesters)",
    totalSemesters: 6,
    description: "Foundational software development, systems engineering, web architectures, and algorithms.",
    semesters: {
      1: [
        "Introduction to Programming Methodology using C",
        "Web Programming",
        "Introduction to Programming Methodology using C LAB",
        "Web Programming LAB",
        "Artificial Intelligence For Everyone",
        "Management Concepts",
        "Foundational Course: Communicative English",
        "Design Thinking & Innovation",
        "Environmental Science"
      ],
      2: [
        "Computer Networks",
        "Computer Networks LAB",
        "Mathematics",
        "Python Programming",
        "Python Programming LAB",
        "Advanced Course: Communicative English",
        "Basics of Entrepreneurship Skills",
        "Human Values & Ethics",
        "Essentials of Marketing"
      ],
      3: [
        "Object Oriented Programming using C++",
        "Storage Technology Foundation",
        "Object Oriented Programming using C++ LAB",
        "Storage Technology Foundation LAB",
        "Probability and Statistics",
        "Digital & Social Media Marketing",
        "Creative English",
        "Competitive Programming LAB",
        "Internship - I"
      ],
      4: [
        "Data Structure and Algorithms using C",
        "Operating System",
        "Data Structures & Algorithms using C LAB",
        "Operating System LAB",
        "Sustainable Engineering",
        "Campus to Corporate",
        "Corporate Governance & CSR",
        "Supervised Machine Learning",
        "Data Analysis using MS-Excel",
        "PHP and MySQL",
        "Principles of Cyber Security",
        "Virtualization Concepts"
      ],
      5: [
        "Database Management Systems",
        "Computer Organization & Architecture",
        "Database Management Systems LAB",
        "Internet of Things",
        "Internet of Things LAB",
        "Internship - II"
      ],
      6: [
        "Software Engineering",
        "Java Programming",
        "Java Programming LAB",
        "Human Resource Management"
      ]
    },
    courseCodes: {
      "Object Oriented Programming using C++": "OL030301",
      "Storage Technology Foundation": "OL030302",
      "Object Oriented Programming using C++ LAB": "OL030311",
      "Storage Technology Foundation LAB": "OL030312",
      "Probability and Statistics": "OL030341",
      "Digital & Social Media Marketing": "OL010376",
      "Creative English": "OL010371",
      "Competitive Programming LAB": "OL030381",
      "Internship - I": "OL010396",
      "Data Structure and Algorithms using C": "OL030401",
      "Operating System": "OL030402",
      "Data Structures & Algorithms using C LAB": "OL030411",
      "Operating System LAB": "OL030412",
      "Sustainable Engineering": "OL030441",
      "Campus to Corporate": "OL010471",
      "Corporate Governance & CSR": "OL010486",
      "Database Management Systems": "OL030501",
      "Computer Organization & Architecture": "OL030502",
      "Database Management Systems LAB": "OL030511",
      "Internet of Things": "OL030541",
      "Internet of Things LAB": "OL030551",
      "Internship - II": "OL010596",
      "Software Engineering": "OL030601",
      "Java Programming": "OL030602",
      "Java Programming LAB": "OL030612",
      "Human Resource Management": "OL010201"
    },
    careerRoles: [
      "Full Stack Web Developer",
      "Frontend Engineer (React / Next.js)",
      "Backend Systems Engineer (Python / Node.js)",
      "Database Administrator (MySQL / PostgreSQL)",
      "Cybersecurity Analyst",
      "Network & Systems Administrator",
      "Cloud Infrastructure Associate",
      "Data Analyst (Excel / SQL / Python)",
      "QA & Automation Engineer",
      "DevOps Junior Engineer"
    ]
  },
  mca: {
    id: "mca",
    name: "Master of Computer Applications (MCA)",
    code: "MCA",
    duration: "2 Years (4 Semesters)",
    totalSemesters: 4,
    description: "Advanced distributed systems, artificial intelligence, enterprise databases, cloud, and blockchain.",
    semesters: {
      1: [
        "Operating System",
        "Operating System Lab",
        "Python Programming",
        "Python Programming LAB",
        "Advance Database Management System",
        "Advance Database Management System Lab",
        "Fundamentals of Artificial Intelligence And Machine Learning",
        "Fundamentals of Artificial Intelligence And Machine Learning Lab",
        "Mathematical and Statistical Foundations",
        "Professional Communication for Business"
      ],
      2: [
        "Advanced Data Structures",
        "Advanced Data Structures Lab",
        "Cloud Computing",
        "Cloud Computing Lab",
        "Critical Reasoning And Systems Thinking",
        "Data Warehousing And Data Mining",
        "Object Oriented Programming With Java",
        "Object Oriented Programming With Java Lab",
        "Software Engineering And Project Management",
        "Applied AI",
        "Applied AI Lab",
        "Probability and Statistics",
        "Fundamentals of Cyber Security",
        "Fundamentals of Cyber Security Lab",
        "Introduction to Blockchain",
        "Introduction to Blockchain Lab"
      ],
      3: [
        "Full Stack Development",
        "Design and Analysis of Algorithms",
        "Distributive Systems",
        "Generative AI",
        "Fundamentals of Deep Learning",
        "Data Exploration and Preparation",
        "Cryptography and Network Security",
        "Web Development for Blockchain Application"
      ],
      4: [
        "Mobile Application Development",
        "Research Methodology and Academic Writing",
        "Ethical AI and Responsible Computing",
        "Natural Language Processing",
        "Data Visualization",
        "Big Data",
        "Cyber Forensics",
        "Vulnerability Assessment and Penetration Testing (VAPT)",
        "Smart Contract and Solidity Programming",
        "Cyber Security with Blockchain"
      ]
    },
    careerRoles: [
      "AI / Machine Learning Engineer",
      "Generative AI & LLM Specialist",
      "Distributed Systems Architect",
      "Cloud Platform Architect (AWS / Azure)",
      "Blockchain & Smart Contract Developer",
      "Vulnerability Assessment & Penetration Tester (VAPT)",
      "Big Data & Data Pipeline Engineer",
      "Natural Language Processing (NLP) Researcher",
      "Cybersecurity Defense Specialist",
      "Senior Full Stack Architect"
    ]
  },
  bba: {
    id: "bba",
    name: "Bachelor of Business Administration (BBA)",
    code: "BBA",
    duration: "3 Years (6 Semesters)",
    totalSemesters: 6,
    description: "Business operations, market strategy, leadership dynamics, finance, and corporate management.",
    semesters: {
      1: [
        "Management Concepts & Organizational Behaviour",
        "Financial Accounting",
        "Artificial Intelligence For Everyone",
        "Business Environment",
        "Foundational Course: Communicative English",
        "Design Thinking & Innovation",
        "Environmental Science"
      ],
      2: [
        "Advanced Course: Communicative English",
        "Basics of Entrepreneurship Skills",
        "Business Laws",
        "Business Statistics",
        "Human Resource Management",
        "Human Values & Ethics",
        "Principles of Marketing"
      ],
      3: [
        "Business Economics",
        "Cost and Management Accounting",
        "Business Research Methods",
        "Company Laws",
        "Creative English: Exploring Stories, Poems, Personal Narratives",
        "Digital and Social Media Marketing",
        "Internship - I"
      ],
      4: [
        "Financial Management",
        "International Business",
        "Data Analysis Using Excel",
        "Campus to Corporate: Professional Communication and Workplace Skills",
        "Corporate Governance and CSR",
        "Consumer Behavior",
        "Banking, Financial Services and Insurance",
        "Training & Development"
      ],
      5: [
        "Entrepreneurship Development",
        "Operations Management",
        "Business Analytics",
        "Internship - II"
      ],
      6: [
        "Strategic Management",
        "Supply Chain Management",
        "Data Visualization"
      ]
    },
    courseCodes: {
      "Business Economics": "OL010301",
      "Cost and Management Accounting": "OL020302",
      "Business Research Methods": "OL020303",
      "Company Laws": "OL020304",
      "Creative English: Exploring Stories, Poems, Personal Narratives": "OL020305",
      "Digital and Social Media Marketing": "OL020306",
      "Internship - I": "OL010307",
      "Financial Management": "OL020501",
      "International Business": "OL010402",
      "Data Analysis Using Excel": "OL020404",
      "Campus to Corporate: Professional Communication and Workplace Skills": "OL020405",
      "Corporate Governance and CSR": "OL020406",
      "Entrepreneurship Development": "OL010501",
      "Operations Management": "OL010502",
      "Business Analytics": "OL020505",
      "Internship - II": "OL010506",
      "Strategic Management": "OL010601",
      "Supply Chain Management": "OL010602",
      "Data Visualization": "OL020605"
    },
    careerRoles: [
      "Business Development Manager",
      "Digital Marketing Strategist",
      "Financial Analyst Associate",
      "Operations & Logistics Specialist",
      "HR Talent Acquisition Specialist",
      "Client Relationship Manager",
      "Market Research Analyst",
      "Retail & Branch Banking Officer",
      "Startup Founder / Entrepreneur",
      "Corporate Communications Lead"
    ]
  },
  mba: {
    id: "mba",
    name: "Master of Business Administration (MBA)",
    code: "MBA",
    duration: "2 Years (4 Semesters)",
    totalSemesters: 4,
    description: "Advanced executive leadership, international trade, analytics, quantitative finance, and public health.",
    semesters: {
      1: [
        "Managerial Economics",
        "Business Statistics and Research Methods",
        "Accounting for Managers",
        "Management Principles & Organisational Behaviour",
        "Marketing Management",
        "Professional Communication for Business",
        "AI for Business"
      ],
      2: [
        "Business Analytics",
        "Digital and Social Media Marketing",
        "Entrepreneurship Skills",
        "Financial Management",
        "Human Resource Management",
        "Operations and Supply Chain Management"
      ],
      3: [
        "Strategic Management",
        "International Business",
        "Consumer Behavior",
        "Integrated Marketing Communication",
        "Performance Marketing",
        "SEO and Generative Engine Optimization",
        "Talent Acquisition and Management",
        "Competency Based Training and Development",
        "Security Analysis and Portfolio Management",
        "Banking, Financial Services, and Insurance",
        "Business Intelligence",
        "Marketing Analytics",
        "Healthcare Delivery Systems and Public Health Administration",
        "Healthcare Laws, Policies and Ethics",
        "Hospital Planning and Infrastructure Management",
        "Hospital Operations and Services Management"
      ],
      4: [
        "Product and Brand Management",
        "Sales and Distribution Management",
        "Content Marketing and ORM",
        "E-Commerce, Online Business Models and Affiliate Marketing",
        "Organizational Change and Development",
        "Performance and Compensation Management",
        "Financial Analytics and Modelling",
        "Derivatives Market",
        "HR Analytics",
        "Supply Chain and Operations Analytics",
        "Healthcare Laws and Ethics",
        "Quality Care and Accreditation for Healthcare",
        "Corporate Governance, Ethics and ESG",
        "Business Law"
      ]
    },
    careerRoles: [
      "Product & Brand Manager",
      "Management & Strategy Consultant",
      "Investment Banking & Derivatives Analyst",
      "Supply Chain & Logistics Director",
      "People Analytics & HR Business Partner (HRBP)",
      "Performance Marketing & SEO Director",
      "Hospital Operations & Healthcare Administrator",
      "Business Intelligence & Analytics Lead",
      "Financial Portfolio Manager",
      "Corporate ESG & Governance Advisor"
    ]
  },
  bcom: {
    id: "bcom",
    name: "Bachelor of Commerce (B.Com)",
    code: "BCOM",
    duration: "3 Years (6 Semesters)",
    totalSemesters: 6,
    description: "Corporate accounting, financial audit, taxation laws, banking frameworks, and market compliance.",
    semesters: {
      1: [
        "Management Concepts & Organizational Behaviour",
        "Financial Accounting",
        "Artificial Intelligence For Everyone",
        "Business Environment",
        "Foundational Course: Communicative English",
        "Design Thinking & Innovation",
        "Environmental Science"
      ],
      2: [
        "Advanced Course: Communicative English",
        "Basics of Entrepreneurship Skills",
        "Business Laws",
        "Business Statistics",
        "Human Resource Management",
        "Human Values & Ethics",
        "Principles of Marketing"
      ],
      3: [
        "Business Economics",
        "Corporate Accounting",
        "Business Research Methods",
        "Company Laws",
        "Creative English: Exploring Stories, Poems, Personal Narratives",
        "Digital & Social Media Marketing",
        "Internship - I"
      ],
      4: [
        "Cost Accounting",
        "Taxation Laws",
        "Financial Markets & Services",
        "Data Analysis Using Excel",
        "Campus to Corporate: Professional Communication and Workplace Skills",
        "Corporate Governance and CSR"
      ],
      5: [
        "Financial Management",
        "Management Accounting",
        "Security Analysis & Portfolio Management",
        "Goods and Service Tax (GST) & Customs Law",
        "Business Analytics",
        "Internship - II"
      ],
      6: [
        "Financial Analysis and Reporting",
        "Financial Derivatives",
        "Financial Analytics",
        "Auditing",
        "Data Visualization"
      ]
    },
    courseCodes: {
      "Business Economics": "OL010301",
      "Corporate Accounting": "OL020301",
      "Business Research Methods": "OL010341",
      "Company Laws": "OL010361",
      "Creative English: Exploring Stories, Poems, Personal Narratives": "OL010371",
      "Digital & Social Media Marketing": "OL010376",
      "Internship - I": "OL010396",
      "Cost Accounting": "OL020401",
      "Taxation Laws": "OL020402",
      "Financial Markets & Services": "OL010523",
      "Data Analysis Using Excel": "OL010451",
      "Campus to Corporate: Professional Communication and Workplace Skills": "OL010471",
      "Corporate Governance and CSR": "OL010486",
      "Financial Management": "OL010401",
      "Management Accounting": "OL020501",
      "Security Analysis & Portfolio Management": "OL010524",
      "Goods and Service Tax (GST) & Customs Law": "OL020502",
      "Business Analytics": "OL010541",
      "Internship - II": "OL010596",
      "Financial Analysis and Reporting": "OL020601",
      "Financial Derivatives": "OL020602",
      "Financial Analytics": "OL010624",
      "Auditing": "OL020603",
      "Data Visualization": "OL010641"
    },
    careerRoles: [
      "Taxation & Audit Associate",
      "Corporate Accountant",
      "Financial Risk & Compliance Analyst",
      "Commercial Banking Officer",
      "Wealth Management Advisor",
      "Securities & Equity Research Assistant",
      "Credit & Loan Appraiser",
      "Cost Management Consultant"
    ]
  }
};