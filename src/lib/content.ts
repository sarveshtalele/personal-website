/**
 * Typed accessors for the singleton Markdown files in src/content/.
 * Components call these instead of hard-coding personal data.
 */
import { getCollection, getEntry, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { byDateDesc } from '@utils/format';

export async function getProfile() {
  const entry = await getEntry('profile', 'sarvesh');
  if (!entry) throw new Error('Missing src/content/profile/sarvesh.md');
  return entry;
}

export async function getDashboard() {
  const entry = await getEntry('dashboard', 'metrics');
  if (!entry) throw new Error('Missing src/content/dashboard/metrics.md');
  return entry.data;
}

export async function getProjectSettings() {
  const entry = await getEntry('projectSettings', 'projects');
  if (!entry) throw new Error('Missing src/content/project-settings/projects.md');
  return entry.data;
}

/** Published posts, newest first. Drafts show only in `pnpm dev`. */
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort(byDateDesc((p) => p.data.pubDate));
}

export async function getTravel() {
  const items = await getCollection('travel', ({ data }) => !data.draft);
  return items.sort(byDateDesc((t) => t.data.date));
}

export { render };
