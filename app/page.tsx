'use client';

import React, { useState, useEffect } from 'react';

// SGT Complete Syllabus Directory
const SGT_PROGRAMS: Record<string, { totalSemesters: number; semesters: Record<number, string[]> }> = {
  BCA: {
    totalSemesters: 6,
    semesters: {
      1: [
        'Problem Solving using C',
        'Computer Fundamentals & Information Technology',
        'Mathematical Foundations of Computer Science',
        'Communication Skills & Professional English',
        'Environmental Studies',
        'C Programming Laboratory',
        'Office Automation Tools Lab'
      ],
      2: [
        'Data Structures and Algorithms',
        'Database Management Systems (DBMS)',
        'Web Technologies (HTML5/CSS3/JavaScript)',
        'Computer Organization and Architecture',
        'Discrete Mathematics',
        'Data Structures Lab using C/C++',
        'DBMS & SQL Laboratory'
      ],
      3: [
        'Object Oriented Programming with Java',
        'Operating Systems & System Programming',
        'Computer Networks',
        'Software Engineering Principles',
        'Java Programming Lab',
        'Operating Systems & Shell Scripting Lab'
      ],
      4: [
        'Python Programming for Developers',
        'Computer Graphics & Multimedia',
        'Information & Cyber Security',
        'Optimization Techniques',
        'Python Computing Lab',
        'Minor Development Project'
      ],
      5: [
        'Cloud Computing & Virtualization',
        'Mobile Application Development (Android/Kotlin)',
        'Artificial Intelligence Fundamentals',
        'Full-Stack Web Development',
        'Mobile Apps Lab',
        'Web Engineering Lab'
      ],
      6: [
        'DevOps & CI/CD Pipelines',
        'Data Mining & Warehousing',
        'Major Capstone Industry Project',
        'Comprehensive Seminar & Viva Voce'
      ],
    },
  },
  MCA: {
    totalSemesters: 4,
    semesters: {
      1: [
        'Advanced Python Programming',
        'Advanced Database Management Systems (ADBMS)',
        'Mathematical Foundations & Discrete Structures',
        'Advanced Computer Networks',
        'Software Engineering & Agile Methodologies',
        'Python for Data Science & Engineering Lab',
        'Advanced SQL & NoSQL Lab'
      ],
      2: [
        'Design and Analysis of Algorithms',
        'Fundamentals of Artificial Intelligence & Machine Learning',
        'Cloud Computing Architectures',
        'Operating System Internals & Linux Shell',
        'Machine Learning & Algorithms Lab',
        'Cloud Infrastructure & Virtualization Lab'
      ],
      3: [
        'Deep Learning & Neural Networks',
        'Big Data Analytics & Data Engineering',
        'Cybersecurity, Cryptography & Threat Defense',
        'Natural Language Processing',
        'Deep Learning & Neural Networks Lab',
        'Major Project Phase I'
      ],
      4: [
        'Generative AI & MLOps Infrastructure',
        'Enterprise Application Development Capstone',
        'Curriculum Industry Practicum / Internship',
        'Research Paper Seminar & Viva Voce'
      ],
    },
  },
  BBA: {
    totalSemesters: 6,
    semesters: {
      1: [
        'Principles of Management',
        'Microeconomics for Business',
        'Financial Accounting Principles',
        'Business Communication & Personality Development',
        'Business Mathematics',
        'IT Applications in Management Lab'
      ],
      2: [
        'Organizational Behaviour',
        'Macroeconomics & Policy',
        'Marketing Management I',
        'Cost & Management Accounting',
        'Business Statistics',
        'Spreadsheet Modeling for Business Lab'
      ],
      3: [
        'Corporate Finance',
        'Human Resource Management',
        'Marketing Management II',
        'Business Research Methods',
        'Legal Aspects of Business',
        'Business Analytics & Data Interpretation'
      ],
      4: [
        'Operations & Supply Chain Management',
        'Consumer Behaviour & Insights',
        'Financial Markets & Services',
        'Digital Business & E-Commerce Strategy',
        'Taxation for Managers',
        'Summer Internship Project Review'
      ],
      5: [
        'Strategic Management',
        'Digital Marketing & Social Media Strategy',
        'Retail & Merchandising Operations',
        'International Business Environment',
        'Entrepreneurship Development & Venture Creation'
      ],
      6: [
        'Business Ethics & Corporate Governance',
        'Project Management & Evaluation',
        'Major Entrepreneurship / Corporate Capstone',
        'Comprehensive Management Viva'
      ],
    },
  },
  BCOM: {
    totalSemesters: 6,
    semesters: {
      1: [
        'Financial Accounting I',
        'Business Organization and Management',
        'Microeconomics & Market Analysis',
        'Business Communication',
        'Commercial Law',
        'Computerized Accounting (Tally/ERP) Lab'
      ],
      2: [
        'Financial Accounting II & Corporate Accounting',
        'Business Mathematics & Statistics',
        'Company Law & Secretarial Practice',
        'Macroeconomics & Fiscal Policy',
        'Environmental Studies for Commerce',
        'Financial Spreadsheets Lab'
      ],
      3: [
        'Cost Accounting Fundamentals',
        'Income Tax Law and Practice I',
        'Banking Theory, Law and Practice',
        'Principles of Marketing',
        'E-Commerce & Digital Commerce',
        'Income Tax Return Filing Lab'
      ],
      4: [
        'Advanced Auditing & Corporate Governance',
        'Goods and Services Tax (GST) & Customs Law',
        'Corporate Finance & Valuation',
        'Financial Markets & Capital Operations',
        'Cost & Management Accounting Applications',
        'GST Compliance & Portal Lab'
      ],
      5: [
        'Management Accounting & Decision Making',
        'Corporate Tax Planning & Management',
        'Financial Reporting Standards (IFRS/Ind AS)',
        'Data Analytics for Accounting & Finance',
        'Investment Analysis & Portfolio Foundations'
      ],
      6: [
        'International Finance & Forex Operations',
        'Security Analysis & Wealth Management',
        'Entrepreneurship & Small Business Accounting',
        'Major Research Capstone Project',
        'Comprehensive Viva Voce'
      ],
    },
  },
  MBA: {
    totalSemesters: 4,
    semesters: {
      1: [
        'Managerial Economics',
        'Accounting for Decision Makers',
        'Marketing Management & Strategy',
        'Organizational Behavior & Leadership',
        'Quantitative Techniques & Business Statistics',
        'Business Communication & Executive Presence',
        'Executive Excel & Data Analysis Lab'
      ],
      2: [
        'Financial Management & Corporate Valuation',
        'Operations Strategy & Supply Chain Excellence',
        'Human Resource Strategies & Talent Analytics',
        'Business Research & Predictive Analytics',
        'Legal, Regulatory & Ethical Environment of Business',
        'Enterprise Resource Planning (ERP) Systems',
        'Design Thinking & Innovation Workshop'
      ],
      3: [
        'Strategic Corporate Management',
        'Product Management & GTM Strategy',
        'FinTech, Digital Banking & Financial Analytics',
        'Strategic Brand Management',
        'Customer Analytics & CRM Platforms',
        'Summer Internship Project Assessment'
      ],
      4: [
        'Global Strategic Management & Mergers',
        'Venture Capital, Private Equity & Angel Investing',
        'Digital Transformation & Emerging Tech Leadership',
        'Executive Capstone Consulting Project',
        'Boardroom Defense & Comprehensive Viva'
      ],
    },
  },
};

