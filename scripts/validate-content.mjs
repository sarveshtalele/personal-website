#!/usr/bin/env node
/**
 * Fast pre-flight for content edits (runs in CI and `pnpm check:content`).
 * Astro's schemas already validate frontmatter at build time; this adds the
 * cross-file checks a schema cannot express.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];

// 1. Pinned / hidden / override repo names must exist in the GitHub snapshot.
const gh = JSON.parse(readFileSync(join(ROOT, 'src/data/github.json'), 'utf8'));
const names = new Set(gh.repos.map((r) => r.name));
const settings = readFileSync(join(ROOT, 'content/project-settings/projects.md'), 'utf8');
const block = (key) => {
  const m = settings.match(new RegExp(`^${key}:\\n((?:  - .+\\n)+)`, 'm'));
  return m ? [...m[1].matchAll(/  - (.+)/g)].map((x) => x[1].trim()) : [];
};
for (const name of [...block('pinned'), ...block('hidden')]) {
  if (!names.has(name))
    problems.push(`project-settings: "${name}" is not a repo in src/data/github.json (typo, or run pnpm github:sync)`);
}

// 2. Every newsletter issue has its images (folder issues and single-file issues).
const nlDir = join(ROOT, 'content/newsletter');
const issueFiles = [];
for (const name of readdirSync(nlDir)) {
  const p = join(nlDir, name);
  if (statSync(p).isDirectory()) {
    const file = ['index.md', 'index.mdx'].map((f) => join(p, f)).find(existsSync);
    if (file) issueFiles.push([name, file, p]);
    else problems.push(`newsletter/${name}: folder has no index.md`);
  } else if (/\.mdx?$/.test(name)) issueFiles.push([name, p, nlDir]);
}
for (const [name, file, dir] of issueFiles) {
  const text = readFileSync(file, 'utf8');
  if (!/^(pubDate|date):/m.test(text)) problems.push(`newsletter/${name}: add a pubDate: line to the frontmatter`);
  for (const m of text.matchAll(/\]\((\.\/[^)\s]+)\)|^cover:\s*["']?(\.\/[^"'\s]+)/gm)) {
    const rel = m[1] ?? m[2];
    if (!existsSync(join(dir, rel))) problems.push(`newsletter/${name}: image not found → ${rel}`);
  }
}

if (problems.length) {
  console.error(`✖ Content check found ${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('✔ Content check passed');
