// lib/skillMatch.ts
// Client-side skill matching for OptiPath. Pure functions, no React, no network.
//
// Match % = (|Acquired Skills ∩ Mandatory Skills| / |Mandatory Skills|) * 100
//
// "Mandatory skills" come from role-family templates below (the role taxonomy in
// data/all_roles.json only holds role titles, no skill lists). Edit REQUIREMENTS
// and SKILLS to tune what each kind of role needs.

export type SkillKind = "foundation" | "production";

export type RoleFamily =
  | "sde"
  | "backend"
  | "frontend"
  | "fullstack"
  | "devops"
  | "data_ai"
  | "data_eng"
  | "security"
  | "blockchain"
  | "mobile"
  | "qa"
  | "marketing"
  | "finance"
  | "hr"
  | "operations"
  | "bizanalytics"
  | "business"
  | "generic";

export interface SkillItem {
  id: string;
  label: string;
  kind: SkillKind;
  reason: string;
  /** What in the candidate's input produced this match (only for covered skills). */
  evidence?: string;
}

export interface SkillMatchResult {
  family: RoleFamily;
  familyLabel: string;
  confidence: "high" | "medium" | "low";
  required: SkillItem[];
  covered: SkillItem[];
  missing: SkillItem[];
  /** Missing skills that are normally taught in a degree (OS, Networks, DSA...). */
  foundationGaps: SkillItem[];
  /** Missing skills that are learned on the job / by building (Docker, Redis, Kafka...). */
  productionGaps: SkillItem[];
  /** Whole number 0-100. */
  percentage: number;
  /** Parts of the candidate's input we could not map to any known skill. */
  unrecognized: string[];
}

interface SkillDef {
  label: string;
  kind: SkillKind;
  reason: string;
  aliases: string[];
  implies?: string[];
}

