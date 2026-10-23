import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, getProfile } from '@lib/content';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const { data: profile } = await getProfile();
  return rss({
    title: `${profile.name} · Blog`,
    description: profile.summary,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      categories: [p.data.category, ...p.data.tags],
    })),
    customData: '<language>en</language>',
  });
}