interface CompanyHiringInfo {
  name: string;
  url: string;
  role: string;
  salary: string;
}

const CAREER_PROFILES: Record<string, {
  skills: string[];
  certifications: string[];
  companies: Record<string, CompanyHiringInfo[]>;
}> = {
  'Full-Stack Software Engineer': {
    skills: ['TypeScript', 'React / Next.js', 'Node.js', 'Go', 'PostgreSQL', 'Docker', 'RESTful APIs'],
    certifications: ['Full-Stack Web Development Open', 'AWS Certified Developer Associate'],
    companies: {
      'Bengaluru': [
        { name: 'Razorpay', url: 'https://razorpay.com/jobs/', role: 'SDE 1 - Backend / Full Stack', salary: '₹14 - 22 LPA' },
        { name: 'Flipkart', url: 'https://www.flipkartcareers.com/', role: 'UI Engineer / SDE 1', salary: '₹18 - 26 LPA' },
        { name: 'Swiggy', url: 'https://careers.swiggy.com/', role: 'Software Engineer (Consumer)', salary: '₹16 - 24 LPA' },
        { name: 'Cred', url: 'https://cred.club/careers', role: 'Full Stack Engineer', salary: '₹22 - 35 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Zomato', url: 'https://www.zomato.com/careers', role: 'Software Development Engineer', salary: '₹15 - 24 LPA' },
        { name: 'MakeMyTrip', url: 'https://careers.makemytrip.com/', role: 'Associate Software Engineer', salary: '₹12 - 18 LPA' },
        { name: 'Urban Company', url: 'https://careers.urbancompany.com/', role: 'SDE 1 - Core Systems', salary: '₹16 - 25 LPA' },
        { name: 'Nagarro', url: 'https://www.nagarro.com/en/careers', role: 'Associate Engineer - Full Stack', salary: '₹7 - 12 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'GitLab', url: 'https://about.gitlab.com/jobs/', role: 'Frontend / Fullstack Engineer', salary: '$95k - $140k' },
        { name: 'Automattic', url: 'https://automattic.com/work-with-us/', role: 'Code Wrangler (Full Stack)', salary: '$90k - $130k' },
        { name: 'Toptal', url: 'https://www.toptal.com/careers', role: 'Core Platform Engineer', salary: '$100k - $160k' },
        { name: 'Zapier', url: 'https://zapier.com/jobs', role: 'Software Engineer II', salary: '$110k - $150k' },
      ],
    },
  },
  'AI & Machine Learning Engineer': {
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LLM Fine-tuning', 'Vector DBs (Pinecone/Milvus)', 'MLOps (MLflow)'],
    certifications: ['DeepLearning.AI Deep Learning Specialization', 'AWS Machine Learning Specialty'],
    companies: {
      'Bengaluru': [
        { name: 'Fractal Analytics', url: 'https://fractal.ai/careers/', role: 'AI Engineer', salary: '₹12 - 20 LPA' },
        { name: 'Microsoft India', url: 'https://careers.microsoft.com/', role: 'Applied Sciences / AI Engineer', salary: '₹25 - 40 LPA' },
        { name: 'Wipro AI Labs', url: 'https://careers.wipro.com/', role: 'Machine Learning Specialist', salary: '₹9 - 16 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'American Express', url: 'https://www.americanexpress.com/en-us/careers/', role: 'Decision Sciences & AI Analyst', salary: '₹16 - 26 LPA' },
        { name: 'EXL Analytics', url: 'https://www.exlservice.com/careers', role: 'Lead Assistant - Generative AI', salary: '₹11 - 18 LPA' },
        { name: 'Tiger Analytics', url: 'https://www.tigeranalytics.com/careers/', role: 'Data Scientist / ML Engineer', salary: '₹12 - 20 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'Hugging Face', url: 'https://huggingface.co/jobs', role: 'Machine Learning Engineer', salary: '$130k - $190k' },
        { name: 'Scale AI', url: 'https://scale.com/careers', role: 'AI Applications Engineer', salary: '$120k - $180k' },
        { name: 'OpenAI Ecosystem', url: 'https://openai.com/careers', role: 'Forward Deployed AI Engineer', salary: '$140k - $220k' },
      ],
    },
  },
  'Data Scientist & Analytics Specialist': {
    skills: ['SQL', 'Python (Pandas, NumPy)', 'PowerBI / Tableau', 'Statistical Modeling', 'A/B Testing', 'Snowflake'],
    certifications: ['Google Advanced Data Analytics Certificate', 'Databricks Data Analyst Associate'],
    companies: {
      'Bengaluru': [
        { name: 'Mu Sigma', url: 'https://www.mu-sigma.com/careers', role: 'Decision Scientist', salary: '₹8 - 14 LPA' },
        { name: 'Flipkart Analytics', url: 'https://www.flipkartcareers.com/', role: 'Business Data Analyst', salary: '₹14 - 22 LPA' },
        { name: 'Groww', url: 'https://groww.in/careers', role: 'Data Scientist', salary: '₹16 - 25 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Genpact', url: 'https://www.genpact.com/careers', role: 'Data Analytics Consultant', salary: '₹8 - 15 LPA' },
        { name: 'Axtria', url: 'https://www.axtria.com/careers/', role: 'Data Analytics Associate', salary: '₹9 - 16 LPA' },
        { name: 'Blinkit', url: 'https://blinkit.com/careers', role: 'Analytics Lead - Supply Chain', salary: '₹15 - 24 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'Dataiku', url: 'https://www.dataiku.com/careers/', role: 'Data Science Evangelist', salary: '$100k - $150k' },
        { name: 'Superhuman', url: 'https://superhuman.com/careers', role: 'Product Data Scientist', salary: '$110k - $160k' },
      ],
    },
  },
  'Cloud & DevOps Solutions Architect': {
    skills: ['AWS / GCP / Azure', 'Docker', 'Kubernetes (K8s)', 'Terraform (IaC)', 'CI/CD (GitHub Actions)', 'Prometheus / Grafana'],
    certifications: ['AWS Solutions Architect Associate', 'CKA: Certified Kubernetes Administrator'],
    companies: {
      'Bengaluru': [
        { name: 'Amazon Web Services', url: 'https://www.amazon.jobs/', role: 'Cloud Support / DevOps Associate', salary: '₹18 - 30 LPA' },
        { name: 'Cisco', url: 'https://jobs.cisco.com/', role: 'Site Reliability Engineer', salary: '₹16 - 26 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Airtel Digital', url: 'https://airtel.com/careers', role: 'DevOps & Platform Engineer', salary: '₹14 - 22 LPA' },
        { name: 'Orange Business', url: 'https://www.orange-business.com/en/careers', role: 'Cloud Operations Specialist', salary: '₹8 - 15 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'HashiCorp', url: 'https://www.hashicorp.com/careers', role: 'Systems Infrastructure Engineer', salary: '$120k - $175k' },
        { name: 'Canonical / Ubuntu', url: 'https://canonical.com/careers', role: 'DevOps Solutions Architect', salary: '$100k - $155k' },
      ],
    },
  },
  'Cybersecurity Analyst & Penetration Tester': {
    skills: ['Network Security', 'Vulnerability Assessment', 'Burp Suite', 'Wireshark', 'SIEM & SOC Analysis', 'OWASP Top 10'],
    certifications: ['CompTIA Security+', 'CEH: Certified Ethical Hacker'],
    companies: {
      'Bengaluru': [
        { name: 'Wipro Cyber Defense', url: 'https://careers.wipro.com/', role: 'SOC Analyst L2', salary: '₹7 - 13 LPA' },
        { name: 'Palo Alto Networks', url: 'https://jobs.paloaltonetworks.com/', role: 'Security Assurance Associate', salary: '₹18 - 28 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'KPMG India', url: 'https://kpmg.com/in/en/home/careers.html', role: 'Cyber Threat Consultant', salary: '₹10 - 18 LPA' },
        { name: 'PwC India', url: 'https://www.pwc.in/careers.html', role: 'Information Security Consultant', salary: '₹11 - 19 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'CrowdStrike', url: 'https://www.crowdstrike.com/careers/', role: 'Threat Intelligence Analyst', salary: '$110k - $160k' },
        { name: 'Elastic', url: 'https://www.elastic.co/careers/', role: 'Security Analytics Engineer', salary: '$115k - $170k' },
      ],
    },
  },
  'Product Manager (Tech / B2B)': {
    skills: ['Product Roadmapping', 'User Story Mapping', 'SQL & Funnel Metrics', 'A/B Testing Strategy', 'Wireframing (Figma)', 'Agile / Scrum'],
    certifications: ['Pragmatic Institute Certified Product Master', 'Scrum Alliance Certified Product Owner (CSPO)'],
    companies: {
      'Bengaluru': [
        { name: 'PhonePe', url: 'https://www.phonepe.com/careers/', role: 'Associate Product Manager', salary: '₹18 - 28 LPA' },
        { name: 'Atlassian India', url: 'https://www.atlassian.com/company/careers', role: 'Product Manager I', salary: '₹26 - 38 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Cars24', url: 'https://www.cars24.com/careers/', role: 'Product Manager - Growth', salary: '₹18 - 26 LPA' },
        { name: 'PolicyBazaar', url: 'https://www.policybazaar.com/careers/', role: 'Associate Product Manager', salary: '₹14 - 22 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'Notion', url: 'https://www.notion.so/careers', role: 'Product Manager - Ecosystem', salary: '$130k - $190k' },
        { name: 'Shopify', url: 'https://www.shopify.com/careers', role: 'Product Lead (Core Commerce)', salary: '$140k - $210k' },
      ],
    },
  },
  'Financial Analyst & Valuation Consultant': {
    skills: ['Financial Modeling (3-Statement)', 'Discounted Cash Flow (DCF)', 'Excel Mastery', 'PowerBI', 'Corporate Valuation', 'IFRS / Ind AS'],
    certifications: ['CFA (Chartered Financial Analyst) Level 1', 'FMVA: Financial Modeling & Valuation Analyst'],
    companies: {
      'Bengaluru': [
        { name: 'Goldman Sachs', url: 'https://www.goldmansachs.com/careers/', role: 'Financial Analyst - Global Markets', salary: '₹16 - 26 LPA' },
        { name: 'Morgan Stanley', url: 'https://www.morganstanley.com/careers', role: 'Equity Research Analyst', salary: '₹15 - 24 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Deloitte USI (Gurugram)', url: 'https://www2.deloitte.com/ui/en/careers/careers.html', role: 'Valuation & Modeling Consultant', salary: '₹10 - 17 LPA' },
        { name: 'Ernst & Young (EY)', url: 'https://www.ey.com/en_in/careers', role: 'Corporate Finance Analyst', salary: '₹9 - 16 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'Carta', url: 'https://carta.com/careers/', role: 'Valuation Analyst', salary: '$90k - $135k' },
        { name: 'Brex', url: 'https://www.brex.com/careers', role: 'Strategic Finance Analyst', salary: '$110k - $160k' },
      ],
    },
  },
  'Investment Banking & Equity Analyst': {
    skills: ['M&A Pitch Decks', 'LBO Modeling', 'Comparable Company Analysis (Comps)', 'Capital Markets Due Diligence', 'CapIQ / Bloomberg Terminal'],
    certifications: ['CFA Program', 'NISM Equity Derivatives & Research Analyst'],
    companies: {
      'Bengaluru': [
        { name: 'JPMorgan Chase', url: 'https://careers.jpmorgan.com/', role: 'Investment Banking Analyst', salary: '₹18 - 32 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Moody’s Analytics (Gurugram)', url: 'https://careers.moodys.com/', role: 'Credit & Risk Research Analyst', salary: '₹11 - 18 LPA' },
        { name: 'Grant Thornton', url: 'https://www.grantthornton.in/en/careers/', role: 'Transaction Advisory Analyst', salary: '₹9 - 15 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'Bloomberg LP', url: 'https://www.bloomberg.com/company/careers/', role: 'Financial Products Analyst', salary: '$100k - $145k' },
      ],
    },
  },
  'Digital Marketing & Growth Strategist': {
    skills: ['Meta Ads Manager', 'Google Ads (SEM)', 'Conversion Rate Optimization (CRO)', 'Marketing Funnel Analytics', 'Ahrefs / SEMrush', 'Copywriting'],
    certifications: ['Google Ads Search Professional', 'Meta Certified Digital Marketing Associate'],
    companies: {
      'Bengaluru': [
        { name: 'InMobi', url: 'https://www.inmobi.com/company/careers/', role: 'Performance Marketing Specialist', salary: '₹10 - 18 LPA' },
        { name: 'Zerodha Media (Rainmatter)', url: 'https://zerodha.com/careers', role: 'Content & Growth Marketer', salary: '₹9 - 16 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Mamaearth HQ', url: 'https://mamaearth.in/careers', role: 'D2C Growth Strategist', salary: '₹12 - 20 LPA' },
        { name: 'GroupM (Gurugram)', url: 'https://www.groupm.com/careers/', role: 'Media Planning Manager', salary: '₹8 - 15 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'Buffer', url: 'https://buffer.com/journey', role: 'Growth Marketer', salary: '$95k - $140k' },
        { name: 'ConvertKit', url: 'https://convertkit.com/careers', role: 'Lifecycle Marketing Strategist', salary: '$100k - $145k' },
      ],
    },
  },
  'Human Resource & Talent Analytics Manager': {
    skills: ['HR Metrics & People Analytics', 'Talent Acquisition Lifecycle', 'HRIS Systems (Workday/Darwinbox)', 'Compensation & Benefits (C&B)', 'Labor Law Compliance'],
    certifications: ['SHRM-CP: Society for HR Management Certified Professional', 'People Analytics by Wharton'],
    companies: {
      'Bengaluru': [
        { name: 'Infosys BPM', url: 'https://www.infosysbpm.com/careers/', role: 'Human Resources Specialist', salary: '₹7 - 12 LPA' },
        { name: 'Accenture India', url: 'https://www.accenture.com/in-en/careers', role: 'Talent Management Strategist', salary: '₹9 - 16 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Genpact HR Services', url: 'https://www.genpact.com/careers', role: 'HR Operations Lead', salary: '₹8 - 14 LPA' },
        { name: 'PwC India', url: 'https://www.pwc.in/careers.html', role: 'Human Capital Consultant', salary: '₹10 - 17 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'GitLab People Ops', url: 'https://about.gitlab.com/jobs/', role: 'People Operations Generalist', salary: '$85k - $125k' },
      ],
    },
  },
  'Supply Chain & Operations Consultant': {
    skills: ['Logistics Optimization', 'Inventory Forecasting', 'SAP / ERP Operations', 'Lean Six Sigma', 'Vendor Management', 'Procurement Analytics'],
    certifications: ['Six Sigma Green Belt (SSGB)', 'APICS Certified Supply Chain Professional (CSCP)'],
    companies: {
      'Bengaluru': [
        { name: 'Amazon India Operations', url: 'https://www.amazon.jobs/', role: 'Operations / Fulfillment Specialist', salary: '₹12 - 20 LPA' },
        { name: 'Delhivery Hub', url: 'https://www.delhivery.com/careers/', role: 'Supply Chain Solution Architect', salary: '₹11 - 19 LPA' },
      ],
      'Gurugram / Delhi NCR': [
        { name: 'Blinkit Operations', url: 'https://blinkit.com/careers', role: 'Dark Store Operations Manager', salary: '₹13 - 22 LPA' },
        { name: 'Maruti Suzuki HQ (Gurugram)', url: 'https://www.marutisuzuki.com/corporate/careers', role: 'Supply Chain Planning Specialist', salary: '₹9 - 15 LPA' },
      ],
      'Remote / US-Based': [
        { name: 'Flexport', url: 'https://www.flexport.com/careers/', role: 'Global Logistics Analyst', salary: '$90k - $135k' },
      ],
    },
  },
};

const ALL_GENERIC_SKILLS = [
  'Python', 'Java', 'JavaScript / TypeScript', 'C++', 'React / Next.js',
  'Node.js', 'SQL & Relational DBs', 'AWS / Azure Cloud', 'Docker & Kubernetes',
  'Excel & Financial Modeling', 'Data Analysis (Pandas / PowerBI)',
  'Machine Learning & Deep Learning', 'Digital Marketing & Paid Ads',
  'Business Communication & Strategy', 'Agile & Product Roadmapping', 'Cybersecurity & Network Defense',
];

export default function OptiPath() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'sgt_form' | 'non_sgt_form' | 'results'>('landing');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [studentType, setStudentType] = useState<'sgt' | 'non_sgt'>('sgt');

  // SGT State
  const [sgtProgram, setSgtProgram] = useState<string>('MCA');
  const [sgtSemester, setSgtSemester] = useState<number>(1);
  const [selectedCompletedSubjects, setSelectedCompletedSubjects] = useState<string[]>([]);

  // Non-SGT State
  const [highestQualification, setHighestQualification] = useState<string>('BCA / B.Sc (Computer Science)');
  const [nonSgtSkills, setNonSgtSkills] = useState<string[]>(['Python', 'SQL & Relational DBs']);
  const [careerStage, setCareerStage] = useState<string>('College Fresher');

  // Aspirations
  const [targetCareer, setTargetCareer] = useState<string>('AI & Machine Learning Engineer');
  const [preferredLocation, setPreferredLocation] = useState<string>('Gurugram / Delhi NCR');

  // Helper functions
  const getAllSubjectsUpToSem = (prog: string, sem: number): string[] => {
    const semData = SGT_PROGRAMS[prog]?.semesters || {};
    const subs: string[] = [];
    for (let i = 1; i <= sem; i++) {
      if (semData[i]) {
        subs.push(...semData[i]);
      }
    }
    return subs;
  };

  const getUpcomingSubjects = (prog: string, sem: number) => {
    const semData = SGT_PROGRAMS[prog]?.semesters || {};
    const upcoming: { semester: number; subjects: string[] }[] = [];
    const total = SGT_PROGRAMS[prog]?.totalSemesters || 4;
    for (let i = sem + 1; i <= total; i++) {
      if (semData[i] && semData[i].length > 0) {
        upcoming.push({ semester: i, subjects: semData[i] });
      }
    }
    return upcoming;
  };

  useEffect(() => {
    setSelectedCompletedSubjects(getAllSubjectsUpToSem(sgtProgram, sgtSemester));
  }, [sgtProgram, sgtSemester]);

  const handleStartSGT = () => {
    setStudentType('sgt');
    setSgtProgram('MCA');
    setSgtSemester(1);
    setSelectedCompletedSubjects(getAllSubjectsUpToSem('MCA', 1));
    setCurrentStep('sgt_form');
  };

  const handleStartNonSGT = () => {
    setStudentType('non_sgt');
    setCurrentStep('non_sgt_form');
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setCurrentStep('results');
    }, 1000);
  };

  const toggleSubject = (sub: string) => {
    setSelectedCompletedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const toggleNonSgtSkill = (skill: string) => {
    setNonSgtSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Direct Resume Skill Exporter
  const handleDownloadSkillsResume = () => {
    const profile = CAREER_PROFILES[targetCareer];
    const skillsList = profile?.skills.join(' • ') || '';
    const certsList = profile?.certifications.map((c) => `- ${c}`).join('\n') || '';
    const completedList =
      studentType === 'sgt'
        ? selectedCompletedSubjects.map((s) => `- ${s}`).join('\n')
        : nonSgtSkills.map((s) => `- ${s}`).join('\n');

    const content = `=====================================================
TECHNICAL SKILLS & COMPETENCIES (ATS-READY)
Target Profile: ${targetCareer}
Target Location: ${preferredLocation}
=====================================================

1. CORE SKILLS & DOMAIN PROFICIENCIES
${skillsList}

2. CERTIFICATIONS & SPECIALIZATIONS
${certsList}

3. ACADEMIC & VERIFIED FOUNDATIONS
${completedList}

Generated via OptiPath Curriculum Career Alignment Engine
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OptiPath_Skills_${targetCareer.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-start p-4 sm:p-8">
      {/* Clickable Header Logo */}
      <header className="w-full max-w-4xl py-4 flex items-center justify-between border-b border-slate-200 mb-6">
        <button
          onClick={() => setCurrentStep('landing')}
          className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
          title="Reset to home"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            O
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">OptiPath</span>
        </button>
      </header>

      {/* STEP 1: Minimal Landing */}
      {currentStep === 'landing' && (
        <section className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Select your background</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleStartSGT}
              className="p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 bg-white hover:bg-indigo-50/30 text-left transition cursor-pointer flex flex-col justify-between"
            >
              <span className="font-bold text-slate-900 text-base">SGT Student</span>
              <span className="text-xs font-semibold text-indigo-600 mt-4">Continue &rarr;</span>
            </button>

            <button
              onClick={handleStartNonSGT}
              className="p-6 rounded-xl border-2 border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50 text-left transition cursor-pointer flex flex-col justify-between"
            >
              <span className="font-bold text-slate-900 text-base">Non-SGT Student</span>
              <span className="text-xs font-semibold text-slate-700 mt-4">Continue &rarr;</span>
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: SGT Form with Back Button */}
      {currentStep === 'sgt_form' && (
        <section className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button
              onClick={() => setCurrentStep('landing')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <span>&larr;</span> Back
            </button>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">SGT Student</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Course</label>
              <select
                value={sgtProgram}
                onChange={(e) => setSgtProgram(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="BBA">BBA</option>
                <option value="BCOM">B.Com</option>
                <option value="MBA">MBA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Semester</label>
              <select
                value={sgtSemester}
                onChange={(e) => setSgtSemester(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                {Array.from({ length: SGT_PROGRAMS[sgtProgram]?.totalSemesters || 4 }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>Semester {idx + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subjects Studied Till Now - Full Syllabus */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase">
                Subjects studied till now ({sgtProgram} &bull; Up to Semester {sgtSemester})
              </label>
              <span className="text-xs text-slate-400">
                {selectedCompletedSubjects.length} of {getAllSubjectsUpToSem(sgtProgram, sgtSemester).length} selected
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
              {getAllSubjectsUpToSem(sgtProgram, sgtSemester).map((subject, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 cursor-pointer hover:border-indigo-400 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedCompletedSubjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Target Career</label>
              <select
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                {Object.keys(CAREER_PROFILES).map((role, idx) => (
                  <option key={idx} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Target Location</label>
              <select
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                <option value="Gurugram / Delhi NCR">Gurugram / Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Remote / US-Based">Remote / US-Based</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition disabled:opacity-70 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Analyze Career Fit &rarr;</span>
              )}
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: Non-SGT Form with Back Button */}
      {currentStep === 'non_sgt_form' && (
        <section className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button
              onClick={() => setCurrentStep('landing')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <span>&larr;</span> Back
            </button>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Non-SGT Student</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Highest Qualification</label>
              <select
                value={highestQualification}
                onChange={(e) => setHighestQualification(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                <option value="B.Tech / BE (CS / IT)">B.Tech / BE (CS / IT)</option>
                <option value="BCA / B.Sc (Computer Science)">BCA / B.Sc (Computer Science)</option>
                <option value="B.Com / BBA">B.Com / BBA</option>
                <option value="B.Tech (Non-CS Branch)">B.Tech (Non-CS Branch)</option>
                <option value="Other Graduate Degree">Other Graduate Degree</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Status</label>
              <select
                value={careerStage}
                onChange={(e) => setCareerStage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                <option value="College Fresher">College Fresher</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Looking for a Switch">Looking for a Career Switch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Select your skills</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 max-h-52 overflow-y-auto">
              {ALL_GENERIC_SKILLS.map((skill, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 cursor-pointer hover:border-slate-400 transition"
                >
                  <input
                    type="checkbox"
                    checked={nonSgtSkills.includes(skill)}
                    onChange={() => toggleNonSgtSkill(skill)}
                    className="w-4 h-4 text-slate-900 rounded accent-slate-900 cursor-pointer"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Target Career</label>
              <select
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                {Object.keys(CAREER_PROFILES).map((role, idx) => (
                  <option key={idx} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Target Location</label>
              <select
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium outline-none cursor-pointer"
              >
                <option value="Gurugram / Delhi NCR">Gurugram / Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Remote / US-Based">Remote / US-Based</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition disabled:opacity-70 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Analyze Career Fit &rarr;</span>
              )}
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: Results Dashboard with Back Button */}
      {currentStep === 'results' && (
        <section className="w-full max-w-4xl space-y-6 pb-12">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setCurrentStep(studentType === 'sgt' ? 'sgt_form' : 'non_sgt_form')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer mt-1"
              >
                <span>&larr;</span> Back
              </button>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">
                  {studentType === 'sgt' ? `SGT ${sgtProgram} &bull; Semester ${sgtSemester}` : `${highestQualification} &bull; ${careerStage}`}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{targetCareer}</h2>
                <p className="text-xs text-slate-500">Target Region: {preferredLocation}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownloadSkillsResume}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Skills for Resume</span>
              </button>
            </div>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Covered */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase">Covered Till Now</h3>
              </div>
              <ul className="space-y-1.5 max-h-60 overflow-y-auto">
                {studentType === 'sgt' ? (
                  selectedCompletedSubjects.map((s, idx) => (
                    <li key={idx} className="p-1.5 bg-emerald-50 text-emerald-900 rounded-md text-xs font-medium border border-emerald-100">
                      &#10003; {s}
                    </li>
                  ))
                ) : (
                  nonSgtSkills.map((s, idx) => (
                    <li key={idx} className="p-1.5 bg-emerald-50 text-emerald-900 rounded-md text-xs font-medium border border-emerald-100">
                      &#10003; {s}
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Column 2: Studied Later */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase">
                  {studentType === 'sgt' ? 'Studied in Later Semesters' : 'Degree Bridge'}
                </h3>
              </div>
              <ul className="space-y-1.5 max-h-60 overflow-y-auto">
                {studentType === 'sgt' ? (
                  getUpcomingSubjects(sgtProgram, sgtSemester).length > 0 ? (
                    getUpcomingSubjects(sgtProgram, sgtSemester).map((semGroup) => (
                      <div key={semGroup.semester} className="mb-2">
                        <span className="text-[10px] font-bold text-indigo-600 block">Semester {semGroup.semester}</span>
                        {semGroup.subjects.map((sub, sIdx) => (
                          <li key={sIdx} className="p-1.5 bg-indigo-50 text-indigo-900 rounded-md text-xs font-medium border border-indigo-100 mt-1">
                            &bull; {sub}
                          </li>
                        ))}
                      </div>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic">Final semester completed.</li>
                  )
                ) : (
                  CAREER_PROFILES[targetCareer]?.skills.slice(0, 4).map((s, idx) => (
                    <li key={idx} className="p-1.5 bg-indigo-50 text-indigo-900 rounded-md text-xs font-medium border border-indigo-100">
                      &bull; {s}
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Column 3: Skills to Add on Your Own */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase">Skills to Add on Your Own</h3>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {CAREER_PROFILES[targetCareer]?.skills.map((sk, idx) => (
                    <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-900 rounded text-[11px] font-medium border border-amber-200">
                      {sk}
                    </span>
                  ))}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Recommended Certifications</span>
                  <ul className="space-y-1">
                    {CAREER_PROFILES[targetCareer]?.certifications.map((c, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-1">
                        <span>&rarr;</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Companies */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-900 uppercase">
                Target Companies Hiring in {preferredLocation}
              </h3>
              <span className="text-[11px] text-slate-400">Click card to visit official careers portal &rarr;</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {(CAREER_PROFILES[targetCareer]?.companies[preferredLocation] || []).map((company, cIdx) => (
                <a
                  key={cIdx}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {company.name}
                      </h4>
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-600 font-medium block mt-1.5">
                      {company.role}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Expected</span>
                    <span className="text-xs font-bold text-emerald-600">{company.salary}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}