export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: {
    location: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
  };
  experience: {
    company: string;
    subtitle?: string;
    roles: {
      title: string;
      period: string;
      bullets: string[];
    }[];
  }[];
  education: {
    institution: string;
    degree: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
}

export const resume: ResumeData = {
  name: 'Jeff Rose',
  title: 'Staff Backend Engineer \u2014 Distributed Systems & Financial Infrastructure',
  summary:
    'Founding engineer at Rivalry (TSX: RVLY), building the regulated betting platform\u2019s financial transaction infrastructure from inception through IPO over 9 years \u2014 distributed locking, compliance pipelines, promotional wallet systems, and cryptocurrency operations. Designed core architectural patterns still in production use nearly a decade later, and built systems end-to-end from microservice platforms to real-time game servers to regulatory reporting. Seeking a Staff or Principal role where deep platform expertise and end-to-end ownership of complex systems drive the product forward.',
  contact: {
    location: 'Toronto, ON',
    phone: '416-727-9217',
    email: 'jrose0@gmail.com',
    linkedin: 'linkedin.com/in/jrose0',
    github: 'github.com/DigitalMachinist',
  },
  experience: [
    {
      company: 'Rivalry (TSX: RVLY)',
      subtitle:
        'Founding engineer from inception through IPO; from sole backend engineer alongside the CTO to a platform processing millions in monthly wagers across regulated markets',
      roles: [
        {
          title: 'System Architect / Senior Engineer',
          period: '2023 \u2014 2026',
          bullets: [
            'Designed and built Promo V2: a split-balance wallet tracking real and bonus funds locked behind wagering rollover conditions before withdrawal. Enabled upfront matched-deposit bonuses \u2014 replacing a system where users waited until rollover completion \u2014 with split-balance transaction reporting for regulators',
            'Built cryptocurrency wallet infrastructure on Fireblocks MPC: automated deposit sweeping from per-user hot wallets to omnibus vaults, dynamic gas fee estimation across Ethereum, Solana, and BSC, and a translation layer converting crypto balances to fiat for casino providers that didn\u2019t natively support cryptocurrency',
            'Designed CasinoService: a framework standardizing casino provider integrations into a consolidated table structure and common interface for auth, wagers, wins, and rollbacks. Replaced fragmented tables and duplicated code, cutting new provider integration time',
            'Migrated the internal back-office to Laravel Filament, eliminating the Vue.js frontend dependency and accelerating internal tool development for compliance and operations teams. Required resolving production-only issues with binary UUID hydration and cross-region database replication that staging couldn\u2019t surface',
          ],
        },
        {
          title: 'Game Platform Architect',
          period: '2022 \u2014 2023',
          bullets: [
            'Designed the Games Service from scratch as a B2B microservice platform \u2014 multi-tenant architecture with HMAC-SHA256 signed API, encryption-at-rest, idempotent credit/debit processing, and recovery of interrupted game sessions to protect in-progress wagers',
            'Built a GLI-certified cryptographically secure random number generator as an isolated package \u2014 firewalled from the Games Service so no external changes could trigger re-certification, with CLI tooling for submission-ready output',
            'Built a low-latency real-time game server on uWebSockets.js supporting 2,000+ concurrent WebSocket connections, with financial transaction integrity for real-money wager placement and cashout settlement. Rewrote from Socket.io for improved throughput and WebSocket standards compliance',
          ],
        },
        {
          title: 'Platform Engineer / Regulatory Lead',
          period: '2020 \u2014 2022',
          bullets: [
            'Extended LockService so callers may declare their own locking requirements while deferring side-effects until all locks release and transactions commit \u2014 eliminating a class of race conditions where listeners read stale or rolled-back data. Adopted as a core pattern across all financial operations',
            'Built regulatory compliance infrastructure for Australia (NTRC) and Ontario (iGO): PGP-encrypted bet ledger reporting, PEP/sanctions screening, responsible gambling limits with rolling daily/weekly/monthly loss windows, and jurisdiction-aware permission rules for multi-market operations',
            'Designed and built the Rushlane real-time multiplayer pipeline: Laravel backend with Redis pub/sub transport and a live video delivery system (OBS \u2192 RTMP \u2192 Wowza \u2192 HLS) modelled on Twitch, delivering live interactive betting experiences to viewers',
          ],
        },
        {
          title: 'Founding Engineer',
          period: '2017 \u2014 2019',
          bullets: [
            'Built LockService \u2014 the platform\u2019s foundational distributed locking pattern pairing MySQL GET_LOCK() with database transactions inside clearly defined closures, ensuring consistent commit/rollback behaviour across all callers. Still in active production 9 years later.',
            'Built the platform\u2019s KYC/AML compliance pipeline: identity verification via Trulioo and Jumio, multi-factor AML risk scoring with FATF-deficient country weighting, PEP/sanctions screening, and automated deposit limits \u2014 required to retain the platform\u2019s gambling license',
            'Integrated Sportradar\u2019s Managed Trading Services (MTS) via AMQP/RabbitMQ \u2014 the core odds feed and bet acceptance system that made the sportsbook functional. Built the full bet lifecycle from match data ingestion through placement, acceptance/rejection with retry logic, and settlement',
          ],
        },
      ],
    },
    {
      company: 'Axon Interactive Inc.',
      roles: [
        {
          title: 'Founder & Lead Developer',
          period: '2014 \u2014 2017',
          bullets: [
            'Shipped Quench on Nintendo Switch and Steam \u2014 a commercial indie game passing Nintendo\u2019s lot-check certification process end-to-end. Led a 3\u20135 person games and web development company delivering client projects in Unity/C#, PHP, Laravel, and Node.js',
          ],
        },
      ],
    },
    {
      company: 'Humber College',
      roles: [
        {
          title: 'Part-Time Instructor',
          period: '2014 \u2014 2017',
          bullets: [
            'Taught game programming: Physics for Game Developers, Introduction to Web Development',
          ],
        },
      ],
    },
    {
      company: 'Aversan Inc.',
      roles: [
        {
          title: 'Software Test Engineer',
          period: '2008 \u2014 2011',
          bullets: [
            'QA testing on the F-35 Joint Strike Fighter, F-22 Raptor, C-130 Hercules, and London Underground automated subway signalling system using automated testing suites',
          ],
        },
      ],
    },
  ],
  education: [
    {
      institution: 'University of Guelph',
      degree: 'B.Eng. (Honours), Engineering Systems & Computing',
    },
    {
      institution: 'Humber College',
      degree: 'First in Class, Diploma of Game Programming',
    },
  ],
  skills: [
    { category: 'Languages', items: ['PHP', 'JavaScript/Typescript/Node.js', 'C#', 'SQL'] },
    { category: 'Frameworks', items: ['Laravel', 'Filament', 'Unity', 'Nuxt 3/Vue.js'] },
    { category: 'Databases & Caching', items: ['MySQL/Postgres', 'Redis', 'Elasticsearch'] },
    {
      category: 'Architecture',
      items: [
        'Microservice Design',
        'Event-Driven Architecture',
        'Multi-Region Distributed Systems',
        'Asynchronous Processing',
      ],
    },
    {
      category: 'Security & Compliance',
      items: [
        'Distributed Locking',
        'HMAC Signing',
        'PGP/AES Encryption',
        'KYC/AML',
        'Responsible Gambling',
        'Casino Game Fairness Certification (GLI)',
        'Regulatory Reporting',
      ],
    },
    {
      category: 'Real-Time & Messaging',
      items: [
        'WebSockets (uWebSockets.js/Socket.io)',
        'Redis Pub/Sub',
        'RabbitMQ/AMQP',
        'Pusher',
        'HLS/RTMP',
      ],
    },
    {
      category: 'Cloud, DevOps & AI',
      items: [
        'Docker/Kubernetes',
        'AWS (S3, EC2)',
        'Ansible',
        'Vercel',
        'CI/CD (CircleCI, GitHub Actions)',
        'OpenAI API',
        'Claude Code',
      ],
    },
  ],
};
