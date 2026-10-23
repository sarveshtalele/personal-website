/**
 * Technical, rarely-changing site config. Everything about *you* (name, bio,
 * socials, skills, stats) lives in Markdown under src/content/ — see
 * src/lib/content.ts for the typed accessors.
 */
export const SITE = {
  url: 'https://sarveshtalele.org',
  locale: 'en',
  /** Short brand name used in <title> suffixes and the navbar. */
  name: 'Sarvesh Talele',
} as const;

export const GITHUB_USERNAME = 'sarveshtalele';

/** Google Analytics 4 measurement ID. Leave empty to disable analytics (and keep the CSP tight). */
export const GA_MEASUREMENT_ID = '';

/**
 * Giscus comments (https://giscus.app). Fill these in after enabling
 * Discussions on the repository — comments stay hidden until then.
 */
export const GISCUS = {
  repo: '',
  repoId: '',
  category: 'General',
  categoryId: '',
} as const;

export const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Claude', href: '/claude' },
  { label: 'About', href: '/about' },
] as const;

export const FOOTER_LINKS = [
  { label: 'Experience', href: '/experience' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Publications', href: '/publications' },
  { label: 'Mock exam', href: '/claude/quiz' },
  { label: 'Contact', href: '/contact' },
  { label: 'RSS', href: '/rss.xml' },
  { label: 'Privacy', href: '/privacy' },
] as const;
