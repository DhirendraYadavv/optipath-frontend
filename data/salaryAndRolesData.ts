import rawRoles from "./all_roles.json";

export interface SalaryRoleInfo {
  role: string;
  range: string;
  overallAvg: string;
  fresherAvg: string;
  mid5Avg: string;
  lead10Avg: string;
  exec20Avg: string;
  topHubs: string[];
  scope: string;
  interviewRounds?: {
    round: string;
    focus: string;
    sampleQuestions: string[];
  }[];
  portfolioProjectIdeas?: {
    title: string;
    description: string;
    skillsUsed: string[];
    targetMetric: string;
  }[];
}

// Fallback baseline catalog if JSON is empty
const DEFAULT_ROLES: string[] = [
  "Backend Systems Engineer",
  "Full Stack Systems Architect",
  "AI & Large Language Model Engineer",
  "Machine Learning Infrastructure Engineer",
  "Cloud Platform & DevOps Architect",
  "Site Reliability Engineer (SRE)",
  "Quantitative Systems Developer",
  "Cybersecurity & Penetration Tester",
  "Data Platform Engineer",
  "Distributed Systems Architect",
  "Rust High-Performance Systems Engineer",
  "Golang Microservices Developer",
  "Frontend Architecture Specialist",
  "React & Next.js Core Engineer",
  "Mobile Applications Architect (iOS/Android)",
  "Kubernetes Platform Specialist",
  "Database & Caching Performance Engineer",
  "API & Integration Architect",
  "Computer Vision Research Engineer",
  "NLP & Conversational AI Developer",
  "Blockchain & Smart Contract Engineer",
  "Security Operations Center (SOC) Analyst",
  "Embedded Systems & IoT Engineer",
  "Product Technical Manager",
  "Enterprise Software Engineer",
  "Quality Assurance & Test Automation Architect",
  "Big Data & ETL Pipeline Engineer",
  "Cloud Security Solutions Architect",
  "Application Security Specialist",
  "Performance & Scalability Engineer"
];

// Single export: Uses all_roles.json if populated, otherwise falls back
export const ALL_500_PLUS_ROLES: string[] = 
  Array.isArray(rawRoles) && rawRoles.length > 0 
    ? (rawRoles as string[]) 
    : DEFAULT_ROLES;

