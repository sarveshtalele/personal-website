#!/usr/bin/env node
/**
 * Fetches public repositories + profile for the configured GitHub user and
 * writes src/data/github.json, which the Projects page, Dashboard, and landing
 * page read at build time (no client-side API calls, no rate limits for
 * visitors, nothing to allow in the CSP).
 *
 *   pnpm github:sync            # refresh the snapshot
 *   GITHUB_TOKEN=... pnpm build # token is optional; raises the rate limit
 *
 * If the API is unreachable (offline, rate-limited) the existing committed
 * snapshot is kept, so builds never fail because GitHub had a bad minute.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/github.json');
const USER = process.env.GITHUB_USER || 'sarveshtalele';
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': `${USER}-website-build`,
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const KEEP = [
  'name',
  'full_name',
  'html_url',
  'description',
  'homepage',
  'language',
  'topics',
  'stargazers_count',
  'forks_count',
  'open_issues_count',
  'fork',
  'archived',
  'created_at',
  'updated_at',
  'pushed_at',
  'license',
];

async function get(url) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function main() {
  const user = await get(`https://api.github.com/users/${USER}`);
  const repos = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await get(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  const clean = repos
    .filter((r) => !r.private)
    .map((r) => {
      const o = Object.fromEntries(KEEP.map((k) => [k, r[k] ?? null]));
      o.license = r.license?.spdx_id ?? null;
      o.topics = r.topics ?? [];
      return o;
    })
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  const data = {
    fetchedAt: new Date().toISOString(),
    user: {
      login: user.login,
      name: user.name,
      html_url: user.html_url,
      public_repos: user.public_repos,
      followers: user.followers,
      created_at: user.created_at,
    },
    repos: clean,
  };
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(
    `✔ GitHub: ${clean.length} repos for ${USER} (${clean.reduce((s, r) => s + r.stargazers_count, 0)} stars)`,
  );
}

main().catch((err) => {
  if (existsSync(OUT)) {
    const prev = JSON.parse(readFileSync(OUT, 'utf8'));
    console.warn(`⚠ GitHub fetch failed (${err.message}); keeping snapshot from ${prev.fetchedAt}`);
    process.exit(0);
  }
  console.error(`✖ GitHub fetch failed and no snapshot exists: ${err.message}`);
  process.exit(1);
});
