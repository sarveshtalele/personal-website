#!/usr/bin/env node
/**
 * Scaffold a new blog post:
 *   pnpm new:blog "Why deterministic tools beat clever prompts"
 *   pnpm new:blog "On Sisyphus and shipping" --category Philosophy --tags "Camus, Craft"
 *
 * Creates src/content/blog/<slug>/index.mdx (+ an images/ folder) with every
 * frontmatter field filled in. The post is a draft until you set draft: false.
 * Cards, tag pages, the RSS feed, search, and the landing page update on the
 * next build automatically; there is nothing else to register.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const category = flag('category') ?? 'Engineering';
const tags = (flag('tags') ?? '')
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean);
const title = args.join(' ').trim();

const CATEGORIES = ['Engineering', 'Philosophy', 'Claude', 'Career'];
if (!title) {
  console.error('Usage: pnpm new:blog "Post title" [--category Engineering] [--tags "A, B"]');
  process.exit(1);
}
if (!CATEGORIES.includes(category)) {
  console.error(`--category must be one of: ${CATEGORIES.join(', ')}`);
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^\w\s-]/g, '')
  .trim()
  .replace(/[\s_]+/g, '-')
  .replace(/-+/g, '-')
  .slice(0, 80);
const dir = join(ROOT, 'src/content/blog', slug);
if (existsSync(dir)) {
  console.error(`✖ ${dir} already exists`);
  process.exit(1);
}
mkdirSync(join(dir, 'images'), { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const yamlString = (s) => JSON.stringify(s);
writeFileSync(
  join(dir, 'index.mdx'),
  `---
title: ${yamlString(title)}
description: ${yamlString('One or two sentences for the blog card and search results.')}
pubDate: ${today}
tags: [${tags.map(yamlString).join(', ')}]
category: ${category}
# cover: ./images/cover.png
coverAlt: ''
# canonical: https://medium.com/...
featured: false
draft: true
---

Start writing here.

Images: drop files into this post's images/ folder and embed them with a normal Markdown image
whose path starts with ./images/ (pnpm check:content verifies the file exists).
`,
);
console.log(`✔ Created src/content/blog/${slug}/index.mdx (draft). Preview with: pnpm dev → /blog/${slug}`);