// ---------------------------------------------------------------------------
// Skill catalogue. Aliases are matched as whole words, case-insensitively.
// ---------------------------------------------------------------------------
const SKILLS: Record<string, SkillDef> = {
  // ---- Foundations ----
  programming: {
    label: "Core Programming Language",
    kind: "foundation",
    reason: "A general-purpose language (Python, Java, C++, Go...) is the entry ticket to every engineering interview.",
    aliases: ["python", "java", "c++", "cpp", "c", "c#", "csharp", "golang", "rust", "kotlin", "swift", "php", "ruby", "scala", "javascript", "typescript", "programming", "c programming"],
  },
  dsa: {
    label: "Data Structures & Algorithms",
    kind: "foundation",
    reason: "Online assessments and first technical rounds are built on arrays, trees, graphs, DP and complexity analysis.",
    aliases: ["dsa", "data structures", "data structure", "algorithms", "algorithm", "leetcode", "competitive programming", "problem solving"],
  },
  oop: {
    label: "Object-Oriented Programming",
    kind: "foundation",
    reason: "Class design, inheritance, polymorphism and SOLID principles are tested in most machine-coding rounds.",
    aliases: ["oop", "oops", "object oriented", "object oriented programming", "java", "c++", "cpp", "c#", "csharp", "kotlin", "swift"],
  },
  dbms_sql: {
    label: "Databases & SQL",
    kind: "foundation",
    reason: "Relational modeling, joins, indexing and transactions come up in almost every backend and data interview.",
    aliases: ["sql", "dbms", "rdbms", "database", "databases", "mysql", "postgresql", "postgres", "sqlite", "mariadb", "oracle", "pl sql", "t sql", "sql server"],
  },
  os: {
    label: "Operating Systems",
    kind: "foundation",
    reason: "Processes, threads, scheduling and virtual memory are standard interview topics and underpin production debugging.",
    aliases: ["os", "operating system", "operating systems", "os concepts", "kernel", "multithreading", "concurrency"],
  },
  networks: {
    label: "Computer Networks",
    kind: "foundation",
    reason: "TCP/IP, HTTP, DNS and sockets are needed to reason about latency, load balancing and API behaviour.",
    aliases: ["computer networks", "computer network", "networking", "networks", "tcp ip", "tcp", "dns", "osi", "sockets", "socket programming"],
  },
  git: {
    label: "Git & Version Control",
    kind: "foundation",
    reason: "Every team works through pull requests; a visible GitHub history is also your portfolio.",
    aliases: ["git", "github", "gitlab", "bitbucket", "version control"],
  },
  linux: {
    label: "Linux & Shell",
    kind: "foundation",
    reason: "Servers, containers and CI all run Linux; shell fluency is expected for infra, backend and security roles.",
    aliases: ["linux", "ubuntu", "unix", "bash", "shell", "shell scripting", "command line", "centos", "debian"],
  },
  javascript: {
    label: "JavaScript",
    kind: "foundation",
    reason: "The language of the browser; closures, the event loop and async patterns are core interview material.",
    aliases: ["javascript", "js", "ecmascript", "es6", "vanilla js", "typescript", "react", "reactjs", "nextjs", "next js", "angular", "vue", "vuejs", "nodejs", "node"],
  },
  html_css: {
    label: "HTML & CSS",
    kind: "foundation",
    reason: "Semantic markup, layout (flex/grid) and responsive design are the base of every web UI.",
    aliases: ["html", "html5", "css", "css3", "tailwind", "tailwindcss", "tailwind css", "bootstrap", "sass", "scss"],
  },
  statistics_math: {
    label: "Statistics, Probability & Linear Algebra",
    kind: "foundation",
    reason: "Model behaviour and evaluation can't be reasoned about without these; they are tested in data/ML rounds.",
    aliases: ["statistics", "statistical", "probability", "linear algebra", "calculus", "math", "maths", "mathematics"],
  },
  security_fundamentals: {
    label: "Security Fundamentals (OWASP, Threat Modeling)",
    kind: "foundation",
    reason: "Common vulnerability classes and attacker thinking are the baseline for every security role.",
    aliases: ["cybersecurity", "cyber security", "infosec", "information security", "owasp", "ethical hacking", "pentest", "penetration testing", "vulnerability assessment", "threat modeling", "network security", "application security", "appsec"],
  },
  cryptography: {
    label: "Cryptography & PKI",
    kind: "foundation",
    reason: "Hashing, symmetric/asymmetric encryption, TLS and key management are core to security and blockchain work.",
    aliases: ["cryptography", "encryption", "pki", "tls", "ssl", "hashing", "cryptographic"],
  },
  blockchain_fundamentals: {
    label: "Blockchain Fundamentals",
    kind: "foundation",
    reason: "Consensus, ledgers, gas and transaction lifecycle must be understood before writing contracts.",
    aliases: ["blockchain", "distributed ledger", "consensus", "defi", "bitcoin", "cryptocurrency", "web3"],
  },
  qa_manual: {
    label: "Test Design & Bug Tracking",
    kind: "foundation",
    reason: "Writing test plans/cases and tracking defects is the baseline of any QA role.",
    aliases: ["manual testing", "test cases", "test case", "test plan", "bug tracking", "jira", "regression testing", "sdlc", "stlc", "qa"],
  },

  // ---- Production / industry skills ----
  python: {
    label: "Python",
    kind: "foundation",
    reason: "The default language for data, ML, automation and security tooling.",
    aliases: ["python", "python3", "pandas", "numpy", "jupyter", "pytorch", "tensorflow", "scikit learn", "sklearn", "fastapi", "flask", "django"],
  },
  rest_api: {
    label: "REST / API Design",
    kind: "production",
    reason: "Building and consuming HTTP APIs (REST, GraphQL, gRPC) is daily work in almost every software role.",
    aliases: ["rest", "restful", "rest api", "api", "apis", "graphql", "grpc", "openapi", "swagger", "postman", "fastapi", "flask", "django", "express", "spring boot", "nestjs"],
  },
  backend_framework: {
    label: "Backend Framework (Node/Django/FastAPI/Spring)",
    kind: "production",
    reason: "Companies hire for production frameworks, not just languages: routing, auth, ORM and middleware.",
    aliases: ["fastapi", "flask", "django", "express", "spring", "spring boot", "nestjs", "laravel", "asp.net", "asp net", "rails", "ruby on rails", "node", "nodejs"],
  },
  frontend_framework: {
    label: "Frontend Framework (React/Angular/Vue)",
    kind: "production",
    reason: "Component-based UI frameworks, state management and routing are the core of frontend hiring.",
    aliases: ["react", "reactjs", "angular", "vue", "vuejs", "svelte", "nextjs", "next js", "redux"],
  },
  typescript: {
    label: "TypeScript",
    kind: "production",
    reason: "Most modern web teams require type-safe JavaScript.",
    aliases: ["typescript", "ts"],
  },
  web_perf: {
    label: "Web Performance (Core Web Vitals, SSR, Bundling)",
    kind: "production",
    reason: "Performance budgets, SSR/SSG and bundler knowledge separate production frontends from tutorials.",
    aliases: ["web performance", "core web vitals", "lighthouse", "ssr", "ssg", "webpack", "vite", "performance optimization"],
  },
  docker: {
    label: "Docker & Containerization",
    kind: "production",
    reason: "Degrees cover virtualization theory; shipping containerized services must be learned hands-on.",
    aliases: ["docker", "container", "containers", "containerization", "docker compose", "kubernetes", "k8s"],
  },
  kubernetes: {
    label: "Kubernetes & Orchestration",
    kind: "production",
    reason: "Auto-scaling, rollouts and service discovery on K8s are expected for platform and DevOps roles.",
    aliases: ["kubernetes", "k8s", "helm", "eks", "gke", "aks", "openshift"],
    implies: ["docker"],
  },
  redis: {
    label: "Redis & Caching",
    kind: "production",
    reason: "Not part of the syllabus, yet required for latency optimization, rate limiting and session layers.",
    aliases: ["redis", "memcached", "caching", "cache"],
  },
  messaging: {
    label: "Message Queues & Event Streams (Kafka/RabbitMQ)",
    kind: "production",
    reason: "Academic projects use monoliths; industry systems are asynchronous and event-driven.",
    aliases: ["kafka", "rabbitmq", "sqs", "pubsub", "pub sub", "message queue", "message queues", "celery", "event driven", "event streaming", "nats"],
  },
  microservices: {
    label: "Microservices & Distributed Systems",
    kind: "production",
    reason: "Service decomposition, retries, idempotency and consistency trade-offs are standard senior-ish interview topics.",
    aliases: ["microservices", "microservice", "service mesh", "distributed systems", "distributive systems"],
  },
  system_design: {
    label: "System Design (HLD/LLD)",
    kind: "production",
    reason: "Design rounds ask you to scale a system on a whiteboard; this only comes from studying real architectures.",
    aliases: ["system design", "hld", "lld", "high level design", "low level design", "design patterns", "software architecture"],
    implies: [],
  },
  observability: {
    label: "Observability & APM (Prometheus/Grafana)",
    kind: "production",
    reason: "Telemetry, tracing and p99 SLA monitoring are production disciplines that universities don't teach.",
    aliases: ["prometheus", "grafana", "observability", "datadog", "new relic", "apm", "opentelemetry", "elk", "monitoring"],
  },
  cloud: {
    label: "Cloud Platforms (AWS/Azure/GCP)",
    kind: "production",
    reason: "Nearly all employers deploy on a public cloud; hands-on account experience is expected.",
    aliases: ["aws", "azure", "gcp", "google cloud", "cloud", "cloud computing", "ec2", "s3", "lambda"],
  },
  cicd: {
    label: "CI/CD Pipelines",
    kind: "production",
    reason: "Automated build, test and deploy pipelines are standard at every product company.",
    aliases: ["ci/cd", "cicd", "ci cd", "jenkins", "github actions", "gitlab ci", "argocd", "continuous integration", "continuous delivery", "devops"],
  },
  iac: {
    label: "Infrastructure as Code (Terraform/Ansible)",
    kind: "production",
    reason: "Reproducible infrastructure is a core platform-engineering skill.",
    aliases: ["terraform", "ansible", "infrastructure as code", "iac", "cloudformation", "pulumi"],
  },
  testing: {
    label: "Automated Testing",
    kind: "production",
    reason: "Unit, integration and end-to-end tests are expected on any production codebase.",
    aliases: ["testing", "unit testing", "jest", "pytest", "junit", "selenium", "playwright", "cypress", "test automation", "tdd", "mocha", "sdet"],
  },
  nosql: {
    label: "NoSQL Databases",
    kind: "production",
    reason: "Document and wide-column stores are widespread in data-heavy backends.",
    aliases: ["nosql", "mongodb", "dynamodb", "cassandra", "couchbase", "elasticsearch"],
  },
  data_wrangling: {
    label: "Data Wrangling & Analysis (Pandas/NumPy)",
    kind: "production",
    reason: "Cleaning, joining and visualizing real data is most of day-to-day data work.",
    aliases: ["pandas", "numpy", "data analysis", "data cleaning", "tableau", "power bi", "matplotlib", "seaborn", "data visualization", "excel"],
  },
  ml: {
    label: "Machine Learning",
    kind: "production",
    reason: "Supervised/unsupervised models, evaluation metrics and feature engineering are core ML interview topics.",
    aliases: ["machine learning", "ml", "scikit learn", "sklearn", "supervised learning", "regression", "xgboost", "data mining", "deep learning"],
  },
  deep_learning: {
    label: "Deep Learning & LLMs",
    kind: "production",
    reason: "Transformers, fine-tuning and RAG pipelines are now baseline expectations for AI engineering roles.",
    aliases: ["deep learning", "pytorch", "tensorflow", "keras", "neural network", "neural networks", "cnn", "transformer", "transformers", "bert", "llm", "llms", "large language model", "generative ai", "genai", "rag", "langchain", "hugging face", "huggingface", "nlp", "natural language processing", "computer vision", "opencv"],
    implies: ["ml"],
  },
  mlops: {
    label: "ML Deployment & Vector Search",
    kind: "production",
    reason: "Serving models with low latency, versioning them and indexing embeddings is what separates notebooks from products.",
    aliases: ["mlops", "mlflow", "kubeflow", "model deployment", "model serving", "sagemaker", "vector db", "vector database", "chroma", "pinecone", "faiss", "milvus"],
  },
  big_data: {
    label: "Big Data & ETL (Spark/Airflow)",
    kind: "production",
    reason: "Batch and streaming pipelines at scale are the core of data-engineering roles.",
    aliases: ["spark", "pyspark", "hadoop", "airflow", "etl", "dbt", "snowflake", "bigquery", "data warehouse", "data warehousing", "hive", "databricks", "big data"],
  },
  security_tools: {
    label: "Security Tooling (Burp/Nmap/Wireshark/SIEM)",
    kind: "production",
    reason: "Hands-on practice with scanners, packet analysis and SIEM dashboards is expected for SOC and pentest roles.",
    aliases: ["burp", "burpsuite", "burp suite", "nmap", "metasploit", "kali", "wireshark", "splunk", "siem"],
  },
  solidity: {
    label: "Smart Contracts (Solidity/EVM)",
    kind: "production",
    reason: "Writing, testing and auditing contracts is the core deliverable of blockchain developers.",
    aliases: ["solidity", "smart contract", "smart contracts", "ethereum", "evm", "hardhat", "truffle", "foundry", "ethers", "web3js"],
  },
  mobile_framework: {
    label: "Mobile Development (Android/iOS/Flutter/RN)",
    kind: "production",
    reason: "Platform SDKs, lifecycle and state management on at least one mobile stack are mandatory.",
    aliases: ["android", "kotlin", "swift", "ios", "flutter", "dart", "react native", "swiftui", "jetpack", "xcode", "android studio", "mobile application development", "mobile app development"],
    implies: [],
  },

  // ---- Business, finance, HR, marketing, operations ----
  management_principles: {
    label: "Management Principles & Organisational Behaviour",
    kind: "foundation",
    reason: "How organisations plan, lead and motivate people is the base for every management role.",
    aliases: ["management concepts", "management principles", "principles of management", "organizational behaviour", "organizational behavior", "organisational behaviour", "organisational behavior", "management"],
  },
  business_communication: {
    label: "Professional & Business Communication",
    kind: "foundation",
    reason: "Writing, presenting and negotiating clearly is assessed in almost every business interview.",
    aliases: ["professional communication", "business communication", "communicative english", "communication skills", "campus to corporate", "presentation skills", "workplace skills"],
  },
  business_law: {
    label: "Business & Company Law",
    kind: "foundation",
    reason: "Contracts, company law and compliance basics are expected in management, finance and HR roles.",
    aliases: ["business law", "business laws", "company law", "company laws", "corporate law", "contract law"],
  },
  business_statistics_excel: {
    label: "Business Statistics & Excel",
    kind: "foundation",
    reason: "Summarising data and building models in Excel is used daily in business roles.",
    aliases: ["business statistics", "excel", "ms excel", "advanced excel", "data analysis using excel", "data analysis using ms excel", "spreadsheet", "spreadsheets"],
  },
  entrepreneurship: {
    label: "Entrepreneurship & Business Planning",
    kind: "foundation",
    reason: "Founders and business-development roles need to build and test a business plan.",
    aliases: ["entrepreneurship", "entrepreneurship skills", "startup", "startups", "business plan", "business planning", "venture"],
  },
  accounting_fundamentals: {
    label: "Financial Accounting",
    kind: "foundation",
    reason: "Journals, ledgers, financial statements and reconciliation are the base of every finance role.",
    aliases: ["financial accounting", "accounting", "accounting for managers", "corporate accounting", "bookkeeping", "tally", "financial statements"],
  },
  cost_management: {
    label: "Cost & Management Accounting",
    kind: "foundation",
    reason: "Costing, budgeting and variance analysis drive pricing and profitability decisions.",
    aliases: ["cost accounting", "cost and management accounting", "management accounting", "costing", "budgeting"],
  },
  taxation: {
    label: "Taxation (Income Tax & GST)",
    kind: "foundation",
    reason: "Tax computation and filing knowledge is core to accounting, audit and advisory roles.",
    aliases: ["taxation", "taxation laws", "income tax", "gst", "tax"],
  },
  financial_management: {
    label: "Financial Management",
    kind: "foundation",
    reason: "Capital structure, working capital and investment decisions are the heart of corporate finance.",
    aliases: ["financial management", "corporate finance", "working capital", "capital budgeting", "finance"],
  },
  financial_markets: {
    label: "Financial Markets & Securities",
    kind: "production",
    reason: "Equity, debt and derivatives markets, and how securities are analysed and traded.",
    aliases: ["financial markets", "financial markets and services", "securities", "security analysis", "portfolio management", "derivatives", "derivatives market", "equity research", "stock market"],
  },
  banking_insurance: {
    label: "Banking, Financial Services & Insurance",
    kind: "foundation",
    reason: "Products, regulation and operations of banks and insurers (BFSI).",
    aliases: ["banking", "financial services", "insurance", "bfsi"],
  },
  audit_compliance: {
    label: "Audit, Governance & Compliance",
    kind: "production",
    reason: "Audit procedures, corporate governance and regulatory compliance are expected in finance and advisory roles.",
    aliases: ["audit", "auditing", "corporate governance", "governance", "compliance", "esg", "csr", "risk management"],
  },
  financial_modelling: {
    label: "Financial Modelling & Analytics",
    kind: "production",
    reason: "Forecasting and valuation models in a spreadsheet or code are a hiring filter for analyst roles.",
    aliases: ["financial modelling", "financial modeling", "financial analytics", "valuation", "dcf"],
  },
  marketing_fundamentals: {
    label: "Marketing Fundamentals",
    kind: "foundation",
    reason: "Segmentation, targeting, positioning and the marketing mix are the base of every marketing role.",
    aliases: ["principles of marketing", "marketing management", "essentials of marketing", "marketing"],
  },
  consumer_behavior: {
    label: "Consumer Behaviour",
    kind: "foundation",
    reason: "Understanding what drives buying decisions underpins campaign and product choices.",
    aliases: ["consumer behavior", "consumer behaviour", "buyer behaviour", "buyer behavior"],
  },
  digital_marketing: {
    label: "Digital & Performance Marketing (SEO, Ads, Social)",
    kind: "production",
    reason: "Running and measuring paid, organic and social campaigns is the day-to-day work of modern marketing.",
    aliases: ["digital marketing", "digital and social media marketing", "social media marketing", "social media", "seo", "sem", "performance marketing", "content marketing", "google ads", "email marketing", "affiliate marketing", "e commerce", "generative engine optimization"],
  },
  brand_management: {
    label: "Brand & Product Management",
    kind: "production",
    reason: "Positioning, brand building and integrated communication across channels.",
    aliases: ["brand management", "product and brand management", "product management", "integrated marketing communication", "imc", "branding", "brand"],
  },
  sales_distribution: {
    label: "Sales & Distribution",
    kind: "production",
    reason: "Pipeline, channel and key-account handling are core to sales and business-development roles.",
    aliases: ["sales and distribution", "sales management", "sales", "crm", "distribution management", "channel management"],
  },
  marketing_analytics: {
    label: "Marketing Analytics",
    kind: "production",
    reason: "Measuring campaign return and attribution separates guesswork from marketing practice.",
    aliases: ["marketing analytics", "google analytics", "campaign analytics", "web analytics"],
  },
  hrm: {
    label: "Human Resource Management",
    kind: "foundation",
    reason: "Recruitment, onboarding, employee relations and HR policy form the base of HR roles.",
    aliases: ["human resource management", "human resources", "hrm", "hr", "talent acquisition", "talent management", "recruitment", "recruiting", "payroll"],
  },
  training_development: {
    label: "Training & Development",
    kind: "foundation",
    reason: "Needs analysis, designing training and measuring its effect.",
    aliases: ["training and development", "training development", "competency based training", "learning and development", "l and d"],
  },
  performance_compensation: {
    label: "Performance & Compensation Management",
    kind: "foundation",
    reason: "Appraisal systems, pay structures and benefits design.",
    aliases: ["performance and compensation management", "performance management", "compensation", "compensation and benefits", "appraisal"],
  },
  org_change: {
    label: "Organisational Change & Development",
    kind: "foundation",
    reason: "Leading change and improving organisational effectiveness.",
    aliases: ["organizational change", "organisational change", "organizational development", "organisational development", "change management"],
  },
  hr_analytics: {
    label: "HR / People Analytics",
    kind: "production",
    reason: "Using data on attrition, hiring and performance to support people decisions.",
    aliases: ["hr analytics", "people analytics", "workforce analytics"],
  },
  labour_law: {
    label: "Labour & Employment Law",
    kind: "foundation",
    reason: "HR roles must handle statutory compliance, contracts and workplace regulation.",
    aliases: ["labour law", "labour laws", "labor law", "labor laws", "employment law", "industrial relations"],
  },
  operations_management: {
    label: "Operations Management",
    kind: "foundation",
    reason: "Process design, capacity planning and service or production flow.",
    aliases: ["operations management", "operations and supply chain management", "production management", "operations planning", "operations"],
  },
  supply_chain: {
    label: "Supply Chain & Logistics",
    kind: "production",
    reason: "Procurement, inventory, warehousing and distribution flows.",
    aliases: ["supply chain", "supply chain management", "logistics", "procurement", "inventory management", "inventory", "warehouse management", "warehousing"],
  },
  quality_improvement: {
    label: "Quality & Process Improvement (Lean / Six Sigma)",
    kind: "production",
    reason: "Reducing waste and variation is a standard expectation in operations roles.",
    aliases: ["six sigma", "lean", "lean manufacturing", "tqm", "total quality management", "quality management", "kaizen", "process improvement"],
  },
  ops_analytics: {
    label: "Operations & Supply Chain Analytics",
    kind: "production",
    reason: "Forecasting demand, optimising routes and stock using data.",
    aliases: ["supply chain and operations analytics", "operations analytics", "supply chain analytics", "operations research", "demand forecasting"],
  },
  erp_tools: {
    label: "ERP Tools (SAP / Oracle)",
    kind: "production",
    reason: "Most mid-size and large employers run operations on an ERP system.",
    aliases: ["erp", "sap", "enterprise resource planning", "oracle erp", "microsoft dynamics"],
  },
  project_management: {
    label: "Project Management",
    kind: "production",
    reason: "Planning, scheduling and tracking delivery against scope, time and cost.",
    aliases: ["project management", "pmp", "agile", "scrum", "prince2", "software engineering and project management"],
  },
  business_analytics: {
    label: "Business Analytics",
    kind: "production",
    reason: "Turning business data into decisions through reporting and analysis.",
    aliases: ["business analytics", "business analysis", "business analyst", "analytics", "business intelligence", "data analytics"],
  },
  bi_tools: {
    label: "BI & Dashboard Tools (Power BI / Tableau)",
    kind: "production",
    reason: "Dashboarding tools are the standard way analysts share results.",
    aliases: ["power bi", "tableau", "looker", "qlik", "data studio", "business intelligence tools", "business intelligence", "data visualization"],
  },
};