// Helper to calculate distinct compensation tiers
export function getDynamicSalaryIntelligence(roleTitle: string): SalaryRoleInfo {
  const rt = roleTitle.toLowerCase();

  // Tier 1: Quant, Staff, Principal, System Architect, Distributed Systems
  if (rt.includes("quant") || rt.includes("principal") || rt.includes("architect") || rt.includes("distributed")) {
    return {
      role: roleTitle,
      range: "₹28 - 75 LPA",
      overallAvg: "₹42 LPA",
      fresherAvg: "₹14 - 18 LPA",
      mid5Avg: "₹28 - 36 LPA",
      lead10Avg: "₹45 - 60 LPA",
      exec20Avg: "₹75+ LPA",
      topHubs: ["Bengaluru", "Gurugram", "Hyderabad", "Mumbai"],
      scope: "High-frequency systems, distributed scale, and mission-critical cloud architecture.",
      interviewRounds: [
        {
          round: "Round 1: Advanced Algorithms & Low-Level Design",
          focus: "Data structures, memory layouts, and multithreading primitives.",
          sampleQuestions: ["Design a lock-free ring buffer", "Mitigate memory fragmentation in real-time execution"]
        },
        {
          round: "Round 2: Distributed Systems Architecture",
          focus: "CAP theorem tradeoffs, consensus algorithms (Raft/Paxos), and partition tolerance.",
          sampleQuestions: ["Design a distributed rate limiter across 5 geographic regions", "Mitigate split-brain scenarios"]
        }
      ],
      portfolioProjectIdeas: [
        {
          title: "Distributed Key-Value Store with Raft Consensus",
          description: "High-throughput replicated log implementation with automated leader election and log compaction.",
          skillsUsed: ["Golang/C++", "gRPC", "Distributed Consensus", "Docker"],
          targetMetric: "Sub-5ms replication latency under 10k concurrent write requests."
        }
      ]
    };
  }

  // Tier 2: AI / ML, LLMs, NLP, Computer Vision
  if (rt.includes("ai") || rt.includes("machine learning") || rt.includes("nlp") || rt.includes("vision") || rt.includes("data scientist")) {
    return {
      role: roleTitle,
      range: "₹16 - 48 LPA",
      overallAvg: "₹26 LPA",
      fresherAvg: "₹9.5 - 14 LPA",
      mid5Avg: "₹20 - 28 LPA",
      lead10Avg: "₹36 - 48 LPA",
      exec20Avg: "₹65+ LPA",
      topHubs: ["Bengaluru", "Hyderabad", "Noida", "Pune"],
      scope: "Generative AI deployment, fine-tuning large models, and high-performance vector retrieval pipelines.",
      interviewRounds: [
        {
          round: "Round 1: Machine Learning Foundations & Linear Algebra",
          focus: "Loss functions, transformer attention mechanics, and gradient optimization.",
          sampleQuestions: ["Derive multi-head self-attention time complexity", "Explain KV cache optimization in LLMs"]
        },
        {
          round: "Round 2: Production AI Pipeline Design",
          focus: "Model quantization (GGUF/AWQ), latency budgeting, and vector indexing.",
          sampleQuestions: ["Design a RAG system indexing 50M legal documents with sub-800ms retrieval"]
        }
      ],
      portfolioProjectIdeas: [
        {
          title: "Low-Latency RAG Ingestion & Vector Search Engine",
          description: "End-to-end semantic search engine featuring hybrid dense/sparse retrieval and reranking.",
          skillsUsed: ["Python", "FastAPI", "Vector DB (Chroma/Milvus)", "PyTorch"],
          targetMetric: "Retrieval and rerank completed in under 450ms across 100k indexed vectors."
        }
      ]
    };
  }

  // Tier 3: SRE, DevOps, Cloud, Kubernetes, Security
  if (rt.includes("sre") || rt.includes("devops") || rt.includes("cloud") || rt.includes("kubernetes") || rt.includes("security") || rt.includes("penetration")) {
    return {
      role: roleTitle,
      range: "₹14 - 38 LPA",
      overallAvg: "₹22 LPA",
      fresherAvg: "₹8 - 12 LPA",
      mid5Avg: "₹18 - 25 LPA",
      lead10Avg: "₹30 - 42 LPA",
      exec20Avg: "₹55+ LPA",
      topHubs: ["Bengaluru", "Gurugram", "Hyderabad", "Pune"],
      scope: "Zero-downtime infrastructure orchestration, Kubernetes auto-scaling, and perimeter defense.",
      interviewRounds: [
        {
          round: "Round 1: Linux Kernel, Networking & OS Internals",
          focus: "TCP/IP handshake, cgroups, namespaces, and disk I/O diagnostics.",
          sampleQuestions: ["Diagnose packet loss using tcpdump and netstat", "Explain Linux namespaces in Docker isolation"]
        },
        {
          round: "Round 2: High Availability Infrastructure Design",
          focus: "Horizontal Pod Autoscaling, multi-region ingress, and disaster recovery.",
          sampleQuestions: ["Design an automated Canary deployment pipeline with zero downtime rollback"]
        }
      ],
      portfolioProjectIdeas: [
        {
          title: "Production Kubernetes GitOps Cluster with Monitoring",
          description: "Automated deployment pipeline featuring ArgoCD, Prometheus alerting, and ingress rate limiting.",
          skillsUsed: ["Kubernetes", "Helm", "Docker", "Prometheus", "GitHub Actions"],
          targetMetric: "Automated zero-downtime rolling update with 99.99% pod uptime."
        }
      ]
    };
  }

  // Tier 4: Backend, Golang, Rust, Microservices
  if (rt.includes("backend") || rt.includes("golang") || rt.includes("rust") || rt.includes("microservices")) {
    return {
      role: roleTitle,
      range: "₹12 - 35 LPA",
      overallAvg: "₹19.5 LPA",
      fresherAvg: "₹7.5 - 11 LPA",
      mid5Avg: "₹16 - 24 LPA",
      lead10Avg: "₹28 - 38 LPA",
      exec20Avg: "₹50+ LPA",
      topHubs: ["Bengaluru", "Gurugram", "Noida", "Hyderabad", "Pune"],
      scope: "High-throughput asynchronous APIs, relational/caching layers, and microservices decoupling.",
      interviewRounds: [
        {
          round: "Round 1: Data Structures & Concurrency",
          focus: "Graph traversals, dynamic programming, and goroutine/async event loops.",
          sampleQuestions: ["Implement an LRU Cache with O(1) get and put", "Explain asyncio event loop scheduling"]
        },
        {
          round: "Round 2: Relational Databases & Caching Design",
          focus: "B-Tree indexes, transaction isolation levels, and cache stampede mitigation.",
          sampleQuestions: ["Explain why composite index on (A, B) cannot index search strictly by B"]
        }
      ],
      portfolioProjectIdeas: [
        {
          title: "High-Throughput Asynchronous Order Processing Gateway",
          description: "Containerized microservice processing payments with Redis idempotency keys and PostgreSQL locking.",
          skillsUsed: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
          targetMetric: "Sustains 12k req/sec with p99 response times under 22ms."
        }
      ]
    };
  }

  // Tier 5: Full Stack, Frontend, React, Next.js, Mobile
  if (rt.includes("full stack") || rt.includes("frontend") || rt.includes("react") || rt.includes("mobile") || rt.includes("web")) {
    return {
      role: roleTitle,
      range: "₹10 - 30 LPA",
      overallAvg: "₹17 LPA",
      fresherAvg: "₹6.5 - 9.5 LPA",
      mid5Avg: "₹14 - 21 LPA",
      lead10Avg: "₹24 - 34 LPA",
      exec20Avg: "₹45+ LPA",
      topHubs: ["Bengaluru", "Gurugram", "Pune", "Mumbai", "Noida"],
      scope: "Server-side rendering, type-safe full-stack platforms, Core Web Vitals optimization, and state design.",
      interviewRounds: [
        {
          round: "Round 1: JavaScript Engine Internals & React Architecture",
          focus: "Event loop, closures, React fiber reconciler, and server components.",
          sampleQuestions: ["Explain how Next.js Server Components differ from SSR", "Optimize re-renders in deep DOM trees"]
        },
        {
          round: "Round 2: End-to-End Application Design",
          focus: "Client caching, state synchronization, and authenticated API integrations.",
          sampleQuestions: ["Design an offline-first collaborative document editor"]
        }
      ],
      portfolioProjectIdeas: [
        {
          title: "Enterprise SaaS Platform with Real-Time Analytics",
          description: "Production Next.js App Router application with role-based access control and live webhook processing.",
          skillsUsed: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
          targetMetric: "Achieves 100% Google Lighthouse score with First Contentful Paint < 90ms."
        }
      ]
    };
  }

  // Default Baseline: Quality, Data Analyst, Technical Engineering
  return {
    role: roleTitle,
    range: "₹8 - 24 LPA",
    overallAvg: "₹14.5 LPA",
    fresherAvg: "₹5.5 - 8.5 LPA",
    mid5Avg: "₹12 - 18 LPA",
    lead10Avg: "₹20 - 28 LPA",
    exec20Avg: "₹38+ LPA",
    topHubs: ["Delhi NCR", "Bengaluru", "Hyderabad", "Pune"],
    scope: "Testing frameworks, quality assurance automation, business analytics, and data pipeline execution.",
    interviewRounds: [
      {
        round: "Round 1: Programming & Query Optimization",
        focus: "SQL window functions, test automation frameworks, and debugging.",
        sampleQuestions: ["Write a query to find the 2nd highest salary per department", "Automate E2E testing with Playwright"]
      }
    ],
    portfolioProjectIdeas: [
      {
        title: "Automated E2E Testing & Test Coverage Harness",
        description: "Automated regression test suite integrating API schema assertions and synthetic UI flows.",
        skillsUsed: ["Python/TypeScript", "Playwright", "Docker", "CI/CD"],
        targetMetric: "Executes 250+ regression tests in under 3 minutes in CI."
      }
    ]
  };
}