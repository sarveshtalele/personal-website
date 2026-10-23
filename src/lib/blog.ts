import { render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { slugifyTag } from '@utils/format';

/** Reading time is injected into frontmatter by src/lib/remark-reading-time.mjs. */
export async function minutesRead(post: CollectionEntry<'blog'>): Promise<number> {
  const { remarkPluginFrontmatter } = await render(post);
  return Number(remarkPluginFrontmatter.minutesRead ?? 1);
}

export function tagIndex(posts: CollectionEntry<'blog'>[]) {
  const map = new Map<string, { label: string; slug: string; count: number }>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      const slug = slugifyTag(t);
      const cur = map.get(slug) ?? { label: t, slug, count: 0 };
      cur.count++;
      map.set(slug, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
