#!/usr/bin/env node
/**
 * Scaffold a new newsletter article:
 *   pnpm new:article "Why deterministic tools beat clever prompts"
 *   pnpm new:article "On Sisyphus and shipping" --tags "Philosophy, Craft"
 *
 * Creates content/newsletter/<slug>/index.md (+ an images/ folder) with every
 * frontmatter field filled in. The article is a draft until you set draft: false.
 * The archive, topic pages, RSS feed, search, and homepage update on the next
 * build automatically; there is nothing else to register.
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
const tags = (flag('tags') ?? '')
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean);
const title = args.join(' ').trim();

if (!title) {
  console.error('Usage: pnpm new:article "Article title" [--tags "A, B"]');
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
const dir = join(ROOT, 'content/newsletter', slug);
if (existsSync(dir)) {
  console.error(`✖ ${dir} already exists`);
  process.exit(1);
}
mkdirSync(join(dir, 'images'), { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const yamlString = (s) => JSON.stringify(s);
writeFileSync(
  join(dir, 'index.md'),
  `---
title: ${yamlString(title)}
seoTitle: ${yamlString(title.slice(0, 60))}
description: ${yamlString('One or two sentences for the article card, Google, and LinkedIn previews.')}
pubDate: ${today}
tags: [${tags.map(yamlString).join(', ')}]
# cover: ./images/cover.png
coverAlt: ''
# linkedin: https://www.linkedin.com/posts/...
draft: true
---

Start writing here.

Images: drop files into this article's images/ folder and embed them with a normal Markdown image
whose path starts with ./images/ (pnpm check:content verifies the file exists).
`
);
console.log(`✔ Created content/newsletter/${slug}/index.md (draft). Preview with: pnpm dev → /newsletter/${slug}`);
