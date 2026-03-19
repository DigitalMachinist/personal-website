export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
}

export const resume: ResumeData = {
  name: 'Jeff Rose',
  title: 'Staff Software Engineer',
  summary:
    'Backend-focused engineer with deep expertise in Laravel, PHP, and regulated financial systems. Passionate about building reliable, maintainable software and mentoring engineering teams. Side interest in game development and creative coding.',
  experience: [
    {
      company: 'Financier Corp',
      role: 'Staff Software Engineer',
      period: '2022 — Present',
      description:
        'Leading backend architecture for payment processing and compliance systems. Designed and implemented a multi-tenant billing platform handling millions in monthly transactions. Mentoring a team of six engineers across two squads.',
    },
    {
      company: 'Ledger Systems Inc.',
      role: 'Senior Software Engineer',
      period: '2019 — 2022',
      description:
        'Built and maintained core banking APIs for a digital lending platform. Introduced comprehensive integration testing with real payment processor sandboxes, reducing production incidents by 40%.',
    },
    {
      company: 'WebCraft Studio',
      role: 'Full-Stack Developer',
      period: '2016 — 2019',
      description:
        'Developed client-facing web applications using Laravel and Vue.js. Led migration from monolithic architecture to service-oriented design. Established CI/CD pipelines and code review culture.',
    },
  ],
  education: [
    {
      institution: 'University of Toronto',
      degree: 'B.Sc. Computer Science',
      period: '2012 — 2016',
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['PHP', 'TypeScript', 'JavaScript', 'C#', 'SQL', 'Python'],
    },
    {
      category: 'Frameworks',
      items: ['Laravel', 'Vue.js', 'Astro', 'Unity', 'Godot'],
    },
    {
      category: 'Infrastructure',
      items: ['PostgreSQL', 'Redis', 'Docker', 'Cloudflare Workers', 'AWS'],
    },
    {
      category: 'Practices',
      items: ['System Design', 'Code Review', 'TDD', 'CI/CD', 'Mentoring'],
    },
  ],
};
