import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '@lib/site';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const notes = await getCollection('notes');
  const tutorials = await getCollection('tutorials');

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    ...tutorials.map((tutorial) => ({
      title: tutorial.data.title,
      description: tutorial.data.description,
      pubDate: tutorial.data.pubDate,
      link: `/tutorials/${tutorial.id}/`,
      categories: tutorial.data.tags,
    })),
    ...notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.pubDate,
      link: `/notes/${note.id}/`,
      categories: note.data.tags,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>en-us</language>`,
  });
}
