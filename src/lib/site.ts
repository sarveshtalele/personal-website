/**
 * Single source of truth for site-wide settings.
 * Update values here — every page, meta tag, and JSON-LD block reads from this file.
 */
export const SITE = {
  url: 'https://sarveshtalele.org',
  name: 'Sarvesh Talele',
  title: 'Sarvesh Talele — AI Engineer',
  description:
    'AI Engineer and Claude Certified Architect building agentic AI systems, multi-agent workflows, and enterprise LLM platforms. Writing about LangGraph, MCP, RAG, and production AI engineering.',
  author: 'Sarvesh Kishor Talele',
  locale: 'en',
  email: 'talelesarvesh@gmail.com',
  location: 'Thane, India',
  role: 'AI Engineer | Claude Certified Architect',
} as const;

export const SOCIALS = {
  github: 'https://github.com/sarveshtalele',
  linkedin: 'https://www.linkedin.com/in/sarveshtalele',
  medium: 'https://medium.com/@sarveshtalele',
  email: `mailto:${SITE.email}`,
  rss: '/rss.xml',
} as const;

export const GITHUB_USERNAME = 'sarveshtalele';

/** Google Analytics 4 measurement ID. Leave empty to disable analytics. */
export const GA_MEASUREMENT_ID = '';

/**
 * Giscus comments (https://giscus.app). Fill these in after enabling
 * Discussions on your GitHub repository — comments stay hidden until then.
 */
export const GISCUS = {
  repo: '', // e.g. 'sarveshtalele/personal-ai-website'
  repoId: '',
  category: 'General',
  categoryId: '',
} as const;

export const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Notes', href: '/notes' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'Resources', href: '/resources' },
  { label: 'Resume', href: '/resume' },
  { label: 'About', href: '/about' },
] as const;

export const SKILLS: { group: string; items: string[] }[] = [
  {
    group: 'Languages & Frameworks',
    items: ['Python', 'TypeScript', 'FastAPI', 'LangChain', 'LangGraph', 'LlamaIndex', 'Pandas', 'Scikit-learn'],
  },
  {
    group: 'AI & Agents',
    items: ['Agentic AI', 'Generative AI', 'MCP', 'Graph-RAG', 'Prompt Engineering', 'Claude', 'OpenAI', 'Gemini', 'Ollama'],
  },
  {
    group: 'Cloud & Platform',
    items: ['Azure', 'Microsoft Foundry', 'LiteLLM Proxy', 'MS SQL Server', 'Git & GitHub', 'CI/CD'],
  },
  {
    group: 'Developer Tools',
    items: ['Claude Code', 'GitHub Copilot', 'Copilot Studio', 'Codex', 'Antigravity', 'Spec-kit (SDD)'],
  },
];

export const EDUCATION = [
  {
    degree: 'Bachelor of Mechanical Engineering',
    institution: 'University of Mumbai',
    year: '2018 – 2022',
    detail: 'CGPA: 8.76/10',
  },
  {
    degree: 'HSC — Science',
    institution: 'Royal Junior College',
    year: '2016 – 2018',
    detail: '83.85%',
  },
];

/** Headline impact metrics shown as KPI tiles on the About page. */
export const STATS: { value: string; label: string }[] = [
  { value: '4+ yrs', label: 'AI engineering experience' },
  { value: '25%', label: 'TCV growth driven' },
  { value: '50K+', label: 'Daily requests served' },
  { value: '100+', label: 'Enterprise users supported' },
  { value: '45%', label: 'Manual effort reduced' },
  { value: '8x', label: 'TCS awards' },
];

/** Credibility badges shown as a strip on the About page. */
export const CREDENTIALS = [
  'Claude Certified Architect',
  'HarvardX CSAI Certified',
  'NASA ADS Published',
  'Guinness World Record Holder',
  'Google Data Analytics Certified',
];

export const ACHIEVEMENTS = [
  '8x Awards from Tata Consultancy Services Ltd.',
  'On the Spot Award — Tata Consultancy Services',
  'Guinness World Record Participant — Most Users to Take an Online Computer Programming Lesson in 24 Hours (2021)',
  'International Astronomical Search Collaboration — Asteroid Hunting Participant',
  'Top 15 internal research papers across a 10,000+ employee engineering division',
];
