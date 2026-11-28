/**
 * Typed accessors for the singleton Markdown files in content/.
 * Components call these instead of hard-coding personal data.
 */
import { getCollection, getEntry, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { byDateDesc } from '@utils/format';

export async function getProfile() {
  const entry = await getEntry('profile', 'sarvesh');
  if (!entry) throw new Error('Missing content/profile/sarvesh.md');
  return entry;
}

export async function getDashboard() {
  const entry = await getEntry('dashboard', 'metrics');
  if (!entry) throw new Error('Missing content/dashboard/metrics.md');
  return entry.data;
}

export async function getProjectSettings() {
  const entry = await getEntry('projectSettings', 'projects');
  if (!entry) throw new Error('Missing content/project-settings/projects.md');
  return entry.data;
}

/** Published newsletter issues, newest first, each with its issue number. Drafts show only in `pnpm dev`. */
export async function getIssues(): Promise<(CollectionEntry<'newsletter'> & { issueNo: number })[]> {
  const all = await getCollection(
    'newsletter',
    ({ id, data }) => !id.startsWith('_') && (import.meta.env.DEV || !data.draft),
  );
  const oldestFirst = all.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  return oldestFirst
    .map((e, i) => Object.assign(e, { issueNo: e.data.issue ?? i + 1 }))
    .sort(byDateDesc((p) => p.data.pubDate));
}

export { render };