// Skill X also proves skill Y (e.g. knowing Next.js means you know React/JS).
const IMPLICATIONS: Record<string, string[]> = {
  deep_learning: ["ml", "python"],
  ml: ["python"],
  data_wrangling: ["python"],
  kubernetes: ["docker"],
  backend_framework: ["rest_api"],
  javascript: ["programming"],
  frontend_framework: ["javascript", "html_css"],
  python: ["programming"],
  mobile_framework: ["programming"],
};

// ---------------------------------------------------------------------------
// Role-family templates: which skills are mandatory for a role family.
// ---------------------------------------------------------------------------
const REQUIREMENTS: Record<RoleFamily, { label: string; confidence: "high" | "medium" | "low"; skills: string[] }> = {
  sde: {
    label: "Software Engineer",
    confidence: "medium",
    skills: ["programming", "dsa", "oop", "dbms_sql", "git", "os", "networks", "rest_api", "system_design", "docker", "redis", "messaging", "observability"],
  },
  backend: {
    label: "Backend Engineer",
    confidence: "high",
    skills: ["programming", "dsa", "dbms_sql", "git", "os", "networks", "backend_framework", "rest_api", "docker", "redis", "messaging", "microservices", "system_design", "cloud", "observability"],
  },
  frontend: {
    label: "Frontend Engineer",
    confidence: "high",
    skills: ["javascript", "typescript", "html_css", "frontend_framework", "git", "rest_api", "dsa", "testing", "web_perf"],
  },
  fullstack: {
    label: "Full Stack Engineer",
    confidence: "high",
    skills: ["javascript", "typescript", "html_css", "frontend_framework", "backend_framework", "rest_api", "dbms_sql", "git", "dsa", "docker", "cloud", "testing"],
  },
  devops: {
    label: "DevOps / Cloud / SRE",
    confidence: "high",
    skills: ["linux", "networks", "os", "git", "programming", "docker", "kubernetes", "cicd", "iac", "cloud", "observability"],
  },
  data_ai: {
    label: "Data Science / AI Engineer",
    confidence: "high",
    skills: ["python", "statistics_math", "dsa", "dbms_sql", "data_wrangling", "ml", "deep_learning", "mlops", "git", "cloud"],
  },
  data_eng: {
    label: "Data Engineer / Analyst",
    confidence: "high",
    skills: ["python", "dbms_sql", "nosql", "big_data", "data_wrangling", "cloud", "messaging", "git", "dsa", "linux"],
  },
  security: {
    label: "Security Engineer / Analyst",
    confidence: "high",
    skills: ["networks", "os", "linux", "security_fundamentals", "security_tools", "cryptography", "python", "cloud"],
  },
  blockchain: {
    label: "Blockchain Developer",
    confidence: "high",
    skills: ["programming", "dsa", "blockchain_fundamentals", "solidity", "cryptography", "javascript", "git", "rest_api", "testing"],
  },
  mobile: {
    label: "Mobile Developer",
    confidence: "high",
    skills: ["programming", "oop", "dsa", "mobile_framework", "rest_api", "git", "dbms_sql", "testing"],
  },
  qa: {
    label: "QA / Test Automation",
    confidence: "high",
    skills: ["programming", "testing", "qa_manual", "git", "dbms_sql", "rest_api", "cicd", "linux"],
  },
  marketing: {
    label: "Marketing",
    confidence: "high",
    skills: ["marketing_fundamentals", "consumer_behavior", "digital_marketing", "brand_management", "sales_distribution", "marketing_analytics", "business_communication", "business_statistics_excel"],
  },
  finance: {
    label: "Finance & Accounting",
    confidence: "high",
    skills: ["accounting_fundamentals", "cost_management", "taxation", "financial_management", "financial_markets", "banking_insurance", "audit_compliance", "financial_modelling", "business_statistics_excel"],
  },
  hr: {
    label: "Human Resources",
    confidence: "high",
    skills: ["management_principles", "hrm", "training_development", "performance_compensation", "org_change", "hr_analytics", "labour_law", "business_communication"],
  },
  operations: {
    label: "Operations & Supply Chain",
    confidence: "high",
    skills: ["management_principles", "operations_management", "supply_chain", "quality_improvement", "ops_analytics", "erp_tools", "business_statistics_excel", "project_management"],
  },
  bizanalytics: {
    label: "Business Analytics / BI",
    confidence: "high",
    skills: ["business_statistics_excel", "dbms_sql", "data_wrangling", "bi_tools", "business_analytics", "statistics_math", "business_communication"],
  },
  business: {
    label: "General Management & Business Development",
    confidence: "medium",
    skills: ["management_principles", "business_communication", "marketing_fundamentals", "accounting_fundamentals", "financial_management", "business_law", "business_statistics_excel", "sales_distribution", "entrepreneurship"],
  },
  generic: {
    label: "General software fundamentals",
    confidence: "low",
    skills: ["programming", "dsa", "oop", "dbms_sql", "git"],
  },
};

