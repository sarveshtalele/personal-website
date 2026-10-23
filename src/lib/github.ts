/**
 * Build-time GitHub data (src/data/github.json, refreshed by
 * scripts/fetch-github.mjs) merged with the pin/hide/category settings from
 * src/content/project-settings/projects.md.
 */
import raw from '../data/github.json';
import { getProjectSettings } from './content';

export interface Repo {
  name: string;
  url: string;
  description: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  categories: string[];
  stars: number;
  forks: number;
  issues: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  license: string | null;
  pinned: boolean;
  pinOrder: number;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Astro: '#ff5a03',
  HTML: '#e34c26',
  Shell: '#89e051',
  'Jupyter Notebook': '#DA5B0B',
};

/** Accept only https links for repo homepages (descriptions come from GitHub). */
function safeHttps(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

export async function getRepos(): Promise<Repo[]> {
  const settings = await getProjectSettings();
  const hidden = new Set(settings.hidden);
  return raw.repos
    .filter((r) => !r.fork && !hidden.has(r.name))
    .map((r) => {
      const o = settings.overrides[r.name] ?? {};
      const pinOrder = settings.pinned.indexOf(r.name);
      const topics = r.topics ?? [];
      const categories = (o.categories ?? topics).filter((t) => t in settings.categories);
      return {
        name: r.name,
        url: r.html_url,
        description: o.description ?? r.description ?? 'No description yet.',
        homepage: safeHttps(o.demo ?? r.homepage),
        language: r.language,
        topics,
        categories,
        stars: r.stargazers_count,
        forks: r.forks_count,
        issues: r.open_issues_count,
        archived: r.archived,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        pushedAt: r.pushed_at,
        license: r.license,
        pinned: pinOrder !== -1,
        pinOrder,
      };
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.pinned) return a.pinOrder - b.pinOrder;
      return b.stars - a.stars || b.forks - a.forks;
    });
}

export async function getGithubStats() {
  const repos = await getRepos();
  const owned = raw.repos.filter((r) => !r.fork);
  const langCounts = new Map<string, number>();
  for (const r of owned) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  const langTotal = [...langCounts.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...langCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / langTotal) * 100),
      color: LANGUAGE_COLORS[name] ?? 'var(--accent)',
    }));
  const top = [...owned].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
  return {
    fetchedAt: raw.fetchedAt,
    profileUrl: raw.user.html_url,
    publicRepos: raw.user.public_repos ?? owned.length,
    stars: owned.reduce((s, r) => s + r.stargazers_count, 0),
    forks: owned.reduce((s, r) => s + r.forks_count, 0),
    mcpRepos: owned.filter((r) => (r.topics ?? []).some((t) => t.startsWith('mcp'))).length,
    agentRepos: owned.filter((r) =>
      (r.topics ?? []).some((t) => ['agentic-ai', 'ai-agents', 'claude-skills', 'agent-skills'].includes(t)),
    ).length,
    languages,
    top: top ? { name: top.name, url: top.html_url, stars: top.stargazers_count, forks: top.forks_count } : null,
    pinned: repos.filter((r) => r.pinned),
  };
}
