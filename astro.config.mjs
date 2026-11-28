// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://sarveshtalele.org',
  trailingSlash: 'ignore',
  // The blog became the newsletter; keep old links working.
  redirects: {
    '/blog': '/newsletter',
    '/blog/i-built-a-financial-ai-that-refuses-to-guess': '/newsletter',
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified(),
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