// Order matters: first match wins.
const FAMILY_KEYWORDS: [RoleFamily, string[]][] = [
  ["blockchain", ["blockchain", "smart contract", "web3", "solidity"]],
  ["security", ["security", "cybersecurity", "cyber", "penetration", "pentest", "soc", "infosec", "ethical hacker", "ethical hacking"]],
  ["fullstack", ["full stack", "fullstack", "mern", "mean stack"]],
  ["mobile", ["mobile", "android", "ios", "flutter", "react native"]],
  ["frontend", ["frontend", "front end", "ui developer", "ui engineer", "react", "angular", "vue", "web developer", "web designer"]],
  ["data_ai", ["ai", "artificial intelligence", "machine learning", "ml", "nlp", "computer vision", "vision", "data scientist", "deep learning", "llm", "generative"]],
  ["devops", ["devops", "sre", "site reliability", "cloud", "kubernetes", "platform engineer", "infrastructure", "systems administrator", "sysadmin"]],
  ["bizanalytics", ["business intelligence", "business analyst", "business analytics", "analytics lead"]],
  ["data_eng", ["data engineer", "big data", "etl", "data platform", "data analyst", "business intelligence", "data analytics", "data warehouse"]],
  ["qa", ["qa", "quality assurance", "software tester", "test automation", "sdet", "tester", "software test"]],
  ["backend", ["backend", "back end", "server side", "api", "golang", "microservices", "distributed", "database", "java developer", "python developer", "php developer", "net developer", "net programmer"]],
  ["finance", ["finance", "financial", "accounting", "accountant", "audit", "tax", "taxation", "banking", "investment", "securities", "equity", "credit", "loan", "wealth", "portfolio", "treasury", "insurance", "cost", "governance", "esg", "compliance"]],
  ["hr", ["hr", "human resource", "human resources", "talent", "recruit", "recruiter", "payroll", "people analytics", "learning and development"]],
  ["marketing", ["marketing", "brand", "seo", "advertising", "social media", "market research", "consumer", "content strategist"]],
  ["business", ["hospital", "healthcare"]],
  ["operations", ["operations", "supply chain", "logistics", "procurement", "inventory", "warehouse", "production planning"]],
  ["sde", ["software", "sde", "programmer", "application developer", "computer programmer", "systems engineer", "software engineer"]],
  ["business", ["business", "management", "manager", "consultant", "sales", "entrepreneur", "founder", "startup", "strategy", "corporate communications", "client relationship", "executive", "director"]],
];

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------
function normalize(input: string): string {
  return (
    " " +
    input
      .toLowerCase()
      .replace(/\.js\b/g, "js")
      .replace(/[_-]/g, " ")
      .replace(/[()[\]{}:;,|&\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim() +
    " "
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A word boundary that treats + and # as part of a word, so "c" does not match "c++" or "c#".
function phraseRegex(alias: string): RegExp {
  return new RegExp("(^|[^a-z0-9+#])" + escapeRegExp(normalize(alias).trim()) + "($|[^a-z0-9+#])");
}

const COMPILED: { id: string; alias: string; re: RegExp }[] = [];
for (const [id, def] of Object.entries(SKILLS)) {
  for (const alias of def.aliases) {
    COMPILED.push({ id, alias, re: phraseRegex(alias) });
  }
}

const FAMILY_COMPILED: [RoleFamily, RegExp[]][] = FAMILY_KEYWORDS.map(([fam, kws]) => [
  fam,
  kws.map((k) => new RegExp("\\b" + escapeRegExp(k) + "\\b")),
]);

function normalizeTitle(role: string): string {
  return role.toLowerCase().replace(/[-_/]/g, " ").replace(/[^a-z0-9+#. ]/g, " ").replace(/\s+/g, " ").trim();
}

export function detectRoleFamily(role: string): RoleFamily {
  const t = normalizeTitle(role);
  for (const [fam, res] of FAMILY_COMPILED) {
    if (res.some((re) => re.test(t))) return fam;
  }
  return "generic";
}

/** Returns skillId -> list of things in the input that proved it. */
function detectSkills(text: string, withImplications = true): Map<string, string[]> {
  const norm = normalize(text);
  const found = new Map<string, string[]>();
  for (const { id, alias, re } of COMPILED) {
    if (re.test(norm)) {
      const list = found.get(id) ?? [];
      if (!list.includes(alias)) list.push(alias);
      found.set(id, list);
    }
  }
  // propagate implications until stable
  let changed = withImplications;
  while (changed) {
    changed = false;
    for (const [id, ev] of Array.from(found.entries())) {
      const targets = [...(IMPLICATIONS[id] ?? []), ...(SKILLS[id]?.implies ?? [])];
      for (const t of targets) {
        if (!found.has(t)) {
          found.set(t, ["via " + (ev[0] ?? SKILLS[id].label)]);
          changed = true;
        }
      }
    }
  }
  return found;
}

function findUnrecognized(text: string): string[] {
  const parts = text
    .split(/[,;\n|]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && p.length <= 40);
  const out: string[] = [];
  for (const p of parts) {
    const n = normalize(p);
    // Split "A / B" style tokens so "Python/Foo" still flags only the unknown half.
    const pieces = p.split(/\s*\/\s*/);
    if (pieces.length > 1) {
      for (const piece of pieces) {
        const pn = normalize(piece);
        if (piece.trim() && !COMPILED.some((c) => c.re.test(pn))) out.push(piece.trim());
      }
    } else if (!COMPILED.some((c) => c.re.test(n))) {
      out.push(p);
    }
  }
  return Array.from(new Set(out));
}

function toItem(id: string, evidence?: string): SkillItem {
  const d = SKILLS[id];
  return { id, label: d.label, kind: d.kind, reason: d.reason, evidence };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * @param role       Target role title, e.g. "Backend Developer (Python/FastAPI/Django)"
 * @param skillsText Free text of the candidate's skills, e.g. "C++, Java, React, Python, MySQL"
 */
export function computeSkillMatch(role: string, skillsText: string): SkillMatchResult {
  const family = detectRoleFamily(role);
  const tpl = REQUIREMENTS[family];
  const found = detectSkills(skillsText || "");

  const required = tpl.skills.map((id) => toItem(id));
  const covered: SkillItem[] = [];
  const missing: SkillItem[] = [];

  for (const id of tpl.skills) {
    const ev = found.get(id);
    if (ev && ev.length > 0) covered.push(toItem(id, ev.slice(0, 3).join(", ")));
    else missing.push(toItem(id));
  }

  const percentage = required.length === 0 ? 0 : Math.round((covered.length / required.length) * 100);

  return {
    family,
    familyLabel: tpl.label,
    confidence: tpl.confidence,
    required,
    covered,
    missing,
    foundationGaps: missing.filter((m) => m.kind === "foundation"),
    productionGaps: missing.filter((m) => m.kind === "production"),
    percentage,
    unrecognized: findUnrecognized(skillsText || ""),
  };
}


// ---------------------------------------------------------------------------
// Academic (course-based) analysis for SGT students
// ---------------------------------------------------------------------------
export type AcademicStatus = "completed" | "in_progress" | "upcoming" | "self_learn";

export interface AcademicSkillRow {
  skill: SkillItem;
  status: AcademicStatus;
  /** Course title that taught (or will teach) the skill, matched by keyword. */
  viaCourse?: string;
  /** Semester of the upcoming course (only for status "upcoming"). */
  semester?: number;
}

export interface AcademicGapResult {
  family: RoleFamily;
  familyLabel: string;
  confidence: "high" | "medium" | "low";
  rows: AcademicSkillRow[];
  counts: Record<AcademicStatus, number>;
  total: number;
  /** % of required skills already covered by completed courses. */
  readyNowPercent: number;
  /** % covered once current and mapped upcoming courses are finished. */
  afterSyllabusPercent: number;
}

export interface CourseGroups {
  completed: string[];
  inProgress: string[];
  upcoming: { semester: number; courses: string[] }[];
}

/** Skill ids present in a single course title. Implications are off: a title only proves what it says. */
function skillsInTitle(title: string): Set<string> {
  return new Set(detectSkills(title, false).keys());
}

/** Labels of the goal skills a given course title relates to (for tagging course lists). */
export function goalSkillsInCourse(role: string, course: string): string[] {
  const tpl = REQUIREMENTS[detectRoleFamily(role)];
  const ids = skillsInTitle(course);
  return tpl.skills.filter((id) => ids.has(id)).map((id) => SKILLS[id].label);
}

export function analyzeAcademicGap(role: string, groups: CourseGroups): AcademicGapResult {
  const family = detectRoleFamily(role);
  const tpl = REQUIREMENTS[family];

  const firstCourseWith = (id: string, courses: string[]): string | undefined =>
    courses.find((c) => skillsInTitle(c).has(id));

  const rows: AcademicSkillRow[] = tpl.skills.map((id) => {
    const skill = toItem(id);

    const done = firstCourseWith(id, groups.completed);
    if (done) return { skill, status: "completed", viaCourse: done };

    const now = firstCourseWith(id, groups.inProgress);
    if (now) return { skill, status: "in_progress", viaCourse: now };

    const sorted = [...groups.upcoming].sort((a, b) => a.semester - b.semester);
    for (const g of sorted) {
      const hit = firstCourseWith(id, g.courses);
      if (hit) return { skill, status: "upcoming", viaCourse: hit, semester: g.semester };
    }
    return { skill, status: "self_learn" };
  });

  const counts: Record<AcademicStatus, number> = { completed: 0, in_progress: 0, upcoming: 0, self_learn: 0 };
  for (const r of rows) counts[r.status] += 1;
  const total = rows.length;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  return {
    family,
    familyLabel: tpl.label,
    confidence: tpl.confidence,
    rows,
    counts,
    total,
    readyNowPercent: pct(counts.completed),
    afterSyllabusPercent: pct(counts.completed + counts.in_progress + counts.upcoming),
  };
}

/** Labels of every catalogue skill that literally appears in the text (no implied skills). */
export function detectSkillLabels(text: string): string[] {
  const found = detectSkills(text, false);
  return Array.from(found.keys()).map((id) => SKILLS[id].label);
}
