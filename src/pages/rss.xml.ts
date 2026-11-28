import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getIssues, getProfile } from '@lib/content';

export async function GET(context: APIContext) {
  const issues = await getIssues();
  const { data: profile } = await getProfile();
  return rss({
    title: profile.newsletter.name,
    description: profile.newsletter.tagline,
    site: context.site!,
    items: issues.map((p) => ({
      title: `Issue #${p.issueNo}: ${p.data.title}`,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/newsletter/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
