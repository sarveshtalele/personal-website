import { render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { slugifyTag } from '@utils/format';

type Issue = CollectionEntry<'newsletter'>;

/** Reading time is injected into frontmatter by src/lib/remark-reading-time.mjs. */
export async function minutesRead(issue: Issue): Promise<number> {
  const { remarkPluginFrontmatter } = await render(issue);
  return Number(remarkPluginFrontmatter.minutesRead ?? 1);
}

/** Every topic used across issues, most used first. */
export function topicIndex(issues: Issue[]) {
  const map = new Map<string, { label: string; slug: string; count: number }>();
  for (const p of issues) {
    for (const t of p.data.tags) {
      const slug = slugifyTag(t);
      const cur = map.get(slug) ?? { label: t, slug, count: 0 };
      cur.count++;
      map.set(slug, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export const issueLabel = (n: number) => `Issue #${n}`;
